/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./db_user.sol";
//import "./db_item.sol";
//import "./db_template.sol";

contract DBProvider is DBUser {
    address private templates_ = 0;

    // Constructor
    function DBProvider(bytes32 _name) public DBUser(_name) {
        setEntityType("proiver"); 
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

    function addTemplate(address _adr) public only_delegate {
        if (templates_ == 0) {
            templates_ =  CallbackDatabase(getDatabase())._createIDManager();
        } 
        CallbackDBIDManager(templates_).addID(_adr);
    }

    function numTemplates() public only_delegate constant returns (uint) {
        return CallbackDBIDManager(templates_).numIDs();
    }
    

}
