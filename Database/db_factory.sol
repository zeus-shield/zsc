/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";

contract ZSCDatabase is Object { 
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function destroyNode(bytes32 _name) public only_delegate returns (bool);
    function destroyNode(address _node) public only_delegate returns (bool);
}

contract DBFactory is Object {
    address private bindedDB_;
    address private apiController_;

    function DBFactory(bytes32 _name) public Object(_name) {
    }

    function createNode(bytes32 _name) internal returns (address);
    
    function getBindedDB() public only_delegate constant returns (address) { return bindedDB_;}

    function getBindedApiController() public only_delegate constant returns (address) { return apiController_;}

    function getNode(bytes32 _name) public only_delegate constant returns (address) {
        return ZSCDatabase(bindedDB_).getNode(_name);
    }

    function initFactory(address _callbackApiController, address _database) public only_delegate  {
        if (_database != 0) bindedDB_ = _database;

        if (_callbackApiController != 0 && _callbackApiController != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, false);
            }
            apiController_ = _callbackApiController;
            setDelegate(_callbackApiController, true);
        }
    }

    function operateNode(bytes32 _operation, bytes32 _node) public only_delegate returns (address) {
        if (_operation == "create") { 
            return createNode(_node);
        }
    }

    function operateParameter(bytes32 _operation, bytes32 _node, bytes32 _parameter, string _value) public only_delegate returns (bool) {
        bool tag = true;
        if (_operation == "set") {
            tag = DBEntity(ZSCDatabase(bindedDB_).getNode(_node)).setParameter(_parameter, _value);
        } else if (_operation == "get") {
            //Solidity-0.4.18 does not support the return string among different contracts 
            tag = false;
        }
        return tag;
    }
    
}
