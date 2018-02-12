/*
Copyright (c) 2018, ZSC Dev Team
2018-02-09: v0.01
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";

contract DBItem is DBEntity {
    uint providerID_;
    
    // Constructor
    function DBItem(string _name) public DBEntity(_name) {
    }
    
    function initParameters() internal {
        insertParameter("assurerType");
        insertParameter("assurerName");
        insertParameter("principalFirstName");
        insertParameter("principalLastName");
        insertParameter("principalIdentific");
        insertParameter("principalPhone");
        insertParameter("principalEmail");
        insertParameter("principalNationality");
        insertParameter("companyName");
        insertParameter("companyId");
        insertParameter("companyNationality");
        insertParameter("companyPhone");
        insertParameter("companyEmail");
        insertParameter("claimEmail");
        insertParameter("claimPhone");
    }

    function setProviderID(uint _providerID) public onlyOwner {
        providerID_= _providerID;
    }
}
