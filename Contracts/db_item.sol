/*
Copyright (c) 2018, ZSC Dev Team
2018-02-09: v0.01
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";

library DBItem {
    struct Item {
        DBEntity.Entity entity_;
        uint providerID_;
    }

    function setProviderID(Item storage _item, uint _providerID) public {
        _item.providerID_= _providerID;
    }
    
    function initItem(Item storage _item) public {
        DBEntity.insertParameter(_item.entity_, "assurerType");
        DBEntity.insertParameter(_item.entity_, "assurerName");
        DBEntity.insertParameter(_item.entity_, "principalFirstName");
        DBEntity.insertParameter(_item.entity_, "principalLastName");
        DBEntity.insertParameter(_item.entity_, "principalIdentific");
        DBEntity.insertParameter(_item.entity_, "principalPhone");
        DBEntity.insertParameter(_item.entity_, "principalEmail");
        DBEntity.insertParameter(_item.entity_, "principalNationality");
        DBEntity.insertParameter(_item.entity_, "companyName");
        DBEntity.insertParameter(_item.entity_, "companyId");
        DBEntity.insertParameter(_item.entity_, "companyNationality");
        DBEntity.insertParameter(_item.entity_, "companyPhone");
        DBEntity.insertParameter(_item.entity_, "companyEmail");
        DBEntity.insertParameter(_item.entity_, "claimEmail");
        DBEntity.insertParameter(_item.entity_, "claimPhone");
    }
}
