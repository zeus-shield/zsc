/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";

contract DBFactory is Object { 
    function operateNode(bytes32 _operation, bytes32 _node) public only_delegate returns (address);
    function operateParameter(bytes32 _operation, bytes32 _node, bytes32 _parameter, string _value) public only_delegate returns (bool);
    function getBindedDB() public only_delegate constant returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
}

contract DBApis is Object {
    struct ParameterValue {
        mapping(bytes32 => string) value_;
    }    
    mapping(bytes32 => ParameterValue) nodeParameters_;
    mapping(bytes32 => address) factories_;
    mapping(bytes32 => address) nodes_;

    function DBApis(bytes32 _name) public Object(_name) {
    }

    function _recordString(bytes32 _node, bytes32 _parameter, string _value) public {
        require(nodes_[_node] != 0);
        nodeParameters_[_node].value_[_parameter] = _value;
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
        if (factories_["provider"] == 0) return 0;
        address adr = DBFactory(factories_["provider"]).operateNode("create", _name);

        if (adr != 0) {
            nodes_[_name] = adr;
        }
        return adr;
    }
}
