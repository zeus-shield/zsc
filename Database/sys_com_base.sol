/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";

contract SysComBase is Object {
    //changed to public for the alpha-test purpose, 2018-05-27
    address public systemOL_ = address(0);

    function SysComBase(bytes32 _name) public Object(_name) {
    }

    function setSysOverlayer(address _systemOL) public {
        checkDelegate(msg.sender, 1);
        require(_systemOL != address(0));

        if (systemOL_ != _systemOL) {
           if (systemOL_ != address(0)) {
               setDelegate(systemOL_, 0);
           } 
           systemOL_ = _systemOL;
           setDelegate(systemOL_, 1);
        }
    }

    function getSysOverlayer() internal constant returns (address) {
        require(systemOL_ != address(0));
        return systemOL_;
    }
}
