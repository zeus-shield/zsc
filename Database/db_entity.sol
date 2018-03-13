/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-11: v0.01
*/

pragma solidity ^0.4.17;
import "./plat_string.sol";
import "./db_node.sol";

contract infoRecorder {
    function _recordString(bytes32 _nodeName, bytes32 _parameter, bytes32 _value) public;
}

contract DBEntity is DBNode {
    address test_;
    uint    id_ ;
    bool    activated_;
    bytes32 entityType_ = "entity";

    bytes32 temp_;

    bytes32[] parameterNames_;
    mapping(bytes32 => bytes32) parameters_;
    mapping(bytes32 => bool) parameterExist_;

    modifier parameter_exist(bytes32 _name) {require(parameterExist_[_name] == true); _;}
    modifier parameter_notexist(bytes32 _name) {require(parameterExist_[_name] == false); _;}

    // Constructor
    function DBEntity(bytes32 _name) public DBNode(_name) {
        initParameters();
    }

    function initParameters() internal;
    //function recordParameterValue(bytes32 _parameter, string _value) only_delegate public ;
    
    function setEntityType(bytes32 _type) internal only_delegate {
        entityType_ = _type;
    }

    function getEntityType() public only_delegate constant returns (bytes32) {
        return entityType_;
    }

    //////////////////////////////////
    function setID(uint _id) public only_delegate {
        id_ = _id;
    }

    function setActivated(bool _activated) public only_delegate {
        activated_ = _activated;
    }

    //////////////////////////////////
    function getID() public only_delegate constant returns (uint) {
        return id_;
    }

    function getActivated() public only_delegate constant returns (bool) {
        return activated_;
    }

    function addParameter(bytes32 _parameter) public only_delegate parameter_notexist(_parameter) returns (bool) {
        parameterNames_.push(_parameter);
        parameterExist_[_parameter] = true;
        return true;
    }

    function removeParameter(bytes32 _parameter) public only_delegate parameter_exist(_parameter) returns (bool) {
        for (uint i = 0; i < parameterNames_.length; ++i) {
            if (parameterNames_[i] == _parameter) {
                parameterNames_[i] = parameterNames_[parameterNames_.length - 1];
                break;
            }
        }

        delete parameterNames_[parameterNames_.length - 1];
        parameterNames_.length --;

        delete parameters_[_parameter];
        delete parameterExist_[_parameter];
        return true;
    }

    function setParameter(bytes32 _parameter, bytes32 _value, address _strRecorder) public only_delegate parameter_exist(_parameter) returns (bool) {
        parameters_[_parameter] = _value;
        infoRecorder(_strRecorder)._recordString(name(), _parameter, _value);
        return true;
    }

    function getParameter(bytes32 _parameter) public only_delegate constant returns (bytes32) {
        return parameters_[_parameter];
    }

    function numParameters() public only_delegate constant returns (uint) {
        return parameterNames_.length;
    }

    function getParameterNameByIndex(uint _index) public only_delegate constant returns (bytes32) {
        require(_index < parameterNames_.length);
        return parameterNames_[_index];
    }
}
