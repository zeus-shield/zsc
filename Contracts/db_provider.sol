/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2018-02-07: v0.01
2018-02-09: v0.02
2018-02-10: v0.03
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

/*
import "./db_item.sol";
import "./db_template.sol";
import "./db_agreement.sol";
import "./db_idmanager.sol";
*/

contract DBProvider is DBEntity {
    //DBIDManager itemIDs_;
    //DBIDManager templateIDs_;
    //DBIDManager agreementIDs_;

    // Constructor
    function DBProvider(string _name) public DBEntity(_name) {
        initParameters();
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

    /*
    function addTemplate(Provider storage _provider, uint _templateID) public returns (bool) {
        return DBIDManager.addID(_provider.templateIDs_, _templateID);
    }
    */
}
