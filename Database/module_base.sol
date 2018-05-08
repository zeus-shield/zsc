/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract ModuleManager is Object {
    function getModuleObj(bytes32 _name) public returns (address);
    function getModuleDatabase(bytes32 _name) public returns (address);
}

contract Database is Object {
    function getNode(bytes32 _name) public constant returns (address);
    function destroyNode(address _node) public returns (bool);
    function _addNode(address _node) public ;
}

contract ModuleBase is Object {
    address private bindedDB_;
    address private moduleGM_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function setDatabase(address _adr) public {
        require(bindedDB_ == address(0));
        
        checkDelegate(msg.sender, 1);
        bindedDB_ = _adr;
    } 

    function getDatabase() internal constant returns (Database) { 
        require(bindedDB_ != address(0));
        return CBDBDatabase(bindedDB_);
    }

    function getModuleManager() internal constant returns (ModuleManager) {
        require(moduleGM_ != address(0));
        return ModuleManager(moduleGM_);
    }

    function initModule(address _moduelGM) public {
        checkDelegate(msg.sender, 1);
        
        require(_moduelGM != 0);
        if (moduleGM_ != _moduelGM) {
            setDelegate(moduleGM_, 0);
            setDelegate(_moduelGM, 1);
            moduleGM_ = _moduelGM;
        }
    }
}
