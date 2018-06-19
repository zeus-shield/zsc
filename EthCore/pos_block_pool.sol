/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./pos_block.sol";

contract PosBlockPool is Delegated {
    uint totalBlockNos_;
    uint minedBlockNos_;
    uint minedGasUsage_;
    uint remaingGasUsage_;
    mapping(uint => address) blocks_;
    
    ////////////////
    uint blockSizeLimit_;

    // Constructor
    function PosBlockPool() public {
        blockSizeLimit_ = 1024 * 1024 * 2;
    } 

    function getBlockByIndex(uint _blockIndex) internal constant returns (address) {
        require(_blockIndex < totalBlockNos_);
        
        return blocks_[_blockIndex];
    }

    function registerNewBlock() private returns (address) {
        address adr = new PosBlock();
        require(adr != address(0));

        PosBlock(adr).setBlockSizeLimit(blockSizeLimit_);

        blocks_[totalBlockNos_] = adr;
        totalBlockNos_++;
        return adr;
    }

    function adjustBlockSizeLImit(uint _sizeLimit /*in terms of gas usage*/) internal {
        blockSizeLimit_ = _sizeLimit;
    }

    function registerGasUsage(address _sender, uint _gasUsage) public {
        checkDelegate(msg.sender, 1);

        remaingGasUsage_ += _gasUsage;
        
        address myBlock;
        if (totalBlockNos_ == 0) {
            myBlock = registerNewBlock();
        } else {
            myBlock = getBlockByIndex(totalBlockNos_ - 1);
           
            if (PosBlock(myBlock).checkIsFull(_gasUsage)) {
                address adr = registerNewBlock();
                PosBlock(myBlock).setNextBlock(adr);
                PosBlock(adr).setPreviousBlock(myBlock);
                myBlock = adr;
            }
        }
        PosBlock(myBlock).registerTx(_sender, _gasUsage);
        pools_[_poolIndex].totalBlockNos_++;
    }

    function getLastPendingBlockIndex(uint _poolIndex) internal constant returns (uint) { 
        if (pools_[_poolIndex].totalBlockNos_ == 0) return 0;
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
        address blockAdr = pools_[_poolIndex].blocks_[_blockIndex];
        PosBlock(blockAdr).setMined();
        pools_[_poolIndex].minedBlockNos_++;
    }
}
