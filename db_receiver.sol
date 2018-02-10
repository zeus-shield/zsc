/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2017-12-18: v0.01
2018-02-07: v0.02
2018-02-09: v0.03
2018-02-10: v0.04
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

library DBReceiver {
    struct Receiver {
        DBEntity.Entity entity_;
    }

    function initReceiver(Receiver storage _receiver) public {
        DBEntity.addParameter(_receiver.entity_, "userFamilyName");
        DBEntity.addParameter(_receiver.entity_, "userFirstName");
        DBEntity.addParameter(_receiver.entity_, "userNationality");
        DBEntity.addParameter(_receiver.entity_, "userPhone");
        DBEntity.addParameter(_receiver.entity_, "userGender");
        DBEntity.addParameter(_receiver.entity_, "userBirthday");
        DBEntity.addParameter(_receiver.entity_, "userIdentification");
        DBEntity.addParameter(_receiver.entity_, "userResidentialAddress");
    }
}
