/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";

contract ControlInfo is Object {   
    struct ParameterInfo {
        address nodeAdr_;
        address creator_; // ETH wallet address
        mapping (bytes32 => string) value_;
    }
    
    mapping(bytes32 => ParameterInfo) private nodeParameters_;
    mapping(bytes32 => bool) private nodeExists_;
    
    modifier only_registered(bytes32 _nodeName) {
        require(onlyRegisteredOrDelegated(_nodeName, msg.sender)); 
        _;
    }

    function ControlInfo() public {}
    
    function checkAllowedUser(bytes32 _nodeName) internal constant returns (bool);

    function onlyRegisteredOrDelegated(bytes32 _nodeName, address _sender) internal constant returns (bool) {
        return (_sender == nodeParameters_[_nodeName].creator_ || isDelegate(_sender, 1)); 
    }

    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public {
        require(msg.sender == nodeParameters_[_nodeName].nodeAdr_);
        nodeParameters_[_nodeName].value_[_parameter] = _value;
    }

    function registerNode(bytes32 _nodeName, address _nodeAdr, address _creator) internal {
        require(!nodeExists_[_nodeName]);        
        nodeParameters_[_nodeName].nodeAdr_ = _nodeAdr;
        nodeParameters_[_nodeName].creator_ = _creator;
    }

    function getControlInfoNodeAddress(bytes32 _nodeName)internal constant returns (address)  {
        return nodeParameters_[_nodeName].nodeAdr_;
    }
    
    function getControlInfoParameterValue(bytes32 _nodeName, bytes32 _parameter) internal constant returns (string) {
        return nodeParameters_[_nodeName].value_[_parameter];
    }
}

