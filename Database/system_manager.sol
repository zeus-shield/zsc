/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AdrManager is Object {
    function addAdr(bytes32 _name, address _database) public returns (bool);
    function getAdr(bytes32 _name) public returns (address);
    function setFactoryDatabase(bytes32 _factoryName, address _databaseAdr) public;
    function delegateObject(bytes32 _databaseName, address _objectAdr, uint _priority) public;
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

        AdrManager(_factoryGM).addAdr(_name, _adr);
    }

    function addDatabase(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        AdrManager(databaseGM_).addAdr(_name, _adr);
    }

    function getFactory(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1);

        return AdrManager(_factoryGM).getAdr(_name);
    }

    function getDatabase(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1);

        return AdrManager(_databaseGM).getAdr(_name);
    }

    function addModuleManager(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(!moduleExists_(_name));

        modules_[_name] = _adr;
        moduleExists_[_name] = true;

        return true;
    }

    function getModuleManager(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1);
        require(moduleExists_(_name));
        return modules_[_name];
    }

    function mapFactoryDatabase(bytes32 _factroyName, bytes32 _databaseName) public {
        checkDelegate(msg.sender, 1);

        address factoryAdr = getFactory(_factoryName);

        AdrManager(databaseAdr).delegateObject(_databaseName, factoryAdr, 1);
    }

    function mapModuleDatabase(bytes32 _muduleName, bytes32 _databaseName) public {
        checkDelegate(msg.sender, 1);
        require(!moduleExists_(_name));

        AdrManager(databaseAdr).delegateObject(_databaseName, moduleExists_(_name), 1);
    }
}

