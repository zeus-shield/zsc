/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
2018-02-10: v0.01
*/

pragma solidity ^0.4.18;
import "./plat_string.sol";
import "./db_entity.sol";
import "./db_item.sol";
import "./db_idmanager.sol";

contract DBTemplate is DBEntity {
    DBIDManager itemIDs_;
    address itemRoot_;
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
    	setEntityType("template");

    	itemRoot_ = new DBNode(PlatString.tobytes32(PlatString.append(_name, "_it_")));
        addChild(address(itemRoot_));
    }

    function addItem(bytes32 _name) public only_delegate returns(address) {
        DBItem temp = new DBItem(_name);
        return DBNode(itemRoot_).addChild(address(temp));
    }

    function numItems() public only_delegate constant returns (uint) {
    	return DBNode(itemRoot_).numChildren();
    }
}
