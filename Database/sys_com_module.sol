/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_base.sol";

contract SysComModule is SysComBase {
    address public bindedDB_;

    constructor(bytes32 _name) public SysComBase(_name) {
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
}
