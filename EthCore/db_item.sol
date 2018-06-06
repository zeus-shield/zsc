/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBItem is DBEntity {   
    // Constructor
    function DBItem(bytes32 _name) public DBEntity(_name) {
    	setEntityType("item");
    }
    
    function initParameters() internal {
        addParameter("description");
    }
    
}
