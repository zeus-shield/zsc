/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract ControlApis is Object {
    function createElement(uint _factroyType, bytes32 _user, bytes32 _node, address _userId) public only_delegate returns (address);
}

contract AdmBase is Object {
    struct TestUserInfo {
        bytes32 name_ ;
        uint status_ ; //0: not exist; 1: added; 2: applied; 3: approved
        uint type_;    //1: provider; 2: receiver 
        address id_   ;
        address node_ ;
    }
    mapping(bytes32 => TestUserInfo) private testUsers_;
    mapping(bytes32 => address) private systemAdrs_;

    modifier only_added(bytes32 _hexx) { require(testUsers_[_hexx].status_ == 1); _; }
    
    function AdmBase() public Object("zsc_adm") {}

    function toHexx(bytes32 _value) internal returns (bytes32);

    function setAdrs(address _controlApis) 
        public only_delegate {
        if (_controlApis != 0)systemAdrs_["controlApis"] = _controlApis;
    }

    function getControlApisAdr() public constant returns (address){ return systemAdrs_["controlApis"]; }

    function addUser(bytes32 _user) public only_owner {
        var ret = toHexx(_user);
        require(testUsers_[ret].status_ ==0);

        testUsers_[ret] = TestUserInfo(_user, 1, 0, 0x0, 0x0);

        addLog("add a User - ", true);
        addLog(PlatString.bytes32ToString(_user), false);
    }

    function applyForUser(bytes32 _hexx, uint _type, address _id) internal {
        testUsers_[_hexx].status_ = 2;
        testUsers_[_hexx].type_ = _type;
        testUsers_[_hexx].id_ = _id;
    }

    function applyForProvider(bytes32 _hexx) public only_added(_hexx) returns (bool) {
        applyForUser(_hexx, 1, msg.sender);       
    }

    function applyForReceiver(bytes32 _hexx) public only_added(_hexx) returns (bool) {
        applyForUser(_hexx, 2, msg.sender);       
    }

    function approveUser(bytes32 _hexx) public only_delegate {
        require (testUsers_[_hexx].status_ == 2);

        uint userType = testUsers_[_hexx].type_; 
        require(userType == 1 || userType == 2);

        address adr = ControlApis(systemAdrs_["controlApis"]).createElement(userType, testUsers_[_hexx].name_, testUsers_[_hexx].id_);
        require (adr != 0x0);

        testUsers_[_hexx].node_ = adr;
        testUsers_[_hexx].status_ = 3;
    }
}
