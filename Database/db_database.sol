/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";
import "./db_node.sol";
import "./db_receiver.sol";
import "./db_provider.sol";
import "./db_idmanager.sol";


contract DBDatabase is Object {
    DBNode rooteNode_;
    DBNode[] nodes_;
    mapping(address => bool) nodeExist_;

    DBReceiver[] receivers_;
    DBProvider[] providers_;

    mapping(bytes32 => uint) receiver_exist_;
    mapping(bytes32 => uint) provider_exist_;

    function DBDatabase(bytes32 _name) public Object(_name) {
        createRootNode();
    }
    
    function createRootNode() internal only_delegate {
        rooteNode_ = new DBNode("zsc_root_node");
        rooteNode_.setDatabase(this);
        nodes_.push(rooteNode_);
        nodeExist_[address(rooteNode_)] = true;
    }

    function getRootNode() public only_delegate constant returns (address) {
        return address(rooteNode_);
    }

    function _addNode(address _node) public returns (bool) {
        require(nodeExist_[_node] == true);
        nodes_.push(DBNode(_node));
        return true;
    }

    function _destroyNode(address _node) public returns (bool) {
        require(this == msg.sender || nodeExist_[msg.sender] == true);

        for (uint i = 0; i < nodes_.length; ++i) {
            if (address(nodes_[i]) == _node) {
                address parent = nodes_[i].getParent();
                if (parent != 0) {
                    DBNode(parent).removeChild(nodes_[i].name());
                    nodes_[i].removeAndDestroyAllChildren();
                }
                nodes_[i] = nodes_[nodes_.length - 1];
                break;
            }
            delete nodes_[nodes_.length - 1];
            nodes_.length --;
            nodeExist_[_node] = false;
        }
        return true;
    }

    

    function insertReceiver(bytes32 _name) public only_delegate {
        if (receiver_exist_[_name] == 0) revert();
        uint id = receivers_.length;
        receiver_exist_[_name] = id;

        DBReceiver en = new DBReceiver(_name);
        en.setID(id);
        receivers_.push(en);
    }

    function insertProvider(bytes32 _name) public only_delegate {
        if (provider_exist_[_name] == 0) revert();
        uint id = providers_.length;
        provider_exist_[_name] = id;

        DBProvider en = new DBProvider(_name);
        en.setID(id);
        providers_.push(en);
    }
}
