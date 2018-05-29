/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract SysCom {
    function addAdr(bytes32 _name, address _database) public returns (bool);
    function getAdr(bytes32 _name) public constant returns (address);
    function numAdrs() public constant returns (uint);
    function setDatabase(address _adr) public;
    function delegateObject( address _objectAdr, uint _priority) public;
}

contract SysOverlayer is Object {
    address public apiController_ = address(0);
    address public databaseGM_    = address(0);
    address public factoryGM_     = address(0);

    mapping(bytes32 => address) public modules_;
    mapping(bytes32 => bool) public moduleExists_;

    function SysOverlayer(bytes32 _name) public Object(_name) {
    }

    /*
      internal functions
    */
    function addFactory(bytes32 _name, address _adr) internal returns (bool) {
        addLog(" addFactory", true);

        if (SysCom(factoryGM_).addAdr(_name, _adr)) {
            SysCom(databaseGM_).delegateObject(_adr, 1);
        } else {
            return false;
        }
    }

    function addDatabase(bytes32 _name, address _adr) internal returns (bool) {
        addLog(" addDatabase", true);

        bool ret = SysCom(databaseGM_).addAdr(_name, _adr);
        if (ret) {
            //SysCom(_adr).setDelegate(apiController_, 1);
        } else {
            return false;
        }
        return true;
    }

    function addModuleManager(bytes32 _name, address _adr) internal returns (bool) {
        require(!moduleExists_[_name]);
        addLog(" addModuleManager", true);

        setDelegate(_adr, 1);
        Object(_adr).setDelegate(apiController_, 1);

        modules_[_name] = _adr;
        moduleExists_[_name] = true;

        SysCom(factoryGM_).delegateObject(_adr, 1);
        SysCom(databaseGM_).delegateObject(_adr, 1);

        return true;
    }

    function mapFactoryDatabase(bytes32 _factoryName, bytes32 _dbName, uint _priority) internal {
        address factoryAdr = SysCom(factoryGM_).getAdr(_factoryName);
        address dbAdr      = SysCom(databaseGM_).getAdr(_dbName);

        require(factoryAdr != 0 && dbAdr != 0);

        SysCom(factoryAdr).setDatabase(dbAdr);
        Object(dbAdr).setDelegate(factoryAdr, _priority);
    }


    function mapModuleDatabase(bytes32 _moduleGmName, bytes32 _dbName, uint _priority) internal {
        require(moduleExists_[_moduleGmName]);

        address moduleGmAdr = modules_[_moduleGmName];
        address dbAdr       = SysCom(databaseGM_).getAdr(_dbName);

        require(moduleGmAdr != 0 && dbAdr != 0);

        SysCom(moduleGmAdr).setDatabase(dbAdr);
        Object(dbAdr).setDelegate(moduleGmAdr, _priority);
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

        Object(factoryGM_).setDelegate(apiController_, 1);
        Object(databaseGM_).setDelegate(apiController_, 1);
        Object(databaseGM_).setDelegate(factoryGM_, 1);
        addLog(" initSysOverlayer", true);
    }

    function addComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        bool ret = false;

        addLog("addComponent", true);

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
                return SysCom(factoryGM_).getAdr(_name);
            }
        } else if (_type == "database") {
            if (_name == "gm") {
                return databaseGM_;
            } else {
                return SysCom(databaseGM_).getAdr(_name);
            }
        } else if (_type == "module") {
            return modules_[_name];
        } else {
            revert();
        }
    }
}

