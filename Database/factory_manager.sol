/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract FactoryManager is Object {
    address private bindedDB_;
    address private apiController_;
    mapping(bytes32 => address) private factories_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function initFactoryManager(address _controller, address _database) public {
        checkDelegate(msg.sender, 1);
        
        require(_database != 0);
        bindedDB_ = _database;

        if (_controller != 0 && _controller != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, 0);
            }
            apiController_ = _controller;
            setDelegate(_controller, 1);
        }
    }

    function addFactory(bytes32 _type, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        if (factories_[_type] == address(0)) {
            factories_[_type] = _adr;
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

    function getBindedDB() internal constant returns (address) { return bindedDB_;}
}
