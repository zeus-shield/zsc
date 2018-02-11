/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2018-02-07: v0.01
2018-02-09: v0.02
2018-02-10: v0.03
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
import "./db_item.sol";
import "./db_template.sol";
import "./db_agreement.sol";
import "./db_idmanager.sol";

library DBProvider {
    struct Provider {
        DBEntity.Entity entity_;
        DBIDManager.IDManager itemIDs_;
        DBIDManager.IDManager templateIDs_;
        DBIDManager.IDManager agreementIDs_;
    }

    function initOrigin(Provider storage _provider) public {
        DBEntity.insertParameter(_provider.entity_, "assurerType");
        DBEntity.insertParameter(_provider.entity_, "assurerName");
        DBEntity.insertParameter(_provider.entity_, "principalFirstName");
        DBEntity.insertParameter(_provider.entity_, "principalLastName");
        DBEntity.insertParameter(_provider.entity_, "principalIdentific");
        DBEntity.insertParameter(_provider.entity_, "principalPhone");
        DBEntity.insertParameter(_provider.entity_, "principalEmail");
        DBEntity.insertParameter(_provider.entity_, "principalNationality");
        DBEntity.insertParameter(_provider.entity_, "companyName");
        DBEntity.insertParameter(_provider.entity_, "companyId");
        DBEntity.insertParameter(_provider.entity_, "companyNationality");
        DBEntity.insertParameter(_provider.entity_, "companyPhone");
        DBEntity.insertParameter(_provider.entity_, "companyEmail");
        DBEntity.insertParameter(_provider.entity_, "claimEmail");
        DBEntity.insertParameter(_provider.entity_, "claimPhone");
    }

    function addTemplate(Provider storage _provider, uint _templateID) public returns (bool) {
        return DBIDManager.addID(_provider.templateIDs_, _templateID);
    }
}
