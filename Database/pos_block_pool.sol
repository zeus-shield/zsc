/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./pos_block.sol";
import "./db_block.sol"

contract PosBlockPool is Object {
    struct BlockPool {
        uint blockNos_;
        uint minedGasUsage_;
        uint remaingGasUsage_;
        mapping(uint => address) blocks_;
    }

    uint private poolNos_;
    mapping(uint => BlockPool) private pools_;
    mapping(bytes32 => uint) private poolIndice_;
    mapping(bytes32 => bool) private poolExists_;

    ////////////////
    uint blockSizeLimit_;

    // Constructor
    function BlockPool() {
    } 

    function createBlock() internal returns (address);

    function createPool(bytes32 _name, uint _dividendDuration, uint _rewardRate /* x / 1000: x = 0, 1, 2, ..., 1000) */) public only_delegate(1) {
        require(poolExists_[_name]);

        poolIndice_[_name] = poolNos_;
        pools_[poolNos_].blockNos_ = 0;
        pools_[poolNos_].minedGasUsage_ = 0;
        pools_[poolNos_].remaingGasUsage_ = 0;
    }

    function adjustBlockSize(uint _sizeLimit /*in terms of gas usage*/) internal {
        poolNos_ = 0;
        blockSizeLimit_ = _sizeLimit;
    }

    function registerNewBlock(uint _poolIndex) internal returns (bool) {
        uint blockIndex = pools_[_poolIndex].blockNos_;
        address adr = createBlock();

        pools_[_poolIndex].blocks_[blockIndex] = adr;
        pools_[_poolIndex].blocks_ ++;
    }

    function registerNewBlock(uint _poolIndex) internal returns (bool) {
        uint blockIndex = pools_[_poolIndex].blockNos_;
        address adr = createBlock();

        pools_[_poolIndex].blocks_[blockIndex] = adr;
        pools_[_poolIndex].blocks_ ++;
    }

    function registerNewTx(uint _poolIndex, uint _blockIndex, bytes32 _tx, bytes32 _sender, bytes32 _receiver, uint _gasUsage) internal returns (bool) {
        pools_[_poolIndex].remaingGasUsage_ += _gasUsage;
        return PosBlock(pools_[_poolIndex].blocks_[_blockIndex]).registerTx(bytes32 _tx, bytes32 _sender, bytes32 _receiver, uint _gasUsage);
    }

    function getLastPendingBlockIndex() internal constant returns (uint) { 
        if (pools_ == 0) return 0;

        for (uint i = poolNos_ - 1; i >= 0; --i) {
            address block = pools_[i].
            if (PosBlock(pools_[i]).doesMined() == true) {
                return (i + 1);
            }
        }
        return 0;
    }

    function numBlocks(uint _poolIndex) internal constant returns (uint) { 
        return pools_[_poolIndex].blockNos_; 
    }
    
    function getBlockSizeByIndex(uint _poolIndex, uint _blockIndex) internal constant returns (address) {
        return PosBlock(pools_[_poolIndex].blocks_[_blockIndex]).getCurrentSize();
    }
}
