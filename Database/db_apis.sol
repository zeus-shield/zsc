/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./db_factory.sol";

contract DBFactory is Object { 
    function createNode(bytes32 _name) public only_delegate returns (address);
    function getBindedDB() public only_delegate constant returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
}

contract DBApis is Object {
    mapping(bytes32 => address) factories_;

    function DBApis(bytes32 _name) public Object(_name) {
    }

    function addFactory(bytes32 _name, address _adr) public only_delegate returns (bool) {
        if (factories_[_mame] != 0) return false;
        factories_[_name] = _adr;
        return true;
    }

    function getDatabase(bytes32 _name) internal only_delegate constant returns (address) {
        if (factories_[_name] == 0) return false;
        return DBFactory(factories_[_name]).getBindedDB();
    }

    function createProvider(bytes32 _name) public only_delegate returns (bool) {
        if (factories_["provider"] == 0) return false;
        return DBFactory(factories_["provider"]).createNode(_name);
    }
}
