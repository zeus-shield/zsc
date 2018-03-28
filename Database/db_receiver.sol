/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBReceiver is DBUser {
    // Constructor
    function DBReceiver(bytes32 _name) public DBUser(_name) {
        setNodeType("receiver"); 
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
