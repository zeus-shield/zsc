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
        address userId_;
    }
    
    mapping(bytes32 => UserInfo) private users_;
    mapping(bytes32 => ParameterInfo) private parameters_;

    //modifier node_exist(bytes32 _name) {require(parameters_[_name].tag_ == true); _;}
    modifier node_notexist(bytes32 _name) {require(parameters_[_name].nodeAdr_ == 0); _;}
    modifier user_notregistered(bytes32 _name) {require(users_[_name].id_ == 0); _;}

    modifier only_registered(bytes32 _node) {require(msg.sender == parameters_[_node].userId_ ); _;}


    function ControlInfo() public {}
    function checkAllowedUser(bytes32 _node) internal constant returns (bool);

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

    function prepareNodeRecorder(bytes32 _nodeName, address _nodeAdr, address _userId) internal node_notexist(_nodeName) {
        parameters_[_nodeName].nodeAdr_ = _nodeAdr;
        parameters_[_nodeName].userId_ = _userId;
    }

    function getControlInfoNodeAddress(bytes32 _nodeName)internal constant returns (address)  {
        return parameters_[_nodeName].nodeAdr_;
    }
    
    function getControlInfoParameterValue(bytes32 _node, bytes32 _parameter) internal constant returns (string) {
        return parameters_[_node].value_[_parameter];
    }
}

