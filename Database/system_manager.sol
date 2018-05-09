/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBManager is Object {
    function getDatabase(bytes32 _name) public returns (address);
}

contract SystemManager is Object {
    address private apiController_ = address(0);
    address private databaseGM_ = address(0);
    mapping(bytes32 => address) private factories_;
    mapping(bytes32 => address) private factoryExists_;


    constructor(bytes32 _name) public Object(_name) {
    }

    function initModuleManager(address _controller, address _databaseGM) public {
        checkDelegate(msg.sender, 1);
        
        require(apiController_ == address(0) && databaseGM_ == address(0));
        require(_databaseGM != 0 && _controller != 0);

        databaseGM_ = _databaseGM;
        apiController_ = _controller;

        setDelegate(databaseGM_, 1);
        setDelegate(apiController_, 1);
    }

    function addFactory(bytes32 _type, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(!factoryExists_[_type]);
        require(_factory != address(0));

        factories_[_type] = _adr;
        setDelegate(_adr, 1);

        Object(_adr).setDelegate(apiController_, 1);

        FactoryBase(_databaseAdr).setDatabase(_databaseAdr);            
        DBDatabase(_databaseAdr).delegateModuleManager(_moduleAdr, 1);
        return true;
       lse {
        return false;
        }
    }

    function addManager(bytes32 _name, address _factory) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(!pairExists_[_nameCommen]);
        require(_module != address(0) && _database != address(0))

        pairs_[_nameCommen] = PairInfo(_nameCommen, _module, _database);

        ManagerBase(adrDatabase).internalShareDelegate(adrModule);

        require(_moduleAdr != address(0) && _databaseAdr != address(0));

        if (modules_[_name] == address(0)) {
            setDelegate(_moduleAdr, 1);

            exists_[_name] = true;
            modules_[_name] = _moduleAdr;
            databases_[_name] = _databaseAdr;

            Object(_moduleAdr).setDelegate(apiController_, 1);
            Object(_databaseAdr).setDelegate(apiController_, 1);

            FactoryBase(_databaseAdr).setDatabase(_databaseAdr);            
            DBDatabase(_databaseAdr).delegateModuleManager(_moduleAdr, 1);
            return true;
        } else {
            return false;
        }
    }

    function removePair(bytes32 _name) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);

        address _moduleAdr;
        address databaseAdr_;

        _moduleAdr  = factories_[_name];
        databaseAdr_ = databases_[_name];

        factories_[_name] = 0;
        databases_[_name] = 0;

        if (_moduleAdr != address(0)) {
            DBDatabase(_databaseAdr).delegateModuleManager(_moduleAdr, 0);
            FactoryBase(_databaseAdr).setDatabase(0);    
            return true;
        } else {
            return false;
        }
    }

    function getModuleObj(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);

        return modules_[_name];
    }

    function getModuleDatabase(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);

        return databases_[_name];
    }
}

