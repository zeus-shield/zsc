/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract owned {
    address public owner;

    function owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

contract SafeMath {
    function safeMul(uint a, uint b) internal pure returns (uint)
    {
        uint c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function safeSub(uint a, uint b) internal pure returns (uint)
    {
        assert(b <= a);
        return a - b;
    }

    function safeAdd(uint a, uint b) internal pure returns (uint)
    {
        uint c = a + b;
        assert(c>=a && c>=b);
        return c;
    }
    /*
    function assert(bool assertion) internal pure
    {
        require(assertion);
    }
    */
}

contract ZSCEntity {
    string  _name = 'NULL';
    uint    _id = 0;
    uint    _type = 0;
    bool    _activated = false;
    address _creator = 0;
    uint    _ethValue = 0;
    uint    _zscValue = 0;

    modifier isCreator(address msger)  {
        require(msger == _creator);
        _;
    }

    // Constructor
    function ZSCEntity(string name_, uint id_) public
    {
        _name = name_;
        _id   = id_;
        _creator = msg.sender;
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable
    {
        if (msg.value > 0) {
            _ethValue += msg.value;
            //Deposit(msg.sender, msg.value);
        }
    }

    function getName()
        public
        isCreator(msg.sender)
        constant
        returns (string)
    {
        return _name;
    }

    function getType()
        public
        isCreator(msg.sender)
        constant
        returns (uint)
    {
        return _type;
    }

    function getId()
        public
        isCreator(msg.sender)
        constant
        returns (uint)
    {
        return _id;
    }

    function getStatus()
        public
        isCreator(msg.sender)
        constant
        returns (bool)
    {
        return _activated;
    }

    function setType(uint type_)
        public
        isCreator(msg.sender)
    {
        _type = type_;
    }

    function setStatus(bool status_)
        public
        isCreator(msg.sender)
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
    //uint _totalPercentage; //range (0, 10000)

    modifier percentageRange(uint value_)  {
        require((0 <= value_) && (10000 >= value_));
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

contract ZSCDatabaseRoot is owned {
    mapping (address => bool) _isAdmin;
    address[] _admins;

    event AdminAddition(address indexed admin_);
    event AdminRemoval(address indexed admin_);

    modifier adminDoesNotExist(address admin_) {
        require(!_isAdmin[admin_]);
        _;
    }

    modifier adminExists(address admin_) {
        require(_isAdmin[admin_]);
        _;
    }

    modifier notNull(address _address) {
        require(0 != _address);
        _;
    }

    // Constructor
    function ZSCDatabaseRoot()
        public
    {
    }

    function addAdmin(address admin_)
        public
        onlyOwner
        adminDoesNotExist(admin_)
        notNull(admin_)
    {
        _isAdmin[admin_] = true;
        _admins.push(admin_);
        emit AdminAddition(admin_);
    }

    function removeOwner(address admin_)
        public
        onlyOwner
        adminExists(admin_)
    {
        _isAdmin[admin_] = false;
        for (uint i=0; i<_admins.length - 1; i++)
            if (_admins[i] == admin_) {
                _admins[i] = _admins[_admins.length - 1];
                break;
            }
        _admins.length -= 1;
        emit AdminRemoval(admin_);
    }

}


contract ZSCDatabaseUsers is owned, SafeMath {
    uint _startIndex = 10000;
    uint _nos = 0;
    ZSCUser[] _users;

    mapping(string => uint) _exist;

    // Constructor
    function ZSCDatabaseUsers()
        public
    {
    }

    function insertUser(string name_)
        public
        onlyOwner
    {
        require(0 != _exist[name_]);
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
        require(0 != _exist[name_]);
        return (_exist[name_] - _startIndex);
    }

    function modifyUserById(uint id_, uint type_, bool status_)
        public
        onlyOwner
    {
        uint index = id_ - _startIndex;
        require(index < _nos);

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
        require(index < _nos);

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
