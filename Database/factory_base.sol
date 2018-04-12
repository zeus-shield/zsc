/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";

contract DBDatabase is Object { 
    function getNode(bytes32 _name) public only_delegate(1) constant returns (address);
}

contract FactoryBase is Object {
    address private bindedDB_;
    address private apiController_;

    function FactoryBase(bytes32 _name) public Object(_name) {}

    function setupFactoryRoot() internal;

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);

    function getBindedApiController() public only_delegate(1) constant returns (address) { return apiController_;}

    function getBindedDB() public only_delegate(1) constant returns (address) { return bindedDB_;}
    
    function initFactory(address _controller, address _database) public only_delegate(1)  {
        require(_database != 0);
        bindedDB_ = _database;

        if (_controller != 0 && _controller != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, 0);
            }
            apiController_ = _controller;
            setDelegate(_controller, 1);

            DBDatabase(bindedDB_).setDelegate(apiController_, 1);
        }
        setupFactoryRoot();
    }
}
