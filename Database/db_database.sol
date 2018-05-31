/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./object.sol";
import "./db_node.sol";

contract DBDatabase is Object {
    address public rootNode_ = 0;
    address[] public nodes_;
    mapping(bytes32 => address) public nodeAddress_;
    mapping(address => bool) public nodeExists_;

    /*added on 2018-02-25*/
    struct NodeParameterValue {mapping (bytes32 => string) values_; }
    mapping (bytes32 => NodeParameterValue) nodeParameters_;

    function DBDatabase(bytes32 _name) public Object(_name) {
    }

    function initDatabase(address _controlApi) public {
        checkDelegate(msg.sender, 1);
        require(_controlApi != address(0));

        super.setDelegate(_controlApi, 1);
        addLog("initDatabase", true);

        if (rootNode_ == 0) {
            rootNode_ = new DBNode(name());
            require(rootNode_ != address(0));
            setDelegate(rootNode_, 1);
            DBNode(rootNode_).setDatabase(address(this));
            addLog("rootNode_ - setDatabase", true);

            address delegateAdr;
            uint priority;
    
            for (uint i = 0; i < numDelegates(); ++i) {
                (delegateAdr, priority) = getDelegateInfoByIndex(i);
                DBNode(rootNode_).setDelegate(delegateAdr, priority);
            }
        } else {
            revert();
        }
    }

    function delegateFactory(address _adr, uint _priority) public {
        checkDelegate(msg.sender, 1);

        addLog(" sub setDelegate ", true);
        addLog(PlatString.addressToString(_adr), false);
        addLog("  |  ", false);
        //addLog(PlatString.uintToString(_priority),false);

        setDelegate(_adr, _priority);
        DBNode(rootNode_).setDelegate(_adr, 1);

        /*
        for (uint i = 0; i < nodes_.length; ++i) {
            DBNode(nodes_[i]).setDelegate(_adr, _priority);   
            addLog("  node-", false);
            addLog(PlatString.uintToString(i), false);
        }
        */
    }

    function kill() public { 
        checkDelegate(msg.sender, 1);
        
        destroyNode(rootNode_);
        super.kill();
    }
    
    function getRootNode() public constant returns (address) { 
        checkDelegate(msg.sender, 1);
        return rootNode_; 
    }

    function getNode(bytes32 _name) public constant returns (address) { 
        checkDelegate(msg.sender, 1);
        return nodeAddress_[_name]; 
    }

    function checkeNodeByAddress(address _adr) public constant returns (bool) { 
        checkDelegate(msg.sender, 1);
        return nodeExists_[_adr]; 
    }

    function numNodes() public constant returns (uint) { 
        checkDelegate(msg.sender, 1);
        return nodes_.length; 
    }

    function getNodeByIndex(uint _index) public constant returns (address) { 
        checkDelegate(msg.sender, 1);

        if (_index >= nodes_.length) return 0;
        return nodes_[_index]; 
    }

    function _addNode(address _node) public {
        checkDelegate(msg.sender, 1);

        require(nodeExists_[_node] == false);

        bytes32 ndName = Object(_node).name();

        nodes_.push(_node);
        nodeAddress_[ndName] = _node;
        nodeExists_[_node] = true;

        //for testing purpose; 2018-03-06, 2018-03-14, 2018-05-31
        addLog("_addNode: ", true);
        addLog(PlatString.bytes32ToString(ndName), false);
    }
    
    function destroyNode(address _node) public returns (bool) {
        checkDelegate(msg.sender, 1);

        for (uint i = 0; i < nodes_.length; ++i) {
            if (nodes_[i] == _node) {
                address parent = DBNode(nodes_[i]).getParent();
                if (parent != 0) {
                    DBNode(parent).removeChild(DBNode(nodes_[i]).name());
                    DBNode(nodes_[i]).removeAndDestroyAllChildren();
                }
                nodes_[i] = nodes_[nodes_.length - 1];
                break;
            }    
        }
        delete nodes_[nodes_.length - 1];
        nodes_.length--;
            
        delete nodeAddress_[DBNode(_node).name()];
        delete nodeExists_[_node];
        setDelegate(_node, 0);

        delete _node;

        return true;
    }
}
