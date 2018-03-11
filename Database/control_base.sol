/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";

contract DBFactory is Object { 
    function getBindedDB() public only_delegate constant returns (address);
    function createNode(bytes32 _name) public returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function addNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate returns (bool);
    function getNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (bytes32);
    function setNodeParameter(bytes32 _node, bytes32 _parameter, bytes32 _value) public only_delegate returns (bool);
}

contract ControlBase is Object {
    struct UserInfo {
        address id_; 
        bytes32 type_; 
        uint status_; //1: registered; 2: active; 3: suspended;
    }
    
    mapping(bytes32 => address) factories_;
    mapping(bytes32 => UserInfo) public users_;

    function ControlBase(bytes32 _name) public Object(_name) {
    }

    function addFactory(bytes32 _name, address _adr) public only_delegate returns (bool) {
        if (factories_[_name] != 0) return false;
        factories_[_name] = _adr;
        return true;
    }

    function getDatabase(bytes32 _name) internal only_delegate constant returns (address) {
        if (factories_[_name] == 0) return 0;
        return DBFactory(factories_[_name]).getBindedDB();
    }

    function createProvider(bytes32 _name) public only_delegate returns (address) {
        return DBFactory(factories_["provider"]).createNode(_name);
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
