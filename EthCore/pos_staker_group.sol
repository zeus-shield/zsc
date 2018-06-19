/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract DBStaker {
    function useStakePoint(uint _amount) public returns (uint);
    function claimReward() public returns (uint);
    function getRemainingSP() public constant returns (uint);
}

contract PosStakerGroup is Delegated {
    uint private constant FULL_YEAR_IN_SECONDS = 86400 * 365;
    uint private constant HALF_YEAR_IN_SECONDS = 86400 * 365 / 2;
    uint private constant QUATER_YEAR_IN_SECONDS = 86400 * 365 / 4;

    struct StakerInfo {
        address adr_;
        uint dividendDuration_;
        uint startTime_;
        uint endTime_;
        uint rewardRate_;
    }

    uint private stakerNos_;
    uint private spUsed_;
    uint private spRemaining_;
    uint private nextStakerForUseSP_;
    mapping(address => uint)    private stakerIndex_;
    mapping(uint => StakerInfo) private stakers_;
    mapping(address => bool)    private stakerExists_;
    mapping(byte32 => uint)     private rewardRatios_;
    mapping(byte32 => uint)     private rewardDividendDurations_;

    address private zscTokenContract_;
    uint private rewardBasis_;


    // Constructor
    function PosStakerGroup() public {
        stakerNos_ = 0;
        spUsed_ = 0;
        spRemaining_ = 0;
        rewardBasis_ = 1;
    } 

    function setZscTokenAddress(address _adr) public {
        checkDelegate(msg.sender, 1);
        zscTokenContract_ = _adr;
    }

    function numStakers() internal constant returns (uint) {
        return stakerNos_;
    }

    function addStakeType(byte32 _type, uint _dividendDuration, uint _ratio) public {
        checkDelegate(msg.sender, 1);
        require(rewardRatio[_type] == 0 && _dividendDuration != 0 && _ratio != 0);
        rewardRatios_[_type] = _ratio;
        rewardDividendDurations_[_type] = _dividendDuration;
    }

    function removeStakeType(byte32 _type) public {
        checkDelegate(msg.sender, 1);
        require(rewardRatio[_type] != 0);
        delete rewardRatio[_type];
        delete rewardDividendDurations_[_type];
    }
    
    function registerStaker(address _nodeAddress, byte32 _stakeType) public {
        checkDelegate(msg.sender, 1);
        require(_nodeAddress != 0 && stakerExists_[_nodeAddress] == false && rewardRatio[_type] != 0);

        uint currentTime = now;
        uint duration = rewardDividendDurations_[_type];
        uint ratio = rewardRatio[_stakeType];

        stakerExists_[_nodeAddress] = true;
        stakerIndex_[_nodeAddress] = stakerNos_;
        stakers_[index] = StakerInfo(_nodeAddress, duration, currentTime, currentTime + duration, ratio);
        stakerNos_++;
    }

    function removeStaker(address _nodeAddress) public {
        checkDelegate(msg.sender, 1);

        require(stakerExists_[_nodeAddress]);

        uint index = stakerIndex_[_nodeAddress];

        if (index > 0) {
            address lastAddress = stakers_[stakerNos_ - 1];
    
            stakers_[index] = lastAddress;
    
            delete stakerIndex_[_nodeAddress];
            delete stakers_[stakerNos_ - 1];

            stakerNos_--;
        } else {
            delete stakerIndex_[_nodeAddress];
            delete stakers_[0];
            stakerExists_[_nodeAddress] = false;
            stakerNos_ = 0;
        }
    }

    function useStakerSPByIndex(uint _index, uint _amount) internal returns (uint) {
        return DBStaker(stakers_[_index]).useStakePoint(_amount);
    }

    function getTotalRemainingSP() internal constant returns (uint) {
        checkDelegate(msg.sender, 1);

        uint total = 0;

        for (uint i = 1; i < stakerNos_; ++i) {
            total = total.add(DBStaker(stakers_[i]).getRemainingSP());
        }
        return total;
    } 

    function setNextStakerForUseSP(uint _index) internal {
        nextStakerForUseSP_ = _index;
        if (nextStakerForUseSP_ == stakerNos_) {
            nextStakerForUseSP_ = 0;
        }
    }

    function getNextStakerForUseSP() internal constant returns (uint) {
        return nextStakerForUseSP_;
    }
}
