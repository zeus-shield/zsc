/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./plat_math.sol";
import "./object.sol";
import "./db_database.sol";


contract DBNode is Object {
    DBDatabase database_ = DBDatabase(0);
    DBNode parent_ = DBNode(0);
    DBNode[] children_;

    // Constructor
    function DBNode(bytes32 _name) public Object(_name) {
    }

    function setDatabase(DBDatabase _database) public only_delegate {
        database_ = _database;
    }

    function getDatabase() internal constant returns (DBDatabase) {
        return database_;
    }

    function setParent(DBNode _parent) public only_delegate {
        if (parent_ == DBNode(0)) {
            parent_ = _parent;
        }
    }

    function getParent() public only_delegate constant returns(DBNode) {
        return parent_; 
    }

    function addChild(DBNode _node) public only_delegate {
        require(database_ != DBDatabase(0));
        _node.setParent(this);
        _node.setDatabase(database_);
        _node.setDelegate(address(database_), true);
        database_._addNode(database_, _node);
        children_.push(_node);
    }
    
}


