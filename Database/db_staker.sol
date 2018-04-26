/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBStaker is DBUser {
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

    // Constructor
    function DBStaker(bytes32 _name) public DBUser(_name) {
        setNodeType("staker"); 
        lastStoreTime_ = now;
        lastRewardTime_ = lastStoreTime_;
    }

    function initParameters() internal {
    	addParameter("Divended Duration");
    	addParameter("Reward Ratio");
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (_parameter != "Divended Duration") 
            return false;  
        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        return false;
    }

    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        return false; 
    }

    function claimStakePoint() public only_delegate(1) {
    	uint currentTime = now;
    	uint ratio = currentTime.sub(lastStoreTime_);
        ratio = ratio.div(DAY_IN_SECONDS_BY_100);

    	uint spAmount = SafeMath.mul(ratio, ERC20Interface(getERC20TokenAddress()).balancOf(address(this)));
        spAmount = spAmount.div(100);

    	lastStoreTime_ = currentTime;

        spRemaining_ = spRemaining_.add(spAmount);
    }

    function useStakePoint(uint _amount) public only_delegate(1) returns (uint) {
        if (spRemaining_ > _amount) {
            spRemaining_ = spRemaining_.sub(_amount);
            spForReward_ = spForReward_.add(_amount);
            return 0;
        } else {
            uint delta = SafeMath.sub(_amount, spRemaining_);
            spForReward_ = spForReward_.sub(spRemaining_);
            spRemaining_ = 0;
            return delta;
        }
    }

    function claimReward() public only_delegate(1) returns (uint) {
        uint currentTime = now;
    	if (currentTime.sub(lastRewardTime_) > divendendDuration_) {
    		uint reward = (spForReward_ / 100) / 365;
    		spForReward_ = 0;
    		return reward;
    	} else {
    		return 0;
    	}
    }

    function getRemainingSP() public only_delegate(1) constant returns (uint) {
    	return spRemaining_;
    }
}

