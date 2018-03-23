/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";

contract DBDatabase is Object { 
    function getNode(bytes32 _name) public only_delegate constant returns (address);
}

contract FactoryBase is Object {
    address private bindedDB_;
    address private apiController_;
    address[] private factoryNodes_;

    function FactoryBase(bytes32 _name) public Object(_name) {}

    function setupFactoryRoot() internal;

    function createNode(bytes32 _node) public returns (address);

    function getNode(bytes32 _name) internal only_delegate constant returns (address) { return DBDatabase(bindedDB_).getNode(_name);}

    function getBindedApiController() public only_delegate constant returns (address) { return apiController_;}

    function getBindedDB() public only_delegate constant returns (address) { return bindedDB_;}

    function registerFactoryNode( address _adr) internal { factoryNodes_.push(_adr); }

    function numfactoryNodes() public only_delegate constant returns(uint) { return factoryNodes_.length; }
    
    function getFactoryNodeByIndex(uint index) public only_delegate constant returns(address) { 
        require(index < factoryNodes_.length);
        return factoryNodes_[index]; 
    }

    function initFactory(address _controller, address _database) public only_delegate  {
        if (_database != 0) {
            bindedDB_ = _database;
        }

        if (_controller != 0 && _controller != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, false);
            }
            apiController_ = _controller;
            setDelegate(_controller, true);

            DBDatabase(bindedDB_).setDelegate(apiController_, true);
        }
        setupFactoryRoot();
    }
}
