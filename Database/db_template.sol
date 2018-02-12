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
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
    }

    function addItem(uint _id) public returns (bool) {
        return itemIDs_.addID(_id);
    }
}
