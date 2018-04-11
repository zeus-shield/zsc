/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_node.sol";

contract DBBlock is DBNode {
    struct TxHash {
        address sender_;
        address receiver_;
        uint gasUsage_;
        uint reigsterTime_;
    }
    
    bool minedStatus_;
    uint blockLimit_;
    uint nosTransaction_;
    uint currentSize_;
    uint txNos_;
    mapping(uint => TxHash) txHashs_;
    mapping(bytes32 => uint) txIndice_;

    function DBBlock() public DBNode(_name) {
    }

    function registerTransaction(bytes32 _tx, bytes32 _sender, bytes32 _receiver, uint _gasUsage) public constant only_delegate(1) returns (bool) {
        if (minedStatus_) return false;
        
        uint size = currentSize_ + _gasUsage;
        if (size < blockUnitLimit_) {
            txIndice_[_tx] = txNos_;
            txHashs_[txNos_] = TxHash(_sender, _receiver, _gasUsage, now);
            txNos_++;
            return true;
        } else {
            minedStatus_ = true;
            return false;
        }
    }

    function doesBlockMined() public only_delegate(1) constant returns (bool) {
        return minedStatus_;
    }
    
    function getBlockLimit() public only_delegate(1) constant return (uint) {
        return blockLimit_;
    }

    function getTxNos() public only_delegate(1) constant return (uint) {
        return txNos_;
    }

    function getCurrentSize public only_delegate(1) constant return (uint) {
        return currentSize_
    }

    function getTxInfoByIndex(uint _index) public only_delegate(1) constant returns (address, address, uint, uint) {
        require(_index < txNos_);
        
        return (txHashs_[_index].sender_, txHashs_[_index].receiver_, txHashs_[_index].gasUsage_, txHashs_[_index].reigsterTime_);
    }
    
  
}

