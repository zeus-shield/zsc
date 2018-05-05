/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBDatabase is Object {
    function delegateFactory(address _factoryAdr, uint _priority) public;
}

contract FactoryManager is Object {
    address private bindedDB_;
    address private apiController_;
    mapping(bytes32 => address) private factories_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function getBindedDB() public constant returns (address) { 
        checkDelegate(msg.sender, 1);
        return bindedDB_;
    }

    function initFactoryManager(address _controller, address _database) public {
        checkDelegate(msg.sender, 1);
        
        require(_database != 0);
        if (bindedDB_ != _database) {
            setDelegate(bindedDB_, 0);
            setDelegate(_database, 1);
            bindedDB_ = _database;
        }

        require(_database != 0);
        if (_controller != apiController_) {
            setDelegate(apiController_, 0);
            setDelegate(_controller, 1);
            apiController_ = _controller;
        }
    }

    function addFactory(bytes32 _type, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        if (factories_[_type] == address(0)) {
            factories_[_type] = _adr;
            setDelegate(_adr, 1);
            Object(bindedDB_).delegateFactory(_adr, 1);
            return true;
        } else {
            return false;
        }
    }

    function removeFactory(bytes32 _type) public returns (bool) {
        checkDelegate(msg.sender, 1);
        if (factories_[_type] != address(0)) {
            factories_[_type] = address(0);
            setDelegate(_adr, 0);
            Object(bindedDB_).delegateFactory(_adr, 0);
            return true;
        } else {
            return false;
        }
    }

    function getFactory(bytes32 _type) public return (address) {
        checkDelegate(msg.sender, 1);
        require(actories_[_type] != address(0));
        return actories_[_type];
    }

}
