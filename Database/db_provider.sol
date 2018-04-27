/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./db_user.sol";
//import "./db_item.sol";
//import "./db_template.sol";

contract DBProvider is DBUser {
    address private templates_ = 0;

    // Constructor
    constructor(bytes32 _name) public DBUser(_name) {
        setNodeType("proiver"); 
    }

    function initParameters() internal {
        addParameter("assurerType");
        addParameter("assurerName");
        addParameter("principalFirstName");
        addParameter("principalLastName");
        addParameter("principalIdentific");
        addParameter("principalPhone");
        addParameter("principalEmail");
        addParameter("principalNationality");
        addParameter("companyName");
        addParameter("companyId");
        addParameter("companyNationality");
        addParameter("companyPhone");
        addParameter("companyEmail");
        addParameter("claimEmail");
        addParameter("claimPhone");
    }
}
