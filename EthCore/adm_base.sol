/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract ControlApis {
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address);
    function getUserWalletAddress(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (address);
    function setUserStatus(bytes32 _user, bool _tag) public returns (bool);
    function getUserStatus(bytes32 _user) public constant returns (bool);
}

contract AdmBase is Object {
    struct TestUserInfo {
        bytes32 name_ ;
        bytes32 pass_ ;
        bytes32 status_ ; //0: not exist; 1: added; 2: applied; 3: approved;  4: locked
        bytes32 type_;    //1: provider; 2: receiver; 3: staker
        bytes32 actived_;
        address id_   ;
        address nodeAdr_ ;
        address ethAdr_ ;
        address zscAdr_ ;
    }
    uint public userNos_ = 0;

    mapping(bytes32 => bool) private userExist_;
    mapping(bytes32 => uint) private userIndex_;
    mapping(uint => TestUserInfo) private testUsers_;

    address public zscTestTokenAddress_;
    address public controlApisAdr_;
    string public controlApisFullAib_;
    uint public allocatedZSC_;

    function checkAdded(bytes32 _hexx) internal constant {
        uint index = getUserIndex(_hexx);
        bytes32 status = testUsers_[index].status_;

        require(status == "added" || status == "applied");
    }
    
    function AdmBase(bytes32 _name) public Object(_name) {}

    function toHexx(bytes32 _value) internal constant returns (bytes32);

    function getUserIndex(bytes32 _hexx) internal constant returns (uint) { 
        return userIndex_[_hexx]; 
    }

    function initAdm(address _zscTokenAdr, address _controlApisAdr) public { 
        checkDelegate(msg.sender, 1);

        zscTestTokenAddress_ = _zscTokenAdr; 
        controlApisAdr_ = _controlApisAdr;
    }

    function setZSCAmountToUser(uint _allocatedZSC) public { 
        checkDelegate(msg.sender, 1);

        allocatedZSC_ = _allocatedZSC * 1 ether;
    }

    function setControlApisFullAbi(string _fullAbi) public { 
        checkDelegate(msg.sender, 1);

        controlApisFullAib_ = _fullAbi; 
    }

    function getControlApisFullAbi() public constant returns (string) { 
        return controlApisFullAib_; 
    }

    function getControlApisAdr() public constant returns (address) { 
        return controlApisAdr_; 
    }

    function addUser(bytes32 _user, bytes32 _pass) public {
        checkDelegate(msg.sender, 1);

        addLog("add a User - ", true);
        addLog(PlatString.bytes32ToString(_user), false);

        require(userExist_[_user] == false);
        userExist_[_user] = true;

        userIndex_[toHexx(_user)] = userNos_;
        testUsers_[userNos_] = TestUserInfo(_user, _pass, "added", 0, "false", address(0), address(0), address(0), address(0));
        userNos_++;
    }

    function activeByUser(bytes32 _hexx, bytes32 _type) public {
        checkAdded(_hexx);

        uint index = getUserIndex(_hexx);
        testUsers_[index].status_ = "applied";
        testUsers_[index].type_ = _type;
        testUsers_[index].actived_ = "true";
        testUsers_[index].id_ = msg.sender;

        bytes32 userName = testUsers_[index].name_;

        //createElement(bytes32 _userName, bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo, address _extraAdr)
        testUsers_[index].nodeAdr_ = ControlApis(controlApisAdr_).createUserNode(_type, userName, msg.sender);

        address userZSCWalletAdr = ControlApis(controlApisAdr_).getUserWalletAddress(userName, "ZSC");
        
        ERC20Interface(zscTestTokenAddress_).transfer(userZSCWalletAdr, allocatedZSC_);
    
        addLog("activeByUser - ", true);
        addLog(PlatString.bytes32ToString(userName), false);
        addLog("| address - ", false);
        addLog(PlatString.addressToString(msg.sender), false);
        return;

        //ControlApis(controlApisAdr_).setUserStatus(userName, true);
    }

    function setUserActiveState(bytes32 _user, bool _tag) public {
        checkDelegate(msg.sender, 1);

        require(userExist_[_user]);

        bytes32 ret = toHexx(_user);
        uint index = getUserIndex(ret);

        if (_tag) {
            testUsers_[index].actived_ = "true";
        } else {
            testUsers_[index].actived_ = "false";
        }
        ControlApis(controlApisAdr_).setUserStatus(_user, _tag);
    }

  
    /*
    function applyForUser(bytes32 _hexx, bytes32 _type) public only_added(_hexx)  {
        uint index = getUserIndex(_hexx);
        testUsers_[index].status_ = "applied";
        testUsers_[index].type_ = _type;
        testUsers_[index].id_ = msg.sender;
    }

    function approveUser(bytes32 _name) public {
        checkDelegate(msg.sender, 1);

        bytes32 hexx = toHexx(_name);
        uint index = getUserIndex(hexx);
        require (testUsers_[index].status_ == "applied");

        bytes32 userType = testUsers_[index].type_; 
        require(userType == "provider" || userType == "receiver" || userType == "staker");

        uint typeUint;
        if (userType == "provider") typeUint = 1;
        else if (userType == "provider") typeUint = 2;
        else if (userType == "staker") typeUint = 3;

        address adr = ControlApis(systemAdrs_["controlApis"]).createElement(typeUint, testUsers_[index].name_, "", testUsers_[index].id_);
        require (adr != 0x0);
        ControlApis(systemAdrs_["controlApis"]).setUserActiveStatus(_name, true);

        testUsers_[index].node_ = adr;
        testUsers_[index].status_ = "approved";

        approveWallet(systemAdrs_["controlApis"], userType, _name, testUsers_[index].id_);
        ///transferAnyERC20Token(zscTestTokenAddress_, _ZSCTAmount);
    }

    function setUserStatus(bytes32 _name, bool _tag) public {
        checkDelegate(msg.sender, 1);

        ControlApis(systemAdrs_["controlApis"]).setUserActiveStatus(_name, _tag);
    }
    */

    function numUsers() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return userNos_;
    }

    function getUserInfoByIndex(uint _index) public constant returns (string) {
        checkDelegate(msg.sender, 1);

        require(_index < userNos_);
        string memory str ="";
        str = PlatString.append(str, "info?name=", PlatString.bytes32ToString(testUsers_[_index].name_),    "&");
        str = PlatString.append(str, "pass=",   PlatString.bytes32ToString(testUsers_[_index].pass_),  "&");
        str = PlatString.append(str, "actived=",   PlatString.bytes32ToString(testUsers_[_index].actived_),  "&");
        str = PlatString.append(str, "status=",    PlatString.bytes32ToString(testUsers_[_index].status_),  "&");
        str = PlatString.append(str, "type=",      PlatString.bytes32ToString(testUsers_[_index].type_),    "&");
        str = PlatString.append(str, "id=",        PlatString.addressToString(testUsers_[_index].id_),      "&");
        str = PlatString.append(str, "node=",      PlatString.addressToString(testUsers_[_index].nodeAdr_), "&");
        str = PlatString.append(str, "eth=",       PlatString.addressToString(testUsers_[_index].ethAdr_),  "&");
        str = PlatString.append(str, "zsc=",       PlatString.addressToString(testUsers_[_index].zscAdr_),  "&");
        str = PlatString.append(str, "end");
        return str;
    }

    function tryLogin(bytes32 _user, bytes32 _pass) public constant returns (bytes32) {
        if (!userExist_[_user]) {
            return 0;
        }

        uint index = userIndex_[toHexx(_user)];

        if (testUsers_[index].pass_ == _pass) {
            return toHexx(_user);
        } else {
            return 0x0;
        }
    }

    function keepOnline(bytes32 _user, bytes32 _hexx) public constant returns (bool) {
        checkAdded(_hexx);
        if (testUsers_[userIndex_[_hexx]].name_ == _user)
            return true;
        else 
            return false;
    }

    function getUserStatus(bytes32 _hexx) public constant returns (bytes32) {
        checkAdded(_hexx);

        return testUsers_[userIndex_[_hexx]].status_;
    }

    function getUserType(bytes32 _hexx) public constant returns (bytes32) {
        checkAdded(_hexx);

        return testUsers_[userIndex_[_hexx]].type_;
    }

    /*
    function approveWallet(address _controlApisAdr, bytes32 _userType, bytes32 _userName, address _creator) internal {
        if (_userType == "provider" || _userType == "receiver") {
            ControlApis(_controlApisAdr).enableElementWallet(4, _userName, "ETH", _creator);
        } else if (_userType == "staker") {
            ControlApis(_controlApisAdr).enableElementWallet(5, _userName, "ZSC", _creator);
        } else {

        }
    }
    */

}
