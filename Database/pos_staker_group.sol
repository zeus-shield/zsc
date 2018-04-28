/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./plat_math.sol";

contract DBStaker is Object {
    function useStakePoint(uint _amount) public returns (uint);
    function claimReward() public returns (uint);
    function getRemainingSP() public constant returns (uint);
}

contract PosStakerGroup is Object {
    uint private stakerNos_;
    uint private spUsed_;
    uint private spRemaining_;
    uint private nextStakerForUseSP_;
    mapping(address => uint) private stakerIndex_;
    mapping(uint => address) private stakers_;
    mapping(address => bool) private stakerExists_;

    address private zscTokenContract_;

    // Constructor
    constructor() public {
        stakerNos_ = 0;
        spUsed_ = 0;
        spRemaining_ = 0;
    } 

    function setZscTokenAddress(address _adr) public only_delegate(1) {
        zscTokenContract_ = _adr;
    }

    function numStakers() internal constant returns (uint) {
        return stakerNos_;
    }
    
    function registerStaker(address _nodeAddress) public only_delegate(1) {
        require(_nodeAddress != 0 && stakerIndex_[_nodeAddress] == 0);
        uint index = stakerNos_;

        stakerExists_[_nodeAddress] = true;
        stakerIndex_[_nodeAddress] = index;

        stakers_[index] = _nodeAddress;
        stakerNos_++;
    }

    function removeStaker(address _nodeAddress) public only_delegate(1)  {
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

    function getTotalRemainingSP() internal only_delegate(1) constant returns (uint) {
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
