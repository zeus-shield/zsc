/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2018-02-07: v0.01
2018-02-09: v0.02
2018-02-10: v0.03
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

library DBProvider {
    struct Provider {
        DBEntity.Entity entity_;
        uint[]  templates_;
        mapping(uint => uint) templateExist_;
    }

    function initOrigin(Provider storage _provider) public {
        DBEntity.addParameter(_provider.entity_, "assurerType");
        DBEntity.addParameter(_provider.entity_, "assurerName");
        DBEntity.addParameter(_provider.entity_, "principalFirstName");
        DBEntity.addParameter(_provider.entity_, "principalLastName");
        DBEntity.addParameter(_provider.entity_, "principalIdentific");
        DBEntity.addParameter(_provider.entity_, "principalPhone");
        DBEntity.addParameter(_provider.entity_, "principalEmail");
        DBEntity.addParameter(_provider.entity_, "principalNationality");
        DBEntity.addParameter(_provider.entity_, "companyName");
        DBEntity.addParameter(_provider.entity_, "companyId");
        DBEntity.addParameter(_provider.entity_, "companyNationality");
        DBEntity.addParameter(_provider.entity_, "companyPhone");
        DBEntity.addParameter(_provider.entity_, "companyEmail");
        DBEntity.addParameter(_provider.entity_, "claimEmail");
        DBEntity.addParameter(_provider.entity_, "claimPhone");
    }



    function addTemplate(Provider storage _provider, uint _templateID) public returns (bool) {
        if (_provider.templateExist_[_templateID] == 0)
            return false;

        _provider.templateExist_[_templateID] = 1;
        _provider.templates_.push(_templateID);

        return true;
    }
}
