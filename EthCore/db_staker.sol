/*
Copyright (c) 2018, ZSC Dev Team

*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBStaker is DBEntity {
	struct RewardInfo {
        uint time_;
        uint amount_;
	}

	uint private constant DAY_IN_SECONDS = 86400;
	uint private constant MAX_RATIO_VALUE = 10000;
    uint private divendendDuration_;
    uint private lastStoreTime_;
    uint private lastRewardTime_;
    uint private rewardRatio_; 
    uint private rewardNos_;

    mapping(uint => RewardInfo) private rewardInfo_;

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
        addFundamentalParameter("divendendDuration");
    	addFundamentalParameter("rewardRatio");
    }

    function computeRemaingSP(uint _tokenAmount) private view returns (uint) {
        uint timeDiff = now.sub(lastStoreTime_);
        uint spAmount = _tokenAmount * rewardRatio_;
        spAmount = spAmount.div(MAX_RATIO_VALUE);
        spAmount = spAmount.div(DAY_IN_SECONDS);
        spAmount = spAmount.mul(timeDiff);

        return spAmount;
    }

    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (_parameter == "divendendDuration" || _parameter == "rewardRatio") { 
            return false;  
        }
        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }
    
    function setPoSInfo(uint _divendendDuration, uint _rewardRatio) public {
        checkDelegate(msg.sender, 1);
        require(_divendendDuration > 0 && _rewardRatio > 0);
        
        divendendDuration_ = _divendendDuration;
        rewardRatio_ = _rewardRatio;
        setParameter("divendendDuration", PlatString.tobytes32(PlatString.uintToString(divendendDuration_)));
        setParameter("rewardRatio", PlatString.tobytes32(PlatString.uintToString(divendendDuration_)));
    }

    function getMiningInfoByIndexs(uint _index) public constant returns (uint, uint) {
        checkDelegate(msg.sender, 1);

        require(_index < rewardNos_);
        return (rewardInfo_[_index].time_, rewardInfo_[_index].amount_);
    }

    function numMiningInfo() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return rewardNos_;
    }
}

