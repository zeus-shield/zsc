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
        setEntityType("proiver"); 
        initParameters();

        templateRoot_ = new DBNode(PlatString.tobytes32(PlatString.append(_name, "_1")));
        addChild(address(templateRoot_));
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
        DBTemplate nd = new DBTemplate(_templateName);
        return addChild(address(nd));
    }

    function numTemplates() public only_delegate constant returns (uint) {
        return DBNode(templateRoot_).numChildren();
    }
}
