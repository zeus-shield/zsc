/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysComBase is Object {
    address private systemOL_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function setSysOverlayer(address _systemOL) public {
        checkDelegate(msg.sender, 1);
        
        require(systemOL_ != 0);
        if (systemOL_ != _systemOL) {
            setDelegate(systemOL_, 0);
            setDelegate(_systemOL, 1);
            systemOL_ = _systemOL;
        }
    }

    function getSysOverlayer() internal constant returns (address) {
        require(systemOL_ != address(0));
        return systemOL_;
    }
}
