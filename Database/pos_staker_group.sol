/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract DBStaker {
    function useStakePoint(uint _amount) public only_delegate(1) returns (uint);
    function claimReward() public only_delegate(1) returns (uint);
    function getRemainingSP() public only_delegate(1) constant returns (uint);
}

contract PosStakerGroup is Object {
    uint private stakerNos_;
    uint private spUsed_;
    uint private spRemaining_;
    uint private nextStakerForUseSP_;
    mapping(address => uint) private stakerIndex_;
    mapping(uint => address) private stakers_;

    address zscToken_;

    // Constructor
    function PosStakerGroup() {
        stakerNos_ = 0;
        spUsed_ = 0;
        spRemaining_ = 0;
        stakerIndex_[address(0)] = 0;
        stakers_[0] = address(0);
    } 

    function setZscTokenAddress(address _adr) public only_delegate(1) {
        zscToken_ = _adr;
    }

    function numStakers() internal constant returns (uint) {
        return stakerNos_;
    }
    
    function registerStaker(address _nodeAddress) public only_delegate(1) {
        require(_nodeAddress != 0 && stakerIndex_[_nodeAddress] == 0);
        uint index = stakerNos_;
        stakerIndex_[_nodeAddress] = index;
        stakers_[index] = _nodeAddress;
        stakerNos_++;
    }

    function removeStaker(address _nodeAddress) public only_delegate(1)  {
        require(stakerExists_[_nodeAddress]);
        uint index = stakerIndex_[_nodeAddress];
        address lastAddress = stakers_[stakerNos_ - 1];

        stakers_[index] = lastAddress;

        delete stakerIndex_[_nodeAddress];
        delete stakers_[stakerNos_ - 1];
        stakerNos_--;
    }

    function useStakerSPByIndex(uint _index, uint _amount) internal returns (uint) {
        return DBStaker(stakers_[_index]).useStakePoint(_amount);
    }

    function getTotalRemainingSP() public only_delegate(1) constant returns (uint) {
        uint total = 0;

        for (uint i = 1; i < stakerNos_; ++i) {
            total += DBStaker(stakers_[i]).getRemainingSP();
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
