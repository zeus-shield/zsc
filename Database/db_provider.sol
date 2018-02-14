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
    //DBIDManager templateIDs_;

    //DBIDManager itemIDs_;
    //DBIDManager agreementIDs_;

    // Constructor
    function DBProvider(bytes32 _name) public DBEntity(_name) {
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
    
    function createTemplate(bytes32 _name) public returns(address) {
        DBTemplate temp = new DBTemplate(_name);
        return addChild(address(temp));
    }


    /*
    function addTemplate(Provider storage _provider, uint _templateID) public returns (bool) {
        return DBIDManager.addID(_provider.templateIDs_, _templateID);
    }
    */
}
