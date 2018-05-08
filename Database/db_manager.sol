/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBManager is Object {
    uint private databaseNos_;
    address[] private databases_;
    mapping(bytes32 => uint) private databaseIndice_;
    mapping(bytes32 => bool) private databaseExists_;

    address private controlApiAdr_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function initDBManager(address _controlApiAdr) public {
        checkDelegate(msg.sender, 1);

        require(_controlApiAdr != 0);
        if (_controlApiAdr != controlApiAdr_) {
            setDelegate(controlApiAdr_, 0);
            setDelegate(_controlApiAdr, 1);
            controlApiAdr_ = _controlApiAdr;
        }
    }

    function addDatabase(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        require(_controlApiAdr != address(0));
        
        if (!databaseExists_[_name]) {
            return false;
        }

        uint index = databaseNos_;
        databaseNos_++;

        databaseExists_[_name] = true;
        databaseIndice_[_name] = index;
        databases_[index] = _adr;

        return true;
    }
    
    function getDatabase(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1); 
        require(databaseExists_[_name]);
        return databases_[databaseIndice_[name]];
    }

    function removeDatabase(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1); 
        require(databaseExists_[_name]);
        address adr = databases_[databaseIndice_[name]];
        return Object(adr).kill();
    }
}

