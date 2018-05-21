/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract SysComBase is Object {
    function addAdr(bytes32 _name, address _database) public returns (bool);
    function getAdr(bytes32 _name) public constant returns (address);
    function numAdrs() public constant returns (uint);
    function setDatabase(address _adr) public;
    function delegateObject( address _objectAdr, uint _priority) public;
}

contract SysOverlayer is Object {
    address private apiController_ = address(0);
    address private databaseGM_    = address(0);
    address private factoryGM_     = address(0);

    mapping(bytes32 => address) private modules_;
    mapping(bytes32 => bool) private moduleExists_;

    constructor(bytes32 _name) public Object(_name) {
    }

    /*
      internal functions
    */
    function addFactory(bytes32 _name, address _adr) internal returns (bool) {
        if (SysComBase(factoryGM_).addAdr(_name, _adr)) {
            SysComBase(databaseGM_).delegateObject(_adr, 1);
        } else {
            return false;
        }
    }

    function addDatabase(bytes32 _name, address _adr) internal returns (bool) {
        if (SysComBase(databaseGM_).addAdr(_name, _adr)) {
            SysComBase(_adr).setDelegate(apiController_, 1);
        } else {
            return false;
        }
    }

    function addModuleManager(bytes32 _name, address _adr) internal returns (bool) {
        require(!moduleExists_[_name]);

        setDelegate(_adr, 1);
        SysComBase(_adr).setDelegate(apiController_, 1);

        modules_[_name] = _adr;
        moduleExists_[_name] = true;

        SysComBase(factoryGM_).delegateObject(_adr, 1);
        SysComBase(databaseGM_).delegateObject(_adr, 1);

        return true;
    }

    function mapFactoryDatabase(bytes32 _factoryName, bytes32 _dbName, uint _priority) internal {
        address factoryAdr = SysComBase(factoryGM_).getAdr(_factoryName);
        address dbAdr      = SysComBase(databaseGM_).getAdr(_dbName);

        require(factoryAdr != 0 && dbAdr != 0);

        SysComBase(factoryAdr).setDatabase(dbAdr);
        SysComBase(dbAdr).setDelegate(factoryAdr, _priority);
    }


    function mapModuleDatabase(bytes32 _moduleGmName, bytes32 _dbName, uint _priority) internal {
        require(moduleExists_[_moduleGmName]);

        address moduleGmAdr = modules_[_moduleGmName];
        address dbAdr       = SysComBase(databaseGM_).getAdr(_dbName);

        require(moduleGmAdr != 0 && dbAdr != 0);

        SysComBase(moduleGmAdr).setDatabase(dbAdr);
        SysComBase(dbAdr).setDelegate(moduleGmAdr, _priority);
    }

    /*
      public functions
    */
    function initSysOverlayer(address _controller, address _databaseGM, address _factoryGM) public {
        checkDelegate(msg.sender, 1);
        
        require(apiController_ == address(0) && databaseGM_ == address(0) && factoryGM_ == address(0));
        require(_databaseGM != address(0) && _controller != address(0) && _factoryGM != address(0));

        apiController_ = _controller;
        databaseGM_    = _databaseGM;
        factoryGM_     = _factoryGM;

        setDelegate(apiController_, 1);
        setDelegate(databaseGM_, 1);
        setDelegate(factoryGM_, 1);

        SysComBase(factoryGM_).setDelegate(apiController_, 1);
        SysComBase(databaseGM_).setDelegate(apiController_, 1);
        SysComBase(databaseGM_).setDelegate(factoryGM_, 1);
    }

    function addComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        bool ret = false;
        if (_type == "factory") {
            ret = addFactory(_name, _adr);
            if (ret) {
                mapFactoryDatabase(_name, "zsc", 1);
            }
        } else if (_type == "database") {
            ret = addDatabase(_name, _adr);
        } else if (_type == "module") {
            ret = addModuleManager(_name, _adr);
            if (ret) {
                mapModuleDatabase(_name, "zsc", 1);
            }
        } else {
            revert();
        }
        return ret;
    }

    function getComponent(bytes32 _type, bytes32 _name) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        if (_type == "factory") {
            if (_name == "gm") {
                return factoryGM_;
            } else {
                return SysComBase(factoryGM_).getAdr(_name);
            }
        } else if (_type == "database") {
            if (_name == "gm") {
                return databaseGM_;
            } else {
                return SysComBase(databaseGM_).getAdr(_name);
            }
        } else if (_type == "module") {
            return modules_[_name];
        } else {
            revert();
        }
    }
}

