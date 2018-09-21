/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysGmBase is Object {
    address public controlApiAdr_ = address(0);

    function SysGmBase(bytes32 _name) public Object(_name) {
    }

    function initSysGm(address _controlAdr) public {
        checkDelegate(msg.sender, 1);
        require(_controlAdr != address(0));
        
        addLog("initiated ", true);
        if (controlApiAdr_ != _controlAdr) {
           if (controlApiAdr_ != address(0)) {
               setDelegate(controlApiAdr_, 0);
           } 
           controlApiAdr_ = _controlAdr;
           setDelegate(controlApiAdr_, 1);
        }
    }

    function getControlApiAdr() internal view returns (address) {
        require(controlApiAdr_ != address(0));
        return controlApiAdr_;
    }
}
