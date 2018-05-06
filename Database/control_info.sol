/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./object.sol";

contract ControlInfo is Object {   
    struct ParameterInfo {
        bytes32 userName_;
        address nodeAdr_;
        mapping (bytes32 => string) creator_; // ETH wallet address
        mapping (bytes32 => string) value_;
    }
    
    mapping(bytes32 => ParameterInfo) private nodeParameters_;
    mapping(bytes32 => bool) private nodeExists_;
    
    /*
    modifier only_registered(bytes32 _nodeName) {
        require(checkAllowedUser(_nodeName, msg.sender) || isDelegate(msg.sender, 1)); 
        _;
    }

    modifier only_matched(bytes32 _nodeName) {
        require( (nodeParameters_[_nodeName].creator_ == msg.sender) || isDelegate(msg.sender, 1)); 
        _;
    }
    */

    constructor(bytes32 _name) public Object(_name){}

    function allowedUser(bytes32 _userName, address _sender) internal constant returns (bool);
    function addAllowedUser(bytes32 _userName, address _creator) internal returns (bool);

    function checkMatched(bytes32 _userName, bytes32 _enName, address _sender) internal constant {
        if (isDelegate(_sender, 1)) return;
        if (nodeParameters_[_enName].creator_[_sender]) return;
        if (nodeParameters_[_enName].userName_ == _userName) return;
        revert();
    }

    function checkRegistered(bytes32 _userName, address _sender) internal constant{
        require(allowedUser(_userName, msg.sender) || isDelegate(_sender, 1)); 
    }

    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public {
        require(msg.sender == nodeParameters_[_nodeName].nodeAdr_);
        nodeParameters_[_nodeName].value_[_parameter] = _value;
    }

    function registerSignature(bytes32 _userName, address _sigAdr) internal {
        require(nodeExists_[_nodeName]);   
        nodeParameters_[_nodeName].creator_[_sigAdr] = true;
    }
    

    function registerNode(bool _isUser, bytes32 _userName,  bytes32 _nodeName, address _nodeAdr, address _creator) internal {
        require(!nodeExists_[_nodeName]);   
        if (_isUser) {
            addAllowedUser(_nodeName, _creator);
        }
        nodeParameters_[_nodeName].userName_ = _userName;
        nodeParameters_[_nodeName].nodeAdr_ = _nodeAdr;
        nodeParameters_[_nodeName].creator_[_creator] = true;
    }

    function getControlInfoNodeAddress(bytes32 _nodeName)internal constant returns (address)  {
        return nodeParameters_[_nodeName].nodeAdr_;
    }
    
    function getControlInfoParameterValue(bytes32 _nodeName, bytes32 _parameter) internal constant returns (string) {
        return nodeParameters_[_nodeName].value_[_parameter];
    }
}

