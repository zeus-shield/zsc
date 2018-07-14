/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./plat_math.sol";
import "./object.sol";

contract CBDBDatabase is Object {
    function getNode(bytes32 _name) public view returns (address);
    function destroyNode(address _node) public returns (bool);
    function _addNode(address _node) public ;
}

contract DBNode is Object {
    address private database_ = address(0);
    address private parent_ = address(0);

    bytes32 internal nodeType_;
    address private ethWalletId_ ;

    address[] children_;
    mapping(bytes32 => address) childMap_;

    // Constructor
    function DBNode(bytes32 _name) public Object(_name) {
        nodeType_ = "node";
    }

    function kill() public { 
        checkDelegate(msg.sender, 1);
        removeAndDestroyAllChildren(); 
        super.kill();
    }

    function getNodeType() public view returns (bytes32) {
        checkDelegate(msg.sender, 1);
        return nodeType_;
    }

    function setId(address _ethWalletiId) public {
        checkDelegate(msg.sender, 1);
        ethWalletId_ = _ethWalletiId;
    }

    function getId() public view returns (address) {
        checkDelegate(msg.sender, 1);
        return ethWalletId_;
    }
    
    function setDatabase(address _database) public {
        checkDelegate(msg.sender, 1);

        database_  = _database;
        setDelegate(database_, 1);
        CBDBDatabase(database_)._addNode(this);
    }

    function numChildren() public view returns(uint) {
        checkDelegate(msg.sender, 1);
        return children_.length;
    }
    
    function setParent(address _parent) public {
        checkDelegate(msg.sender, 1);
        if (parent_ == address(0)) {
            parent_ = _parent;
            if (parent_ != address(0)) {
               setDelegate(parent_, 1);
            }
        }
    }

    function getParent() public view returns(address) {
        checkDelegate(msg.sender, 1);
        return parent_; 
    }

    function removeFromParent() public {
        checkDelegate(msg.sender, 1);
        if (parent_ != address(0)) {
            DBNode(parent_).removeChild(name());
        }
        parent_ = address(0);
    }

    function addChild(address _node) public returns (address) {
        checkDelegate(msg.sender, 1);
        
        require(_node != address(0));
        DBNode(_node).setParent(this);

        address delegateAdr;
        uint priority;
        for (uint i = 0; i < numDelegates(); ++i) {
            (delegateAdr, priority) = getDelegateInfoByIndex(i);
            DBNode(_node).setDelegate(delegateAdr, priority);
        }

        CBDBDatabase(database_).setDelegate(_node, 1);
        DBNode(_node).setDatabase(database_);

        children_.push(_node);
        childMap_[DBNode(_node).name()] = _node;
        return _node;
    }

    function getChild(bytes32 _name) public view returns(address) {
        checkDelegate(msg.sender, 1);

        require(childMap_[_name] != 0);
        return childMap_[_name];
    }
    
    function getChildByIndex(uint _index) public view returns(address) {
        checkDelegate(msg.sender, 1);

        require(_index < children_.length);
        return children_[_index];
    }

    function removeChild(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1);

        require(childMap_[_name] != 0);

        address nd;
        for (uint i = 0; i < children_.length; ++i) {
            if (DBNode(children_[i]).name() == _name) {
                nd = children_[i];
                children_[i] = children_[children_.length - 1];
                break;
            }
        }
        delete children_[children_.length - 1];
        children_.length --;
        delete childMap_[_name];

        DBNode(nd).setDelegate(parent_, 1);
        return nd;
    }

    function removeAndDestroyAllChildren() public {
        checkDelegate(msg.sender, 1);

        if (children_.length == 0) {
            return;
        }

        for (uint i = 0; i < children_.length; ++i) {
            CBDBDatabase(database_).destroyNode(children_[i]);
            delete childMap_[DBNode(children_[i]).name()];
        }
        children_.length = 0;
    }  
}


