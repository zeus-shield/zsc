/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysComModule is Object {
    address private bindedDB_;
    address private systemGM_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function initModule(address _systemGM) public {
        checkDelegate(msg.sender, 1);
        
        require(systemGM_ != 0);
        if (systemGM_ != _systemGM) {
            setDelegate(systemGM_, 0);
            setDelegate(_systemGM, 1);
            systemGM_ = _systemGM;
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

    function getSystemManager() internal constant returns (address) {
        require(systemGM_ != address(0));
        return systemGM_;
    }
}
