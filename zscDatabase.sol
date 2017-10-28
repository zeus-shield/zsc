pragma solidity ^0.4.11;

contract owned {
    address public owner;

    function owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner {
        owner = newOwner;
    }
}

contract SafeMath {
    function safeMul(uint a, uint b) 
        internal 
        returns (uint) 
    {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function safeSub(uint a, uint b) 
        internal returns (uint) 
    {
        assert(b <= a);
        return a - b;
    }

    function safeAdd(uint a, uint b) 
        internal 
        returns (uint) 
    {
        uint c = a + b;
        assert(c>=a && c>=b);
        return c;
    }

    function assert(bool assertion) 
        internal 
    {
        if (!assertion) throw;
    }
}

contract ZSCEntity {
    string  _name = 'NULL';  
    uint    _id = 0;
    uint    _type = 0;
    bool    _activated = false;
    address _owner = 0;
    uint    _ethValue = 0;
    uint    _zscValue = 0;

    modifier isOwner(address msger)  {
        if (msger != _owner) throw;
        _;
    }

    // Constructor
    function ZSCEntity(string name_, uint id_) 
    {
        _name = name_;
        _id   = id_;
        _owner = msg.sender;
    }

    // This unnamed function is called whenever someone tries to send ether to it 
    function() 
       payable
    {
        if (msg.value > 0) {
            _ethValue += msg.value;
            //Deposit(msg.sender, msg.value);
        }
    }

    function enName() 
        public
        isOwner(msg.sender)
        constant 
        returns (string) 
    {   
        return _name;
    }

    function enType() 
        public
        isOwner(msg.sender)
        constant 
        returns (uint) 
    {   
        return _type;
    }

    function enId() 
        public
        isOwner(msg.sender)
        constant 
        returns (uint) 
    {   
        return _id;
    }

    function enStatus() 
        public
        isOwner(msg.sender)
        constant 
        returns (bool) 
    {   
        return _activated;
    }

    function setType(uint type_) 
        public
        isOwner(msg.sender)
    { 
        _type = type_;
    }
    
    function setStatus(bool status_) 
        public
        isOwner(msg.sender)
    {   
        _activated = status_; 
    }
}

contract ZSCUser is ZSCEntity, SafeMath {
    // Constructor
    function ZSCUser(string name_, uint id_) 
        public
        ZSCEntity(name_, id_)
    {
    }
}

contract ZSCContract is ZSCEntity {
    mapping(address => uint) _providers;
    mapping(address => uint) _receivers;
    uint _totalPercentage; //range (0, 10000)

    modifier percentageRange(uint value_)  {
        if (value_ <0 || value_ >10000) throw;
        _;
    }
    // Constructor
    function ZSCContract(string name_, uint id_) 
        public
        ZSCEntity(name_, id_)
    {
    }

    function addProvider(address usr_, uint percentage_) 
        public
        percentageRange(percentage_)
    {
        _providers[usr_] = percentage_;
    }

    function addReceiver(address usr_, uint percentage_) 
        public
        percentageRange(percentage_)
    {
        _receivers[usr_] = percentage_;
    }
}

contract ZSCDatabaseUser is owned, SafeMath {
    uint _startIndex = 10000;
    uint _nos = 0;
    ZSCUser[] _users;
    mapping (string => uint) _exist;

    // Constructor
    function ZSCDatabaseUser() 
        public
    {
    }

    function insertUser(string name_) 
        public
        onlyOwner
    {
        if (_exist[name_] == 0) throw;
        uint id = _nos + _startIndex;

        ZSCUser user = new ZSCUser(name_, id);
        _users[_nos] = user;
        _exist[name_] = id;
        _nos++;
    }

    function userId(string name_)
        internal
        constant
        returns (uint)
    {
        if (_exist[name_] == 0) throw;
        return (_exist[name_] - _startIndex);
    }

    function modifyUserById(uint id_, uint type_, bool status_) 
        public
        onlyOwner
    {
        uint index = id_ - _startIndex;
        if (index >= _nos) throw;

        ZSCUser user = ZSCUser(_users[index]);
        user.setType(type_);
        user.setStatus(status_);
    }

    function modifyUserByName(string name_, uint type_, bool status_) 
        public
        onlyOwner
    {
        modifyUserById(userId(name_), type_, status_);
    }

    function getUserById(uint id_) 
        public
        onlyOwner
        constant
        returns (address)
    {
        uint index = id_ - _startIndex;
        if (index >= _nos) throw;

        return _users[index];
    }

    function getUserByName(string name_) 
        public
        onlyOwner
        constant
        returns (address)
    {
        return getUserById(userId(name_));
    }
}
