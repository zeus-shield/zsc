/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-11: v0.01
*/

pragma solidity ^0.4.17;
import "./plat_string.sol";
import "./db_node.sol";

contract infoRecorder {
    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public;
}

contract DBEntity is DBNode {
    bool    activated_;
    bytes32 temp_;

    bytes32[] parameterNames_;
    mapping(bytes32 => bool) parameterExist_;

    address private idManager_;

    // Constructor
    function DBEntity(bytes32 _name) public DBNode(_name) {
        initParameters();
        idManager_ = 0;
    }

    function initParameters() internal;
    
    function setActivated(bool _activated) public only_delegate(1) {
        activated_ = _activated;
    }

    function getActivated() public only_delegate(1) constant returns (bool) {
        return activated_;
    }

    function addParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        require(parameterExist_[_parameter] == false);

        parameterNames_.push(_parameter);
        parameterExist_[_parameter] = true;
        return true;
    }

    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        require(parameterExist_[_parameter] == true);

        for (uint i = 0; i < parameterNames_.length; ++i) {
            if (parameterNames_[i] == _parameter) {
                parameterNames_[i] = parameterNames_[parameterNames_.length - 1];
                break;
            }
        }

        delete parameterNames_[parameterNames_.length - 1];
        parameterNames_.length --;

        delete parameterExist_[_parameter];
        return true;
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        require(parameterExist_[_parameter] == true);

        infoRecorder(getController())._recordString(name(), _parameter, _value);
        return true;
    }

    function numParameters() public only_delegate(1) constant returns (uint) {
        return parameterNames_.length;
    }

    function getParameterNameByIndex(uint _index) public only_delegate(1) constant returns (bytes32) {
        require(_index < parameterNames_.length);
        return parameterNames_[_index];
    }

    function bindEntity(address _adr) public only_delegate(1) {
        idManager_ = getDatabase()._bindId(idManager_, _adr);
    }

    function numBindedEntities(bytes32 _type) public only_delegate(1) constant returns (uint) {
        return getDatabase()._numBindedIds(idManager_, _type);
    }
    
    function getBindedEntityNameByIndex(bytes32 _type, uint _index) public only_delegate(1) constant returns (bytes32) {
        return getDatabase()._getBindedIdNameByIndex(idManager_, _type, _index);
    }

}
