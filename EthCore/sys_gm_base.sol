/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysComBase is Object {
    //changed to public for the alpha-test purpose, 2018-05-27
    address public controlApiAdr_ = address(0);
    address public bindedDB_ = address(0);

    function SysComBase(bytes32 _name) public Object(_name) {
    }

    function setControlApiAdr(address _adr) public {
        checkDelegate(msg.sender, 1);

        if (controlApiAdr_ != _adr) {
           if (controlApiAdr_ != address(0)) {
               setDelegate(controlApiAdr_, 0);
           } 
           controlApiAdr_ = _adr;
           setDelegate(controlApiAdr_, 1);
        }
    }

    function getControlApiAdr() internal constant returns (address) {
        require(controlApiAdr_ != address(0));
        return controlApiAdr_;
    }

    function setDatabase(address _adr) public {      
        checkDelegate(msg.sender, 1);
        bindedDB_ = _adr;
    } 

    function getDatabase() internal constant returns (address) { 
        require(bindedDB_ != address(0));
        return bindedDB_;
    }
}
