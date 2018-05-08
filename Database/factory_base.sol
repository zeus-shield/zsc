/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./module_base.sol";

contract FactoryBase is ModuleBase {
    constructor(bytes32 _name) public Object(_name) {
    }

    function setupFactoryRoot() internal;

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
}


