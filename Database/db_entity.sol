/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./db_node.sol";

contract ControlBase {
    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public;
}

contract DBEntity is DBNode {
    bytes32[] private parameterNames_;
    mapping(bytes32 => bool) private parameterExist_;

    bool private activated_;

    // Constructor
    constructor(bytes32 _name) public DBNode(_name) {
        initParameters();
    }

    function initParameters() internal;

    function getBlance(bool _locked) public constant returns (uint256) {
        checkDelegate(msg.sender, 1);
        if (_locked) return 0;
        return 0;
    }

    function setActivated(bool _activated) public {
        checkDelegate(msg.sender, 1);
        activated_ = _activated;
    }

    function getActivated() public constant returns (bool) {
        checkDelegate(msg.sender, 1);
        return activated_;
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_parameter] == false);

        parameterNames_.push(_parameter);
        parameterExist_[_parameter] = true;
        return true;
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
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

    function setParameter(bytes32 _parameter, string _value) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_parameter] == true);

        ControlBase(getController())._recordString(name(), _parameter, _value);
        return true;
    }

    function numParameters() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return parameterNames_.length;
    }

    function getParameterNameByIndex(uint _index) public constant returns (bytes32) {
        checkDelegate(msg.sender, 1);
        require(_index < parameterNames_.length);
        return parameterNames_[_index];
    }
}
