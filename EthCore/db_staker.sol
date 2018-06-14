/*
Copyright (c) 2018, ZSC Dev Team

*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBStaker is DBEntity {
	struct SPInfo {
		uint time_;
		uint amount_;
	}

	struct RewardInfo {
		uint time_;
		uint amount_;
	}

	uint private constant DAY_IN_SECONDS_BY_100 = 864;
    uint private spRemaining_;
    uint private spForReward_;
    uint private divendendDuration_;
    uint private lastStoreTime_;
    uint private lastRewardTime_;

    uint private rewardNos_;
    uint private spUsedNos_;
    mapping(uint => RewardInfo) private rewardInfo_;
    mapping(uint => SPInfo) private spUsedInfo_;

    // Constructor
    function DBStaker(bytes32 _name) public DBUser(_name) {
        nodeType_ = "staker";
        rewardNos_ = 0;
        spUsedNos_ = 0;
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
        addFundamentalParameter("Divended Duration");
    	addFundamentalParameter("Reward Ratio");
    }

    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (_parameter != "Divended Duration") 
            return false;  
        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.removeParameter(_parameter);
    }

    function claimStakePoint() public {
        checkDelegate(msg.sender, 1);

    	uint currentTime = now;
    	uint ratio = currentTime.sub(lastStoreTime_);
        ratio = ratio.div(DAY_IN_SECONDS_BY_100);

    	uint spAmount = 0; //SafeMath.mul(ratio, ERC20Interface(getERC20TokenAddress()).balancOf(address(this)));
        spAmount = spAmount.div(100);

    	lastStoreTime_ = currentTime;

        spRemaining_ = spRemaining_.add(spAmount);
    }

    function useStakePoint(uint _amount) public returns (uint) {
        checkDelegate(msg.sender, 1);
        uint ret = 0;

        if (spRemaining_ > _amount) {
            spRemaining_ = spRemaining_.sub(_amount);
            spForReward_ = spForReward_.add(_amount);
        } else {
            uint delta = SafeMath.sub(_amount, spRemaining_);
            spForReward_ = spForReward_.sub(spRemaining_);
            spRemaining_ = 0;
            ret = delta;
        }
        spUsedInfo_[spUsedNos_] = SPInfo(now, _amount);
        spUsedNos_++;
        return ret;
    }

    function claimReward() public returns (uint) {
        checkDelegate(msg.sender, 1);
        uint ret = 0;
        uint currentTime = now;

    	if (currentTime.sub(lastRewardTime_) > divendendDuration_) {
    		uint reward = (spForReward_ / 100) / 365;
    		spForReward_ = 0;
    		ret = reward;
    	} 

        rewardInfo_[rewardNos_] = RewardInfo(currentTime, 0);
        rewardNos_++;
        return ret;
    }

    function getRemainingSP() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
    	return spRemaining_;
    }

    function getMiningInfoByIndexs(bool _isReward, uint _index) public constant returns (uint, uint) {
        checkDelegate(msg.sender, 1);

        if (_isReward) {
            require(_index < rewardNos_);
            return (rewardInfo_[_index].time_, rewardInfo_[_index].amount_);
        } else {
            require(_index < spUsedNos_);
            return (spUsedInfo_[_index].time_, spUsedInfo_[_index].amount_);
        }
    }

    function numMiningInfo(bool _isReward) public constant returns (uint) {
        checkDelegate(msg.sender, 1);

        if (_isReward) {
            return rewardNos_;
        } else {
            return spUsedNos_;
        }
    }

    function numAgreements() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return 0;
    }

    function getAgreementByIndex(uint _index) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        return address(_index.sub(_index));
    }
}

