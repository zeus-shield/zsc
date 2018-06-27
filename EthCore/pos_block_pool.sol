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

    function getBlockByIndex(uint _blockIndex) public view returns (address) {
        checkDelegate(msg.sender, 1);
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

    function adjustBlockSizeLImit(uint _sizeLimit /*in terms of gas usage*/) public {
        checkDelegate(msg.sender, 1);
        blockSizeLimit_ = _sizeLimit;
    }

    function registerGasUsage(address _sender, uint _gasUsage) public {
        checkDelegate(msg.sender, 1);
        remaingGasUsage_ = remaingGasUsage_.add(_gasUsage);

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
        totalBlockNos_++;
    }

    function getLastPendingBlockIndex() public view returns (uint) { 
        checkDelegate(msg.sender, 1);
        
        if (totalBlockNos_ == 0) return 0;
        address myBlock;

        for (uint i = totalBlockNos_ - 1; i >= 0; --i) {
            myBlock = blocks_[i];
            if (PosBlock(myBlock).doesMined()) {
                return (i + 1);
            }
        }
        return 0;
    }

    function numTotalBlocks() public view returns (uint) { 
        checkDelegate(msg.sender, 1);
        return totalBlockNos_; 
    }

    function numMinedBlocks() public view returns (uint) { 
        checkDelegate(msg.sender, 1);
        return minedBlockNos_; 
    }

    function setBlockMinedByIndex(uint _blockIndex) public {
        checkDelegate(msg.sender, 1);
        
        address blockAdr = blocks_[_blockIndex];
        PosBlock(blockAdr).setMined();
        minedBlockNos_++;
    }
}
