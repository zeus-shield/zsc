/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract ZSCDatabase is Object { 
    function getRootNode() public only_delegate constant returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function destroyNode(bytes32 _name) public only_delegate returns (bool);
    function destroyNode(address _node) public only_delegate returns (bool);
}

contract ZSCDBNode is Object {
    function getEntityType() public only_delegate constant returns (bytes32);
    function setID(uint _id) only_delegate  public; 
    function setActivated(bool _activated) only_delegate public;
    function getID() public only_delegate constant returns (uint);
    function getActivated() public only_delegate constant returns (bool);
    function addParameter(bytes32 _parameter) public only_delegate returns (bool);
    function removeParameter(bytes32 _parameter) public only_delegate returns (bool);
    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool);
    function getParameter(bytes32 _parameter) public only_delegate constant returns (bytes32);
    function numParameters() public only_delegate constant returns (uint);
    function getParameterNameByIndex(uint _index) public only_delegate constant returns (bytes32);
}

contract DBFactory is Object {
    address bindedDB_;
    address apiController_;

    function DBFactory(bytes32 _name) public Object(_name) {
    }

    function initFactory(address _callbackApiController, address _database) public only_delegate  {
        if (_callbackApiController != 0) {
            if (apiController_ != 0) {
                setDelegate(apiController_, false);
            }
            apiController_ = _callbackApiController;
            setDelegate(_callbackApiController, true);
        }

        if (_database != 0) bindedDB_ = _database;
    }

    function createNode(bytes32 _name) public only_delegate returns (address);

    function getBindedDB() public only_delegate constant returns (address) { return bindedDB_;}

    function getBindedApiController() public only_delegate constant returns (address) { return apiController_;}

    function getNode(bytes32 _name) public only_delegate constant returns (address) {
        return ZSCDatabase(bindedDB_).getNode(_name);
    }
}
