/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";

contract ControlInfo is Object {
    enum ManagementType {REGISTERD, SUSPEND, ACTIVE}
    struct UserInfo {
        address id_; 
        bytes32 type_; 
        ManagementType status_; //1: registered; 2: suspended; 3: active; 
    }

    struct ParameterInfo {
        mapping (bytes32 => string) value_;
        address nodeAdr_;
    }
    
    mapping(bytes32 => UserInfo) private users_;
    mapping(bytes32 => ParameterInfo) private parameters_;

    //modifier node_exist(bytes32 _name) {require(parameters_[_name].tag_ == true); _;}
    modifier node_notexist(bytes32 _name) {require(parameters_[_name].nodeAdr_ == 0); _;}
    modifier user_notregistered(bytes32 _name) {require(users_[_name].id_ == 0); _;}

    function ControlInfo() public {
    }
 
    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public {
        //require(msg.sender == parameters_[_nodeName].nodeAdr_);
        parameters_[_nodeName].value_[_parameter] = _value;
    }

    /* For the use in future version */
    function manageUser(ManagementType _management, bytes32 _name, bytes32 _type) internal user_notregistered(_name) {
        if (_management == ManagementType.REGISTERD) {
            users_[_name].id_ = msg.sender;
            users_[_name].type_ = _type;
            users_[_name].status_ = _management;
        } else {

        }
    }

    function prepareNodeRecorder(bytes32 _nodeName, address _nodeAdr) internal node_notexist(_nodeName) {
        parameters_[_nodeName].nodeAdr_ = _nodeAdr;
        users_[_nodeName].status_ = ManagementType.ACTIVE;
    }

    function getParameterValue(bytes32 _node, bytes32 _parameter) internal constant returns (string) {
        return parameters_[_node].value_[_parameter];
    }

    function testGetParameterValue(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (string) {
        return parameters_[_node].value_[_parameter];
    }
}
