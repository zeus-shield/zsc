/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";

contract ControlInfo {
    enum NodeType {PROVIDER, RECEIVER, TEMPLATE, AGREEMENT}
    struct UserInfo {
        address id_; 
        NodeType type_; 
        uint status_; //1: registered; 2: suspended; 3: active; 
    }

    struct ParameterInfo {
        mapping (bytes32 => string) value_;
        bool tag_;
    }
    
    mapping(bytes32 => UserInfo) private users_;
    mapping(bytes32 => ParameterInfo) private parameters_;

    modifier node_exist(bytes32 _name) {require(parameters_[_name].tag_ == true); _;}
    modifier user_notregistered(bytes32 _name) {require(users_[_name].id_ == 0); _;}

    function ControlInfo() public {
    }
 
    function _recordString(bytes32 _node, bytes32 _parameter, string _value) public node_exist(_node) {
        parameters_[_node].value_[_parameter] = _value;
    }

    function registerUser(NodeType _type, bytes32 _name) public user_notregistered(_name) {
        require(users_[_name].id_ != 0);
        users_[_name].id_ = msg.sender;
        users_[_name].type_ = _type;
        users_[_name].status_ = 1;
    }

    function addParameterEmptyInfo(bytes32 _node, bytes32 _parameter) internal {
        parameters_[_node].tag_ = true;
        parameters_[_node].value_[_parameter] = "";
    }
}
