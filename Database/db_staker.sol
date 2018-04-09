/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBStaker is DBUser {
    address private templates_ = 0;
    uint private spRemaining_;
    uint private spForReward_;
    uint private divendendDuration_;
    uint private rewardUnitAsZsc_;

    // Constructor
    function DBStaker(bytes32 _name) public DBUser(_name) {
        setNodeType("staker"); 
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

    function storeStakePoint(uint _amount) public only_delegate {
        spRemaining_ += _amount;
        zscStakerGroup_.spRemaining_ += _amount;
    }

    function useStakePoint(uint _amount) public only_delegate returns (uint) {
        if (spRemaining_ > _amount) {
            spRemaining_ -= _amount;
            return 0;
        } else {
            uint delta = _amount - spRemaining_;
            spRemaining_ = 0;
            return delta;
        }
    }

    function claimReward() public only_delegate returns (uint) {
    	uint zscAmount = spForReward_ * rewardUnitAsZsc_;
    	spForReward_ = 0;
    	return zscAmount;
    }

}

