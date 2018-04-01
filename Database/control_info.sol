/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";

contract ControlInfo is Object {
    enum ManagementType {REGISTERD, SUSPEND, ACTIVE}
    struct UserInfo {
        bool tag_;
        bytes32 name_; 
        bytes32 type_; 
    }
    
    struct ParameterInfo {
        mapping (bytes32 => string) value_;
        mapping (address => bool) holders_;
        address nodeAdr_;
        address creator_; // ETH wallet address
    }
    
    mapping(address => UserInfo) private users_;
    mapping(bytes32 => ParameterInfo) private parameters_;

    
    modifier only_registered(bytes32 _node) {
        require(onlyRegisteredOrDelegated(_node, msg.sender)); 
        _;
    }

    function ControlInfo() public {}
    
    function checkAllowedUser(bytes32 _node) internal constant returns (bool);

    function onlyRegisteredOrDelegated(bytes32 _node, address sender) internal constant returns (bool) {
        return (sender == parameters_[_node].creator_ || parameters_[_node].holders_[sender] == true || isDelegate(sender)); 
    }

    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public {
        //require(msg.sender == parameters_[_nodeName].nodeAdr_);
        parameters_[_nodeName].value_[_parameter] = _value;
    }

    /* For the use in future version */
    /*
    function manageUser(ManagementType _management, bytes32 _name, bytes32 _type) internal user_notregistered(_name) {
        if (_management == ManagementType.REGISTERD) {
            users_[_name].id_ = msg.sender;
            users_[_name].type_ = _type;
            users_[_name].status_ = _management;
        } else {

        }
    }
    */

    function checkUserExist(address _adr) internal constant returns (bool) { 
        return users_[_adr].tag_; 
    }

    function checkNodeExist(bytes32 _name) internal constant returns (bool) { 
        return (parameters_[_name].nodeAdr_ != 0); 
    }

    function registerUser(bytes32 _type, bytes32 _userName, address _creator) internal {
        users_[_creator].tag_ = true;
        users_[_creator].name_ = _userName;
        users_[_creator].type_ = _type;
    }

    function registerNode(bytes32 _nodeName, address _nodeAdr, address _creator) internal {
        require(!checkNodeExist(_nodeName));        
        parameters_[_nodeName].nodeAdr_ = _nodeAdr;
        parameters_[_nodeName].creator_ = _creator;
    }

    function registerHolder(bytes32 _nodeName, address _holder) internal {
        require(checkNodeExist(_nodeName));        
        parameters_[_nodeName].holders_[_holder] = true;
    }

    function getControlInfoNodeAddress(bytes32 _nodeName)internal constant returns (address)  {
        return parameters_[_nodeName].nodeAdr_;
    }
    
    function getControlInfoParameterValue(bytes32 _node, bytes32 _parameter) internal constant returns (string) {
        return parameters_[_node].value_[_parameter];
    }
}

