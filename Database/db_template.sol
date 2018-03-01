/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
2018-02-10: v0.01
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
//import "./db_item.sol";

contract DBTemplate is DBEntity {
    address itemRoot_;
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
    	setEntityType("template");
        itemRoot_ = address(0);
    }

/*
    function addItem(bytes32 _name) public only_delegate returns(address) {
        if (itemRoot_ == address(0)) {
            itemRoot_ = new DBNode(PlatString.tobytes32(PlatString.append(name(), "_1")));
            DBNode(itemRoot_).setDelegate(this, true);
            addChild(itemRoot_);
        }
        address nd = new DBNode(_name);
        DBNode(nd).setDelegate(itemRoot_, true);
        return DBNode(itemRoot_).addChild(nd);
    }

    function numItems() public only_delegate constant returns (uint) {
    	return DBNode(itemRoot_).numChildren();
    }
    */
}
