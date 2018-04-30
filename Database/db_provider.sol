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
        addFundamentalParameter("assurerType");
        addFundamentalParameter("assurerName");
        addFundamentalParameter("principalFirstName");
        addFundamentalParameter("principalLastName");
        addFundamentalParameter("principalIdentific");
        addFundamentalParameter("principalPhone");
        addFundamentalParameter("principalEmail");
        addFundamentalParameter("principalNationality");
        addFundamentalParameter("companyName");
        addFundamentalParameter("companyId");
        addFundamentalParameter("companyNationality");
        addFundamentalParameter("companyPhone");
        addFundamentalParameter("companyEmail");
        addFundamentalParameter("claimEmail");
        addFundamentalParameter("claimPhone");
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.removeParameter(_parameter);
    }

}
