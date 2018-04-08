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
        uint stakePoint_;
        uint rewardedZsc_;
        uint dividenDuration_;
        uint dividenTimes_;
        mapping(uint => uint) zscAmounts_;
    }

    struct ZscStakerGroup {        
        uint nos_;
        uint totalGasUsed_;
        uint settledBlocks_;
        uint dividenDuration_;
        uint dividenTimes_;
        mapping(address => bool) stakerExists_;
        mapping(address => uint) stakerIndex_;
        mapping(uint => ZscStaker) stakers_;
    }

    ZscStakerGroup ZscStakerGroup_;

    address zscToken_;

    // Constructor
    function PosStakerGroup() {
        ZscStakerGroup_.nos_ = 0;
        ZscStakerGroup_.settledBlocks_ = 0;
        ZscStakerGroup_.totalGasUsed_ = 0;
    } 

    function setZscTokenAddress(address _adr) public only_delegate {
        zscToken_ = _adr;
    }

    function registerStaker(bytes32 _nodeName, address _nodeAddress, address _ethAddress) public only_delegate {
        require(!ZscStakerGroup_.stakerExists_[_ethAddress]);
        uint index = ZscStakerGroup_.nos_;
        ZscStakerGroup_.nos_++;
        ZscStakerGroup_.stakerExists_[_ethAddress] = true;
        ZscStakerGroup_.stakerIndex_[_ethAddress] = index;
        ZscStakerGroup_.stakers_[index].nodeName_    = _nodeName;
        ZscStakerGroup_.stakers_[index].nodeAddress_ = _nodeAddress;
        ZscStakerGroup_.stakers_[index].ethAddress_  = _ethAddress;
        ZscStakerGroup_.stakers_[index].stakePoint_  = 0;
    }

    function removeStaker(address _ethAddress) public only_delegate  {
        require(ZscStakerGroup_.stakerExists_[_ethAddress]);
        uint index = ZscStakerGroup_.stakerIndex_[_ethAddress];
        ZscStakerGroup_.nos_--;

        delete ZscStakerGroup_.stakerExists_[_ethAddress];
        delete ZscStakerGroup_.stakerIndex_[_ethAddress];
        delete ZscStakerGroup_.stakers_[index];
    }
}
