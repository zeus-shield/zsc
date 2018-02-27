/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_user.sol";
import "./db_item.sol";
import "./db_template.sol";

contract DBProvider is DBUser {
    address templateRoot_;

    // Constructor
    function DBProvider(bytes32 _name) public DBUser(_name) {
        templateRoot_ = address(0);
        setEntityType("proiver"); 
        initParameters();
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

    function addTemplate(bytes32 _templateName) public only_delegate returns (address) {
        if (templateRoot_ == address(0)) {
            templateRoot_ = addSubRootNode();
        }
        DBTemplate nd = new DBTemplate(_templateName);
        nd.setDelegate(templateRoot_, true);
        return DBNode(templateRoot_).addChild(address(nd));
    }

    function numTemplates() public only_delegate constant returns (uint) {
        return DBNode(templateRoot_).numChildren();
    }
}
