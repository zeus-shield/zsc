/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract FactoryBase is Object {
    address private bindedDB_;
    address private apiController_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function setupFactoryRoot() internal;

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);

    function numFactoryElements() public constant returns (uint);

    function getFactoryElementByIndex(uint _index) public constant returns (address);

    function getBindedDB() internal constant returns (address) { return bindedDB_;}

    function initFactory(address _controller, address _database) public {
        checkDelegate(msg.sender, 1);
        
        require(_database != 0);
        bindedDB_ = _database;

        if (_controller != 0 && _controller != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, 0);
            }
            apiController_ = _controller;
            setDelegate(_controller, 1);
        }
        setupFactoryRoot();
    }

}
