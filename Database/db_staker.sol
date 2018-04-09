/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBStaker is DBUser {
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

    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        if (_parameter != "Divended Duration") 
            return false;  
        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        return false;
    }

    function removeParameter(bytes32 _parameter) public only_delegate returns (bool) {
        return false; 
    }

    function claimStakePoint() public only_delegate {
    	uint currentTime = now;
    	uint ratio = (currentTime - lastStoreTime_)/DAY_IN_SECONDS_BY_100;
    	uint spAmount = ratio * ERC20Interface(getERC20TokenAddress()).balancOf(address(this)) / 100;
    	lastStoreTime_ = currentTime;

        spRemaining_ += spAmount;
    }

    function useStakePoint(uint _amount) public only_delegate returns (uint) {
        if (spRemaining_ > _amount) {
            spRemaining_ -= _amount;
            spForReward_ += _amount;
            return 0;
        } else {
            uint delta = _amount - spRemaining_;
            spForReward_ += spRemaining_;
            spRemaining_ = 0;
            return delta;
        }
    }

    function claimReward() public only_delegate returns (uint) {
    	if ((now - lastRewardTime_) > divendendDuration_) {
    		uint reward = (spForReward_ / 100) / 365;
    		spForReward_ = 0;
    		return reward;
    	} else {
    		return 0;
    	}
    }
}

