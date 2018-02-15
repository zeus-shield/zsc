/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";
import "./db_node.sol";
import "./db_idmanager.sol";


contract DBDatabase is Object {
    DBNode rootNode_;
    DBNode[] nodes_;
    mapping(bytes32 => address) nodeAddress_;

    function DBDatabase(bytes32 _name) public Object(_name) {
        createRootNode();
    }
    
    function createRootNode() internal only_delegate {
        rootNode_ = new DBNode("zsc_root_node");
        rootNode_.setDelegate(owner, true);
        rootNode_.setDatabase(this);
        nodes_.push(rootNode_);
        nodeAddress_["zsc_root_node"] = address(rootNode_);

        DBNode provider = new DBNode("provider");
        DBNode receiver = new DBNode("receiver");

        rootNode_.addChild(address(provider));
        rootNode_.addChild(address(receiver));
    }

    function nodeAddress(bytes32 _name) public only_delegate constant returns (address) {
        return nodeAddress_[_name];
    }

    function getRootNode() public only_delegate constant returns (address) {
        return address(rootNode_);
    }

    function _addNode(address _node) public only_delegate returns (bool) {
        DBNode(_node).setDelegate(owner, true);
        DBNode(_node).setDelegate(this, true);

        nodes_.push(DBNode(_node));
        nodeAddress_[DBNode(_node).name()] = _node;
        return true;
    }

    function _destroyNode(address _node) public only_delegate returns (bool) {
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
            
            delete nodeAddress_[DBNode(_node).name()];
            setDelegate(_node, false);

            delete _node;
        }
        return true;
    }
}
