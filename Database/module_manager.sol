/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBDatabase is Object {
    function delegateModuleManager(address _factoryAdr, uint _priority) public;
}

contract ModuleBase is Object {
    function setDatabase(address _adr) public;
}

contract ModuleManager is Object {
    address private apiController_ = address(0);

    mapping(bytes32 => address) private modules_;
    mapping(bytes32 => address) private databases_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function initModuleManager(address _controller) public {
        checkDelegate(msg.sender, 1);

        require(_controller != 0);
        if (_controller != apiController_) {
            setDelegate(apiController_, 0);
            setDelegate(_controller, 1);
            apiController_ = _controller;
        }
    }

    function addModulePair(bytes32 _type, address _moduleAdr, address _databaseAdr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(_moduleAdr != address(0) && _databaseAdr != address(0));

        if (factories_[_type] == address(0)) {
            setDelegate(_moduleAdr, 1);

            modules_[_type] = _moduleAdr;
            databases_[_type] = _databaseAdr;

            Object(_moduleAdr).setDelegate(apiController_, 1);
            Object(_databaseAdr).setDelegate(apiController_, 1);

            FactoryBase(_databaseAdr).setDatabase(_databaseAdr);            
            DBDatabase(_databaseAdr).delegateModuleManager(_moduleAdr, 1);
            return true;
        } else {
            return false;
        }
    }

    function removeModulePair(bytes32 _type) public returns (bool) {
        checkDelegate(msg.sender, 1);
        address _moduleAdr;
        address databaseAdr_;

        _moduleAdr  = factories_[_type];
        databaseAdr_ = databases_[_type];

        factories_[_type] = 0;
        databases_[_type] = 0;

        if (_moduleAdr != address(0)) {
            DBDatabase(_databaseAdr).delegateModuleManager(_moduleAdr, 0);
            return true;
        } else {
            return false;
        }
    }
}

