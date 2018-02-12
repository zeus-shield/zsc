/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
2018-02-10: v0.01
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
import "./db_item.sol";
import "./db_idmanager.sol";

contract DBTemplate is DBEntity {
    DBIDManager itemIDs_;
    
    function DBTemplate(string _name) public DBEntity(_name) {
    }

    function insertItem(uint _id) public returns (bool) {
        itemIDs_.addID(_id);
        _id++;
        return true;
    }
}
