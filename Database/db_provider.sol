/*
Copyright (c) 2018 ZSC Dev.
2018-02-07: v0.01
2018-02-09: v0.02
2018-02-10: v0.03
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
import "./db_item.sol";
import "./db_template.sol";

//import "./db_idmanager.sol";
/*


import "./db_agreement.sol";

*/

contract DBProvider is DBEntity {
    address templateRoot_;


    // Constructor
    function DBProvider(bytes32 _name) public DBEntity(_name) {
        setEntityType("proiver"); 
        initParameters();

        string memory rootName = PlatString.append(PlatString.bytes32ToString(_name), "_plt_");
        templateRoot_ = new DBNode(PlatString.tobytes32(rootName));
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
