/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract PosBlock is Object {
    struct TxHash {
        bool sentIn_;
        address sender_;
        address receiver_;
        uint gasUsage_;
        uint reigsterTime_;
    }
    
    bool minedStatus_;
    uint sizeLimit_;
    uint nosTransaction_;
    uint currentSize_;
    uint txNos_;
    mapping(uint => TxHash) txHashs_;
    mapping(bytes32 => uint) txIndice_;
    mapping(bytes32 => bool) txExists_;

    address previousBlock_;
    address nextBlock_;
    uint blockSizeLimit_;

    function PosBlock() public Object("null") {
    }

    function setBlockSizeLimit(uint _limit) public only_delegate(1) {
        blockSizeLimit_ = _limit;
    }

    function setPreviousBlock(address _previous) public only_delegate(1) {
        if (previousBlock_ != address(0)) {
            previousBlock_ = _previous;
        }
    }

    function setNextBlock(address _next) public only_delegate(1) {
        if (nextBlock_ != address(0)) {
            nextBlock_ = _next;
        }
    }

    function getPreviousBlock() public only_delegate(1) constant returns (address) {
        return previousBlock_;
    }

    function getNextBlock() public only_delegate(1) constant returns (address) {
        return nextBlock_;
    }
    
    function setMined() public only_delegate(1) {
        minedStatus_ = true;
    }

    function doesMined() public only_delegate(1) constant returns (bool) {
        return minedStatus_;
    }

    function checkIsFull(uint _gasUsage) public only_delegate(1) constant returns (bool) {
        uint size = currentSize_ + _gasUsage;
        if (size < blockSizeLimit_) {
            return true;
        } else {
            return false;
        }
    } 
    
    function registerTx(bool _sentIn, bytes32 _tx, address _sender, address _receiver, uint _gasUsage) public only_delegate(1) returns (bool) {
        if (minedStatus_) return false;

        txExists_[_tx] = true;
        txIndice_[_tx] = txNos_;
        txHashs_[txNos_] = TxHash(_sentIn, _sender, _receiver, _gasUsage, now);
        txNos_++;
        minedStatus_ = true;
        return true;
    }

    function getTxByIndex(uint _index) public only_delegate(1) constant returns (address, address, uint, uint) {
        require(_index < txNos_);
        
        return (txHashs_[_index].sender_, txHashs_[_index].receiver_, txHashs_[_index].gasUsage_, txHashs_[_index].reigsterTime_);
    }

    function getTxByHash(bytes32 _tx) public only_delegate(1) constant returns (address, address, uint, uint) {
        require(txExists_[_tx]);
        return getTxByIndex(txIndice_[_tx]);
    }

    function doesBlockMined() public only_delegate(1) constant returns (bool) {
        return minedStatus_;
    }
    
    function getBlockLimit() public only_delegate(1) constant returns (uint) {
        return sizeLimit_;
    }

    function numTx() public only_delegate(1) constant returns (uint) {
        return txNos_;
    }

    function getCurrentSize() public only_delegate(1) constant returns (uint) {
        return currentSize_;
    }

}

