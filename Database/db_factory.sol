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

    function getBindedApiController() public only_delegate constant returns (address) { return apiController_;}

    function setupFactoryRoot() internal;

    function createNode(bytes32 _name) public returns (address);

    function getBindedDB() public only_delegate constant returns (address) { return bindedDB_;}


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
        setupFactoryRoot();
    }

    function addNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate returns (bool) {
        return DBEntity(ZSCDatabase(bindedDB_).getNode(_node)).addParameter(_parameter);
    }
    
    function getNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (bytes32) {
        return DBEntity(ZSCDatabase(bindedDB_).getNode(_node)).getParameter(_parameter);
    }

    function setNodeParameter(bytes32 _node, bytes32 _parameter, bytes32 _value) public only_delegate returns (bool) {
        addLog("[DBFactory: setNodeParameter]");
        return DBEntity(ZSCDatabase(bindedDB_).getNode(_node)).setParameter(_parameter, _value);
    }
}
