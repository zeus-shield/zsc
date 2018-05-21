/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_module.sol";

contract SysGmString is SysComModule {

    struct ParameterValues {
        uint count_;
        mapping(bytes32 => string) ParameterValues_;
    }

    mapping(bytes32 => mapping(bytes32 => mapping(bytes32 => ParameterValues)))listeners_;

    constructor(bytes32 _name) public SysComModule(_name) {}

    function setSysOverlayer(address _sysOverlayer) public {
        return;
    }

    function addEntityParameter(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool) {
        return true;
    }

    function setEntityParameterValue(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter, string _value) public returns (bool) {
        return true;
    }

    function numEntityParameters(bytes32 _dbName, bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        return 0;
    }

    function getEntityParameterNameByIndex(bytes32 _dbName, bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32) {
        bytes32 parameter;
        return parameter;
    }

    function getEntityParameterValue(bytes32 _dbName, bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (string) {
        string memory str;
        return str;
    }
}