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
    }
    
    mapping(bytes32 => UserInfo) private users_;
    mapping(bytes32 => ParameterInfo) private nodeParameters_;

    modifier user_exist(_name) {require (factories_[_name] == 0); _;}
    modifier user_notexist(_name) {require (factories_[_name] != 0); _;}

    function ControlInfo() {
    }

    function registerUser(bytes32 _type, bytes32 _name) user_notexist(_name) public {
        require(users_[_name].id_ != 0);
        users_[_name].id_ = msg.sender;
        users_[_name].type_ = _type;
        users_[_name].status_ = 1;
    }
}
