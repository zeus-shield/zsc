/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2017-12-18: v0.01
2018-02-07: v0.02
2018-02-09: v0.03
2018-02-10: v0.04
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBReceiver is DBUser {
    // Constructor
    function DBReceiver(bytes32 _name) public DBUser(_name) {
        setEntityType("receiver"); 
        initParameters();
    }

    function initParameters() internal {
        addParameter("userFamilyName");
        addParameter("userFirstName");
        addParameter("userNationality");
        addParameter("userPhone");
        addParameter("userGender");
        addParameter("userBirthday");
        addParameter("userIdentification");
        addParameter("userResidentialAddress");
    }
}
