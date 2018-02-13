/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./plat_math.sol";
import "./object.sol";
import "./db_database.sol";


contract DBNode is Object {
    address database_ = address(0);
    address parent_ = address(0);
    address[] children_;
    mapping(bytes32 => address) childMap_;

    // Constructor
    function DBNode(bytes32 _name) public Object(_name) {
    }

    function setDatabase(address _database) public only_delegate {
        database_ = _database;
    }

    function setParent(address _parent) public only_delegate {
        if (parent_ == address(0)) {
            parent_ = _parent;
            if (parent_ != address(0)) {
               setDelegate(parent_, true);
            }
        }
    }

    function getParent() public only_delegate constant returns(address) {
        return parent_; 
    }

    function addChild(address _node) public only_delegate returns (address) {
        DBNode(_node).setParent(this);
        DBNode(_node).setDatabase(database_);
        DBNode(_node).setDelegate(database_, true);
        DBDatabase(database_)._addNode(_node);
        children_.push(_node);
        childMap_[DBNode(_node).name()] = _node;
        return _node;
    }

    function removeChild(bytes32 _name) public only_delegate returns (address) {
        if (childMap_[_name] == 0) {
            return 0;
        }

        address nd;
        for (uint i = 0; i < children_.length; ++i) {
            if (DBNode(children_[i]).name() == _name) {
                nd = children_[i];
                children_[i] = children_[children_.length - 1];
                break;
            }
        }
        children_.length --;
        delete childMap_[_name];
        return nd;
    }

    function removeAndDestroyAllChildren() public only_delegate {
        if (children_.length == 0) {
            return;
        }

        for (uint i = 0; i < children_.length; ++i) {
            DBDatabase(database_)._destroyNode(children_[i]);
            delete childMap_[DBNode(children_[i]).name()];
        }
        children_.length = 0;
    }    
}


