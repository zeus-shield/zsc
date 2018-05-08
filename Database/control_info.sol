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
        address creator_;
        mapping (bytes32 => string) value_;
    }

    struct UserInfo {
        address nodeAdr_;
        mapping (address => bool) signatures_;
        mapping (bytes32 => ParameterInfo) paras_;
    }
    
    mapping(bytes32 => UserInfo) private userParameters_;
    mapping(bytes32 => bool) private nodeExists_;

    constructor(bytes32 _name) public Object(_name){

    }

    function allowedUser(bytes32 _userName, address _sender) internal constant returns (bool);

    function addAllowedUser(bytes32 _userName, address _creator) internal returns (bool);

    function checkMatched(bytes32 _userName, bytes32 _enName, address _sender) internal constant {
        if (userParameters_[_userName].signatures_[_sender]) return;
        if (userParameters_[_userName].paras_[_enName].userName_ == _userName) return;
        revert();
    }

    function checkRegistered(bytes32 _userName, address _sender) internal constant{
        require(allowedUser(_userName, _sender) || isDelegate(_sender, 1)); 
    }

    function registerSignature(bytes32 _userName, address _sigAdr) internal {
        require(nodeExists_[_userName]);   
        addAllowedUser(_userName, _sigAdr);
        userParameters_[_userName].signatures_[_sigAdr] = true;
    }

    function registerUserNode(bytes32 _userName, address _nodeAdr, address _sigAdr) internal {
        require(!nodeExists_[_userName]);   
        addAllowedUser(_userName, _sigAdr);
        userParameters_[_userName].nodeAdr_ = _nodeAdr;
        userParameters_[_userName].signatures_[_sigAdr] = true;
        nodeExists_[_userName] = true;
    }  

    function registerEntityNode(bytes32 _userName,  bytes32 _enName, address _nodeAdr, address _creator) internal {
        require(!nodeExists_[_enName]);   
        userParameters_[_userName].paras_[_enName].userName_ = _userName; 
        userParameters_[_userName].paras_[_enName].nodeAdr_ = _nodeAdr;
        userParameters_[_userName].paras_[_enName].creator_ = _creator;
        nodeExists_[_enName] = true;
    }
    
    function getNodeParameterValue(bytes32 _userName, bytes32 _enName, bytes32 _parameter) internal constant returns (string) {
        require(nodeExists_[_userName]);   
        require(nodeExists_[_enName]);   

        return userParameters_[_userName].paras_[_enName].value_[_parameter];
    }

    function setNodeParameterValue(bytes32 _userName, bytes32 _enName, bytes32 _parameter, string _value) internal returns (bool) {
        require(nodeExists_[_userName]);   
        require(nodeExists_[_enName]);   

        userParameters_[_userName].paras_[_enName].value_[_parameter] = _value;
        return true;
    }
}

