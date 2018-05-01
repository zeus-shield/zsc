/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./pos_block.sol";

contract PosBlockPool is Object {
    struct BlockPool {
        uint totalBlockNos_;
        uint minedBlockNos_;
        uint minedGasUsage_;
        uint remaingGasUsage_;
        uint rewardRate_;
        uint dividendDuration_;
        mapping(uint => address) blocks_;
    }

    uint private poolNos_;
    mapping(uint => BlockPool) private pools_;
    mapping(bytes32 => uint) private poolIndice_;
    mapping(bytes32 => bool) private poolExists_;

    ////////////////
    uint blockSizeLimit_;

    // Constructor
    constructor() public {
        blockSizeLimit_ = 1024 * 1024 * 2;
        minedBlockNos_ = 0;
    } 

    function createPool(bytes32 _name, uint _dividendDuration, uint _rewardRate /* x / 1000: x = 0, 1, 2, ..., 1000) */) public {
        checkDelegate(msg.sender, 1);
        require(poolExists_[_name]);

        poolIndice_[_name] = poolNos_;
        pools_[poolNos_].totalBlockNos_ = 0;
        pools_[poolNos_].minedBlockNos_ = 0;
        pools_[poolNos_].minedGasUsage_ = 0;
        pools_[poolNos_].remaingGasUsage_ = 0;
        pools_[poolNos_].dividendDuration_ = _dividendDuration;
        pools_[poolNos_].rewardRate_ = _rewardRate;
    }

    function getBlockByIndex(uint _poolIndex, uint _blockIndex) internal constant returns (address) {
        require(_poolIndex < poolNos_);
        require(_blockIndex < pools_[_poolIndex].nos_);
        
        return pools_[_poolIndex].blocks_[_blockIndex];
    }

    function registerNewBlock(uint _poolIndex) private returns (address) {
        uint blockIndex = pools_[_poolIndex].nos_;
        address adr = new PosBlock();

        require(adr != address(0));
        PosBlock(adr).setBlockSizeLimit(blockSizeLimit_);

        pools_[_poolIndex].blocks_[blockIndex] = adr;
        pools_[_poolIndex].nos_++;
        return adr;
    }

    function adjustBlockSizeLImit(uint _sizeLimit /*in terms of gas usage*/) internal {
        blockSizeLimit_ = _sizeLimit;
    }

    function registerNewTx(bool _input, uint _poolIndex, bytes32 _tx, address _sender, address _receiver, uint _gasUsage) public {
        checkDelegate(msg.sender, 1);

        pools_[_poolIndex].remaingGasUsage_ += _gasUsage;
        uint blockIndex;
        address myBlock;
        if (pools_[_poolIndex].totalBlockNos_ == 0) {
            myBlock = registerNewBlock(_poolIndex);
        } else {
            blockIndex = pools_[_poolIndex].totalBlockNos_ - 1;
            myBlock = getBlockByIndex(_poolIndex, blockIndex);
           
            if (PosBlock(myBlock).checkIsFull(_gasUsage)) {
                address adr = registerNewBlock(_poolIndex);
                PosBlock(myBlock).setNextBlock(adr);
                PosBlock(adr).setPreviousBlock(myBlock);
                myBlock = adr;
            }
        }
        PosBlock(myBlock).registerTx(_input, _tx, _sender, _receiver, _gasUsage);
        pools_[_poolIndex].totalBlockNos_++;
    }

    function getLastPendingBlockIndex(uint _poolIndex) internal constant returns (uint) { 
        if (pools_[_poolIndex].nos_ == 0) return 0;
        address myBlock;

        for (uint i = poolNos_ - 1; i >= 0; --i) {
            myBlock = pools_[_poolIndex].blocks_[i];
            if (PosBlock(myBlock).doesMined()) {
                return (i + 1);
            }
        }
        return 0;
    }

    function numTotalBlocks(uint _poolIndex) internal constant returns (uint) { 
        return pools_[_poolIndex].totalBlockNos_; 
    }

    function numMinedBlocks(uint _poolIndex) internal constant returns (uint) { 
        return pools_[_poolIndex].minedBlockNos_; 
    }

    function setBlockMinedByIndex(uint _poolIndex, uint _blockIndex) internal {
        address block = pools_[_poolIndex].blocks_[_blockIndex];
        PosBlock(block).setMined();
        pools_[_poolIndex].minedBlockNos_++;
    }
}
