/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";
import "./db_node.sol";

contract DBDatabase is Object {
    bytes32 temp_;
    address public rootNode_ = 0;
    DBNode[] public nodes_;
    mapping(bytes32 => address) nodeAddress_;

    /*added on 2018-02-25*/
    struct NodeParameterValue {mapping (bytes32 => string) values_; }
    mapping (bytes32 => NodeParameterValue) nodeParameters_;

    function DBDatabase(bytes32 _name) public Object(_name) {
    }

    function getRootNode() public only_delegate returns (address) {
        if (rootNode_ == address(0)) {
            rootNode_ = new DBNode(name());
            setDelegate(rootNode_, true);
            DBNode(rootNode_).setDelegate(this, true);
            DBNode(rootNode_).setDelegate(address(rootNode_), true);
            DBNode(rootNode_).setDatabase(address(this));
        }
        return rootNode_;
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
        }
        delete nodes_[nodes_.length - 1];
        nodes_.length --;
            
        delete nodeAddress_[DBNode(_node).name()];
        setDelegate(_node, false);

        delete _node;

        return true;
    }

    function destroyNode(bytes32 _name) public only_delegate returns (bool) {
        address nd = nodeAddress_[_name];
        if (nd == 0) return false;
        return destroyNode(nd);
    }

    function _recordNodeParameterValue(bytes32 _nodeName, bytes32 _paraName, string _value) public only_delegate {
        nodeParameters_[_nodeName].values_[_paraName] = _value;
    }

    function _getNodeParameterValue(bytes32 _nodeName, bytes32 _paraName) public only_delegate constant returns (string) {
        return nodeParameters_[_nodeName].values_[_paraName];
    }
}
