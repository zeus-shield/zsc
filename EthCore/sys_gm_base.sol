/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysGmBase is Object {
    address public controlApiAdr_ = address(0);
    address public bindedDB_ = address(0);

    function SysGmBase(bytes32 _name) public Object(_name) {
    }

    function initSysGm(address _controlAdr) public {
        checkDelegate(msg.sender, 1);

        require(_controlAdr != address(0));
        
        if (controlApiAdr_ != _controlAdr) {
           if (controlApiAdr_ != address(0)) {
               setDelegate(controlApiAdr_, 0);
           } 
           controlApiAdr_ = _controlAdr;
           setDelegate(controlApiAdr_, 1);
        }
    }

    function getControlApiAdr() internal constant returns (address) {
        require(controlApiAdr_ != address(0));
        return controlApiAdr_;
    }

    function setDatabase(address _adr) public {      
        checkDelegate(msg.sender, 1);
        
        require(_adr != address(0));

        bindedDB_ = _adr;
    } 

    function getDatabase() internal constant returns (address) { 
        require(bindedDB_ != address(0));
        return bindedDB_;
    }
}
