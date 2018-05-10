/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract ModuleBase is Object {
    address private bindedDB_;
    address private zscSystem_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function initManager(address _zscSystem) public {
        checkDelegate(msg.sender, 1);
        
        require(zscSystem_ != 0);
        if (zscSystem_ != _zscSystem) {
            setDelegate(zscSystem_, 0);
            setDelegate(_zscSystem, 1);
            zscSystem_ = _zscSystem;
        }
    }

    function setDatabase(address _adr) public {
        require(bindedDB_ == address(0));
        
        checkDelegate(msg.sender, 1);
        bindedDB_ = _adr;
    } 

    function getDatabase() internal constant returns (address) { 
        require(bindedDB_ != address(0));
        return bindedDB_;
    }

    function getZSCSystem() internal constant returns (address) {
        require(zscSystem_ != address(0));
        return zscSystem_;
    }
}
