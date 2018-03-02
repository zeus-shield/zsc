/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";

/**
 * The ZSDatabase contract does this and that...
 */
contract ZSCDatabase is Object { 
    function createNode(bytes32 _name) public only_delegate returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
}

contract ZSCNode is Object { 
    function addChild(address _node) public only_delegate returns (address);
}

contract DBApis is Object {
    mapping(bytes32 => address) databases_;

    function DBApis(bytes32 _name) public Object(_name) {
    }

    function setDatabase(bytes32 _db, address _adr) public only_delegate {
        databases_[_db] = _adr;
    }

    function createReceiver(bytes32 _name) public only_delegate returns (bool) {
        address db = databases_["receiver"];
        if (db == 0) return false;
        return (ZSCDatabase(db).createNode(_name) != 0);
    }
    
    function createProvider(bytes32 _name) public only_delegate returns (bool) {
        address db = databases_["provider"];
        if (db == 0) return false;
        return (ZSCDatabase(db).createNode(_name) != 0);
    }

    function createAgreement(bytes32 _name) public only_delegate returns (bool) {
        address db = databases_["agreement"];
        if (db == 0) return false;
        return (ZSCDatabase(db).createNode(_name) != 0);
    }
}
