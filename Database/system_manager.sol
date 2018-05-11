/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract SystemBase is Object {
    function addAdr(bytes32 _name, address _database) public returns (bool);
    function getAdr(bytes32 _name) public returns (address);
    function setFactoryDatabase(bytes32 _objectName, address _databaseAdr) public;
    function setModuleDatabase(address _databaseAdr) public;
    function delegateObject( address _objectAdr, uint _priority) public;
}

contract SystemManager is Object {
    address private apiController_ = address(0);
    address private databaseGM_    = address(0);
    address private factoryGM_     = address(0);

    mapping(bytes32 => address) private modules_;
    mapping(bytes32 => bool) private moduleExists_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function initSystemManager(address _controller, address _databaseGM, address _factoryGM) public {
        checkDelegate(msg.sender, 1);
        
        require(apiController_ == address(0) && databaseGM_ == address(0) && factoryGM_ == address(0));
        require(_databaseGM != address(0) && _controller != address(0) && _factoryGM != address(0));

        apiController_ = _controller;
        databaseGM_    = _databaseGM;
        factoryGM_     = _factoryGM;

        setDelegate(apiController_, 1);
        setDelegate(databaseGM_, 1);
        setDelegate(factoryGM_, 1);
    }

    function addFactory(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        SystemBase(factoryGM_).addAdr(_name, _adr);
    }

    function addDatabase(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        SystemBase(databaseGM_).addAdr(_name, _adr);
    }

    function getFactory(bytes32 _name) public constant returns (address) {
        checkDelegate(msg.sender, 1);

        return SystemBase(factoryGM_).getAdr(_name);
    }

    function getDatabase(bytes32 _name) public constant returns (address) {
        checkDelegate(msg.sender, 1);

        return SystemBase(databaseGM_).getAdr(_name);
    }

    function addModuleManager(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(!moduleExists_(_name));

        setDelegate(_adr, 1);

        modules_[_name] = _adr;
        moduleExists_[_name] = true;

        SystemBase(factoryGM_).delegateObject(_adr, 1);

        return true;
    }

    function getDatabaseManager() public constant returns (address) {
        checkDelegate(msg.sender, 1);
        require(databaseGM_ != address(0));

        return databaseGM_;
    }

    function getFactoryManager() public constant returns (address) {
        checkDelegate(msg.sender, 1);
        require(factoryGM_ != address(0));
        
        return factoryGM_;
    }

    function getModuleManager(bytes32 _name) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        require(moduleExists_(_name));
        return modules_[_name];
    }

    function mapFactoryDatabase(bytes32 _factroyName, bytes32 _databaseName) public {
        checkDelegate(msg.sender, 1);

        address factoryAdr = getFactory(_factroyName);
        address datbaseAdr = getDatabase(_databaseName);

        SystemBase(databaseAdr).delegateObject(factoryAdr, 1);
        SystemBase(databaseGM_).setFactoryDatabase(_factroyName, datbaseAdr);
    }

    function mapModuleDatabase(bytes32 _moduleName, bytes32 _databaseName) public {
        checkDelegate(msg.sender, 1);
        require(!moduleExists_(_name));

        SystemBase(databaseAdr).delegateObject(_databaseName, moduleExists_(_name), 1);
        SystemBase(getDatabase(_databaseName)).setModuleDatabase(datbaseAdr);
    }
}

