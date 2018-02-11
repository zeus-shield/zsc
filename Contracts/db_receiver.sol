/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2017-12-18: v0.01
2018-02-07: v0.02
2018-02-09: v0.03
2018-02-10: v0.04
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

contract DBReceiver is DBEntity {
    // Constructor
    function DBReceiver(string _name) public DBEntity(_name) {
        initParameters();
    }

    function initParameters() internal {
        insertParameter("userFamilyName");
        insertParameter("userFirstName");
        insertParameter("userNationality");
        insertParameter("userPhone");
        insertParameter("userGender");
        insertParameter("userBirthday");
        insertParameter("userIdentification");
        insertParameter("userResidentialAddress");
    }
}
