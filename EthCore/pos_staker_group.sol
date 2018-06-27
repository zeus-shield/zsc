/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract DBStaker {
    function setPoSInfo(uint _divendendDuration, uint _rewardBaseRatio, uint _startTime, uint _endTime) public;
    function claimStakePoint(uint _tokenAmount) public returns (uint);
    function getRemainingStakePoint(uint _tokenAmount) public view returns (uint);
    function getMiningInfoByIndexs(uint _index) public constant returns (uint, uint);
    function numMiningInfo() public constant returns (uint);
}

contract PosStakerGroup is Delegated {
    uint private constant FULL_YEAR_IN_SECONDS = 86400 * 365;
    uint private constant HALF_YEAR_IN_SECONDS = 86400 * 365 / 2;
    uint private constant QUATER_YEAR_IN_SECONDS = 86400 * 365 / 4;

    struct StakerInfo {
        address adr_;
        uint dividendDuration_;
        uint rewardRate_;
        uint startTime_;
        uint endTime_;
    }
    
    uint private stakerNos_;
    uint private spUsed_;
    uint private spRemaining_;
    uint private nextStakerForUseSP_;
    mapping(address => uint)    private stakerIndex_;
    mapping(uint => StakerInfo) private stakers_;
    mapping(address => bool)    private stakerExists_;
    mapping(bytes32 => uint)    private rewardRatios_;
    mapping(bytes32 => uint)    private rewardDividendDurations_;

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

    function numStakers() public view returns (uint) {
        checkDelegate(msg.sender, 1);
        return stakerNos_;
    }

    function registerStakerType(bytes32 _stakerType, uint _dividendDuration, uint _ratio) public {
        checkDelegate(msg.sender, 1);
        require(rewardRatios_[_stakerType] == 0 && _dividendDuration != 0 && _ratio != 0);
        rewardRatios_[_stakerType] = _ratio;
        rewardDividendDurations_[_stakerType] = _dividendDuration;
    }
    
    function removeStakerType(bytes32 _stakerType) public {
        checkDelegate(msg.sender, 1);
        require(rewardRatios_[_stakerType] != 0);
        delete rewardRatios_[_stakerType];
        delete rewardDividendDurations_[_stakerType];
    }
    
    function addStaker(bytes32 _stakerType, address _nodeAddress) public {
        checkDelegate(msg.sender, 1);
        require(_nodeAddress != 0 && stakerExists_[_nodeAddress] == false && rewardRatios_[_stakerType] != 0);

        uint currentTime = now;
        uint duration = rewardDividendDurations_[_stakerType];
        uint ratio = rewardRatios_[_stakerType];

        stakerExists_[_nodeAddress] = true;
        stakerIndex_[_nodeAddress] = stakerNos_;
        stakers_[stakerNos_] = StakerInfo(_nodeAddress, duration, currentTime, currentTime + duration, ratio);
        stakerNos_++;
    }

    function removeStaker(address _nodeAddress) public {
        checkDelegate(msg.sender, 1);

        require(stakerExists_[_nodeAddress]);

        uint index = stakerIndex_[_nodeAddress];

        if (index > 0) {
            address lastAddress = stakers_[stakerNos_ - 1].adr_;
    
            stakers_[index].adr_ = lastAddress;
    
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

    function claimStakerSPByIndex(uint _index, uint _tokenAmount) public returns (uint) {
        checkDelegate(msg.sender, 1);
        return DBStaker(stakers_[_index].adr_).claimStakePoint(_tokenAmount);
    }

    function getTotalRemainingSP() public view returns (uint) {
        checkDelegate(msg.sender, 1);

        uint total = 0;

        for (uint i = 1; i < stakerNos_; ++i) {
            //total = total.add(DBStaker(stakers_[i].adr_).getRemainingSP());
        }
        return total;
    } 

    function setNextStakerForUseSP(uint _index) public {
        checkDelegate(msg.sender, 1);

        nextStakerForUseSP_ = _index;
        if (nextStakerForUseSP_ == stakerNos_) {
            nextStakerForUseSP_ = 0;
        }
    }

    function getNextStakerForUseSP() public view returns (uint) {
        checkDelegate(msg.sender, 1);
        return nextStakerForUseSP_;
    }
}
