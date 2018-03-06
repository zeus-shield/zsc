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

contract FactoryBasic is Object {
    address db_;
    bytes32 temp_nm_;
    bytes32 temp_adr_;

    function createNode(bytes32 _name) public only_delegate returns (address);

    function FactoryBasic(bytes32 _name, address _db) public Object(_name) {
        require(_db != address(0));
        db_ = _db;
    }

    function getDB() public only_delegate constant returns (address) { return db_;}

    function getNode(bytes32 _name) public only_delegate constant returns (address) {
        if (_name == "root") return ZSCDatabase(db_).getRootNode();
        else return ZSCDatabase(db_).getNode(_name);
    }

    function delegateNode(address _adr) internal {
        ZSCDatabase(db_).setDelegate(_adr, true);
    }
}
