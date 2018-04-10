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
    struct ZscStakerGroup {        
        uint nos_;
        uint spUsed_;
        uint spRemaining_;
        mapping(address => uint) stakerIndex_;
        mapping(uint => address) stakers_;
    }

    ZscStakerGroup zscStakerGroup_;

    address zscToken_;

    // Constructor
    function PosStakerGroup() {
        zscStakerGroup_.nos_ = 0;
        zscStakerGroup_.spUsed_ = 0;
        zscStakerGroup_.spRemaining_ = 0;
        zscStakerGroup_.stakerIndex_[address(0)] = 0;
        zscStakerGroup_.stakers_[0] = address(0);
    } 

    function setZscTokenAddress(address _adr) public only_delegate(1) {
        zscToken_ = _adr;
    }

    function numStakers() internal constant returns (uint) {
        return zscStakerGroup_.nos_;
    }
    
    function registerStaker(address _nodeAddress) public only_delegate(1) {
        require(_nodeAddress != 0 && zscStakerGroup_.stakerIndex_[_nodeAddress] == 0);
        uint index = zscStakerGroup_.nos_;
        zscStakerGroup_.stakerIndex_[_nodeAddress] = index;
        zscStakerGroup_.stakers_[index] = _nodeAddress;
        zscStakerGroup_.nos_++;
    }

    function removeStaker(address _nodeAddress) public only_delegate(1)  {
        require(zscStakerGroup_.stakerExists_[_nodeAddress]);
        uint index = zscStakerGroup_.stakerIndex_[_nodeAddress];
        address lastAddress = zscStakerGroup_.stakers_[zscStakerGroup_.nos_ - 1];

        zscStakerGroup_.stakers_[index] = lastAddress;

        delete zscStakerGroup_.stakerIndex_[_nodeAddress];
        delete zscStakerGroup_.stakers_[zscStakerGroup_.nos_ - 1];
        zscStakerGroup_.nos_--;
    }

    function useStakerSPByIndex(uint _index, uint _amount) internal returns (uint) {
        return DBStaker(zscStakerGroup_.stakers_[_index]).useStakePoint(_amount);
    }

    function getTotalRemainingSP() public only_delegate(1) constant returns (uint) {
        uint total = 0;

        for (uint i = 1; i < zscStakerGroup_.nos_; ++i) {
            total += DBStaker(zscStakerGroup_.stakers_[i]).getRemainingSP();
        }
        return total;
    } 
}
