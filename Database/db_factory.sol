/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract ZSCDatabase is Object { 
    function getRootNode() public only_delegate constant returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function destroyNode(bytes32 _name) public only_delegate returns (bool);
    function destroyNode(address _node) public only_delegate returns (bool);
}

contract DBFactory is Object {
    address db_;

    function DBFactory(bytes32 _name, address _db) public Object(_name) {
        require(_db != address(0));
        db_ = _db;
    }

    function createNode(bytes32 _name) public only_delegate returns (address);

    function getBindedDB() public only_delegate constant returns (address) { return db_;}

    function getNode(bytes32 _name) public only_delegate constant returns (address) {
        if (_name == "root") return ZSCDatabase(db_).getRootNode();
        else return ZSCDatabase(db_).getNode(_name);
    }

    function delegateNode(address _adr) internal {
        ZSCDatabase(db_).setDelegate(_adr, true);
    }
}
