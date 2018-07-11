/*
Copyright (c) 2018, ZSC Dev Team

*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBStaker is DBEntity {

    // Constructor
    function DBStaker(bytes32 _name) public DBEntity(_name) {
        nodeType_ = "staker";
        rewardNos_ = 0;
        lastStoreTime_ = now;
        lastRewardTime_ = lastStoreTime_;
    }

    function initParameters() internal {
    	addFundamentalParameter("userFamilyName");
        addFundamentalParameter("userFirstName");
        addFundamentalParameter("userNationality");
        addFundamentalParameter("userPhone");
        addFundamentalParameter("userGender");
        addFundamentalParameter("userBirthday");
        addFundamentalParameter("userIdentification");
        addFundamentalParameter("userResidentialAddress");
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }
}

