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
        DBEntity.insertParameter(_receiver.entity_, "userFamilyName");
        DBEntity.insertParameter(_receiver.entity_, "userFirstName");
        DBEntity.insertParameter(_receiver.entity_, "userNationality");
        DBEntity.insertParameter(_receiver.entity_, "userPhone");
        DBEntity.insertParameter(_receiver.entity_, "userGender");
        DBEntity.insertParameter(_receiver.entity_, "userBirthday");
        DBEntity.insertParameter(_receiver.entity_, "userIdentification");
        DBEntity.insertParameter(_receiver.entity_, "userResidentialAddress");
    }
}
