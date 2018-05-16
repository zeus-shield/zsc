/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract FactoryBase is Object {
	address bindedDB_;
	address factoryGM_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function setupFactoryRoot() internal;

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);

    function setDatabase(address _adr) public {        
        checkDelegate(msg.sender, 1);

        require(bindedDB_ == address(0));
        bindedDB_ = _adr;
    } 

    function getDatabase() public constant returns (address) { 
        checkDelegate(msg.sender, 1);

        require(bindedDB_ != address(0));
        return bindedDB_;
    }

    function getFactoryManager() public constant returns (address) {
        checkDelegate(msg.sender, 1);
        
        require(factoryGM_ != address(0));
        return factoryGM_;
    }

    function initFactory(address _factoryGM) public {
        checkDelegate(msg.sender, 1);
        
        require(_factoryGM != 0);
        if (factoryGM_ != _factoryGM) {
            setDelegate(factoryGM_, 0);
            setDelegate(_factoryGM, 1);
            factoryGM_ = _factoryGM;
        }
    }
}


