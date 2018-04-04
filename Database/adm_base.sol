/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract ControlApis is Object {
    function createElement(uint _factroyType, bytes32 _node, bytes32 extraInfo, address extraAdr) public returns (address);
}

contract AdmBase is Object {
    struct TestUserInfo {
        bytes32 name_ ;
        bytes32 status_ ; //0: not exist; 1: added; 2: applied; 3: approved
        bytes32 type_;    //1: provider; 2: receiver 
        address id_   ;
        address node_ ;
    }
    TestUserInfo[] testUsers_;
    mapping(bytes32 => uint) private userIndex_;
    mapping(bytes32 => address) private systemAdrs_;

    address private zscTestTokenAddress_;
    string private controlApisFullAib_;

    modifier only_added(bytes32 _hexx) { require(testUsers_[userIndex_[_hexx]].status_ == 1); _;}
    
    function AdmBase() public Object("zsc_adm") {}

    function toHexx(bytes32 _value) internal constant returns (bytes32);

    function getUserIndex(bytes32 _hexx) internal constant returns (uint) { return userIndex_[_hexx]; }

    function setZSCTestTokenAddress(address _adr) public only_delegate { zscTestTokenAddress_ = _adr; }

    function setControlApisFullAbi(string _fullAbi) public only_delegate { controlApisFullAib_ = _fullAbi; }

    function getControlApisFullAbi() public constant returns (string) { return controlApisFullAib_; }

    function setAdrs(address _controlApis,
                     address _dbDatabase,
                     address _factoryPro,
                     address _factoryRec,
                     address _factoryTmp,
                     address _factoryAgr) 
        public only_delegate {
        if (_controlApis != 0) systemAdrs_["ControlApis"] = _controlApis;
        if (_dbDatabase != 0)  systemAdrs_["DBDatabase"]  = _dbDatabase;
        if (_factoryPro != 0)  systemAdrs_["FactoryPro"]  = _factoryPro;
        if (_factoryRec != 0)  systemAdrs_["FactoryRec"]  = _factoryRec;
        if (_factoryTmp != 0)  systemAdrs_["FactoryTmp"]  = _factoryTmp;
        if (_factoryAgr != 0)  systemAdrs_["FactoryAgr"]  = _factoryAgr;
    }

    function getControlApisAdr() public constant returns (address){ return systemAdrs_["ControlApis"]; }
    function getDBDatabaseAdr()  public only_delegate constant returns (address){ return  systemAdrs_["DBDatabase"]; }
    function getFactoryProAdr()  public only_delegate constant returns (address) { return systemAdrs_["FactoryPro"] ; }
    function getFactoryRecAdr()  public only_delegate constant returns (address) { return systemAdrs_["FactoryRec"] ; }
    function getFactoryTmpAdr()  public only_delegate constant returns (address) { return systemAdrs_["FactoryTmp"] ; }
    function getFactoryAgrAdr()  public only_delegate constant returns (address) { return systemAdrs_["FactoryAgr"] ; }
    
    function addUser(bytes32 _user) public only_owner {
        var ret = toHexx(_user);
        require(testUsers_[userIndex_[ret]].status_ ==0);

        userIndex_[ret] = testUsers_.length;
        testUsers_.push(TestUserInfo(_user, "added", 0, 0x0, 0x0));

        addLog("add a User - ", true);
        addLog(PlatString.bytes32ToString(_user), false);
    }

    function applyForUser(bytes32 _hexx, bytes32 _type, address _id) internal {
        uint index = getUserIndex(_hexx);
        testUsers_[index].status_ = "applied";
        testUsers_[index].type_ = _type;
        testUsers_[index].id_ = _id;
    }

    function applyForProvider(bytes32 _hexx) public only_added(_hexx) returns (bool) {
        applyForUser(_hexx, "provider", msg.sender);       
    }

    function applyForReceiver(bytes32 _hexx) public only_added(_hexx) returns (bool) {
        applyForUser(_hexx, "receiver", msg.sender);       
    }

    function approveUser(bytes32 _name) public only_delegate {
        bytes32 hexx = toHexx(_name);
        uint index = getUserIndex(hexx);
        require (testUsers_[index].status_ == "applied");

        bytes32 userType = testUsers_[index].type_; 
        require(userType == "provider" || userType == "receiver");

        uint typeInt;
        if (userType == "provider") typeInt = 1;
        else if (userType == "provider") typeInt = 2;
        
        address adr = ControlApis(systemAdrs_["controlApis"]).createElement(typeInt, testUsers_[index].name_, "", testUsers_[index].id_);
        require (adr != 0x0);

        testUsers_[index].node_ = adr;
        testUsers_[index].status_ = "approved";
        ///transferAnyERC20Token(zscTestTokenAddress_, _ZSCTAmount);
    }

    function numUsers() public only_delegate constant returns (uint) {
        return testUsers_.length;
    }

    function getUserInfoByIndex(uint _index) public only_delegate constant returns (string) {
        require(_index < testUsers_.length);
        string memory str ="";
        str = PlatString.append(str, "<name:",   PlatString.bytes32ToString(testUsers_[_index].name_),   ">");
        str = PlatString.append(str, "<status:", PlatString.bytes32ToString(testUsers_[_index].status_), ">");
        str = PlatString.append(str, "<type:",   PlatString.bytes32ToString(testUsers_[_index].type_),   ">");
        str = PlatString.append(str, "<id:",     PlatString.addressToString(testUsers_[_index].id_),     ">");
        str = PlatString.append(str, "<node:",   PlatString.addressToString(testUsers_[_index].node_),   ">");
        return str;
    }

}
