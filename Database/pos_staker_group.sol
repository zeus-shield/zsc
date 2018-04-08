/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract PosStakerGroup is Object {
    struct ZscStaker {
        bytes32 nodeName_;
        address nodeAddress_;
        address ethAddress_;
        uint dividenDuration_;
        uint earnedStakePoint_;
        uint currentstakePoint_;
        uint rewardedZsc_;
        uint dividenTimes_;
    }

    struct ZscStakerGroup {        
        uint nos_;
        uint spUsed_;
        uint spRemaining_;
        uint settledBlocks_;
        uint dividenDuration_;
        uint dividenTimes_;
        mapping(address => bool) stakerExists_;
        mapping(address => uint) stakerIndex_;
        mapping(uint => ZscStaker) stakers_;
    }

    ZscStakerGroup zscStakerGroup_;

    address zscToken_;

    // Constructor
    function PosStakerGroup() {
        zscStakerGroup_.nos_ = 0;
        zscStakerGroup_.settledBlocks_ = 0;
        zscStakerGroup_.totalGasUsed_ = 0;
    } 

    function setZscTokenAddress(address _adr) public only_delegate {
        zscToken_ = _adr;
    }

    function numStakers() internal constant returns (uint) {
        return zscStakerGroup_.nos_;
    }
    
    function registerStaker(bytes32 _nodeName, address _nodeAddress, address _ethAddress, uint _dividenDuration) public only_delegate {
        require(!zscStakerGroup_.stakerExists_[_ethAddress]);
        uint index = zscStakerGroup_.nos_;
        zscStakerGroup_.nos_++;
        zscStakerGroup_.stakerExists_[_ethAddress] = true;
        zscStakerGroup_.stakerIndex_[_ethAddress] = index;
        zscStakerGroup_.stakers_[index] = ZscStaker(_nodeName, _nodeAddress, _ethAddress, _dividenDuration, 0, 0, 0 ,0)
    }

    function removeStaker(address _ethAddress) public only_delegate  {
        require(zscStakerGroup_.stakerExists_[_ethAddress]);
        uint index = zscStakerGroup_.stakerIndex_[_ethAddress];
        zscStakerGroup_.nos_--;

        delete zscStakerGroup_.stakerExists_[_ethAddress];
        delete zscStakerGroup_.stakerIndex_[_ethAddress];
        delete zscStakerGroup_.stakers_[index];
    }

    function claimStakerSPByIndex(uint _index, uint _amount) public only_delegate {
        zscStakerGroup_.stakers_[_index].spRemaining_ += _amount;
        zscStakerGroup_.spRemaining_ += _amount;
    }

    function useStakerSPByIndex(uint _index, uint _amount) internal returns (uint) {
        if (zscStakerGroup_.stakers_[_index].stakePoint_ > _amount) {
            zscStakerGroup_.stakers_[_index].stakePoint_ -= _amount;
            zscStakerGroup_.spRemaining_ -= _amount;
            return 0;
        } else {
            uint delta = _amount - zscStakerGroup_.stakers_[_index].stakePoint_;
            zscStakerGroup_.stakers_[_index].stakePoint_ = 0;
            zscStakerGroup_.spRemaining_ -= delta;
            return delta;
        }
    }

    function getTotalRemainingSP() public only_delegate constant returns (uint) {
        return zscStakerGroup_.spRemaining_;
    } 
}
