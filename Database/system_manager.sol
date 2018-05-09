/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AdrManager is Object {
    function addAdr(bytes32 _name, address _database) public returns (bool);
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

    function addModuleManager(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(!moduleExists_(_name));

        modules_[_name] = _adr;
        modules_[_name] = true;
        return true;
    }
}

