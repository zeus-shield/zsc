/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysComBase is Object {
    //changed to public for the alpha-test purpose, 2018-05-27
    address public controlApiAdr_ = address(0);

    function SysComBase(bytes32 _name) public Object(_name) {
    }

    function setControlApiAdr(address _adr) public {
        checkDelegate(msg.sender, 1);
        require(controlApiAdr_ != address(0));

        if (controlApiAdr_ != _adr) {
           if (controlApiAdr_ != address(0)) {
               setDelegate(controlApiAdr_, 0);
           } 
           controlApiAdr_ = _adr;
           setDelegate(controlApiAdr_, 1);
        }
    }

    function getControlApiAdr() internal view returns (address) {
        require(controlApiAdr_ != address(0));
        return controlApiAdr_;
    }
}
