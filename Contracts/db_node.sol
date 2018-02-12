/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./plat_math.sol";
import "./object.sol";


contract DBNode is Object {
    DBNode parent_ = DBNode(0);
    DBNode[] children_;

    // Constructor
    function DBNode(string _name) public Object(_name) {
    }

    function setParent(DBNode _parent) public only_delegate {
        if (parent_ == DBNode(0)) {
            parent_ = _parent;
        }
    }

    function getParent() public only_delegate constant returns(DBNode) {
        return parent_;/**
         * The Delegated contract allows a set of delegate accounts
         * to perform special tasks such as admin tasks to the contract
         */
        
        
    }
    
}


