/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";
import "./control_info.sol";

contract DBFactory is Object { 
    function getBindedDB() public only_delegate constant returns (address);
    function createNode(bytes32 _name) public returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function addNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate returns (bool);
    function getNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (bytes32);
    function setNodeParameter(bytes32 _node, bytes32 _parameter, bytes32 _value) public only_delegate returns (bool);
}

contract ControlBase is Object, ControlInfo {   
    mapping(bytes32 => address) private factories_;

    modifier factroy_exist(bytes32 _name) {require(factories_[_name] != 0); _;}
    modifier factroy_notexist(bytes32 _name) {require(factories_[_name] == 0); _;}

    function ControlBase(bytes32 _name) public Object(_name) {
    }

    function addFactory(bytes32 _name, address _adr) public only_owner factroy_notexist(_name) returns (bool) {
        factories_[_name] = _adr;
        return true;
    }

    function getDatabase(bytes32 _factory) internal factroy_exist(_factory) constant returns (address) {
        return DBFactory(factories_[_factory]).getBindedDB();
    }

    function createFactoryNode(bytes32 _type, bytes32 _name) public only_delegate factroy_exist(_type) returns (address) {
        return DBFactory(factories_[_type]).createNode(_name);
    }
   
    function createProvider(bytes32 _name) public only_delegate returns (address) {
        return createFactoryNode("provider", _name);
    }

    function addProviderParameter(bytes32 _node, bytes32 _parameter) public only_delegate returns (bool) {
        return DBFactory(factories_["provider"]).addNodeParameter(_node, _parameter);
    }

    function setProviderParameter(bytes32 _node, bytes32 _parameter, bytes32 _value) public only_delegate returns (bool) {
        return DBFactory(factories_["provider"]).setNodeParameter(_node, _parameter, _value);
    }

    function getProviderParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (bytes32) {
        return DBFactory(factories_["provider"]).getNodeParameter(_node, _parameter);
    }
}
