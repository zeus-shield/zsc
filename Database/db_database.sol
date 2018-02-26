/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";
import "./db_node.sol";
import "./db_idmanager.sol";

contract DBDatabase is Object {
    DBNode rootNode_;
    DBNode[] nodes_;
    mapping(bytes32 => address) nodeAddress_;

    /*added on 2018-02-25*/
    struct NodeParameterValue {mapping (bytes32 => string) values_; }
    mapping (bytes32 => NodeParameterValue) nodeParameters_;

    function DBDatabase(bytes32 _name) public Object(_name) {
    }

    function initDatabase() public only_delegate {        
        rootNode_ = new DBNode("zsc_root_node");
        setDelegate(address(rootNode_), true);
        rootNode_.setDelegate(this, true);
        rootNode_.setDelegate(address(rootNode_), true);
        rootNode_.setDatabase(address(this));
        return;
        DBNode provider = new DBNode("provider");
        DBNode receiver = new DBNode("receiver");
        DBNode agreement = new DBNode("agreement");

        rootNode_.addChild(address(provider));
        rootNode_.addChild(address(receiver));
        rootNode_.addChild(address(agreement));
    }

    function getRootNode() public only_delegate constant returns (address) {
        return address(rootNode_);
    }

    function getNode(bytes32 _name) public only_delegate constant returns (address) {
        return nodeAddress_[_name];
    }

    function _addNode(address _node) public only_delegate {
        require (nodeAddress_[DBNode(_node).name()] == 0);

        DBNode(_node).setDelegate(owner, true);
        nodes_.push(DBNode(_node));
        nodeAddress_[DBNode(_node).name()] = _node;
    }

    function destroyNode(address _node) public only_delegate returns (bool) {
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

    function _recordNodeParameterValue(bytes32 _nodeName, bytes32 _paraName, string _value) public only_delegate {
        nodeParameters_[_nodeName].values_[_paraName] = _value;
    }

    function _getNodeParameterValue(bytes32 _nodeName, bytes32 _paraName) public only_delegate constant returns (string) {
        return nodeParameters_[_nodeName].values_[_paraName];
    }
}
