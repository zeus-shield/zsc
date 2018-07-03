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

    address private posGm_;

    // Constructor
    function PosBlockPool() public {
        blockSizeLimit_ = 1024 * 1024 * 2;
    } 

    function initPosBlockPool(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }

    function getBlockByIndex(uint _blockIndex) public view returns (address) {
        checkDelegate(msg.sender, 1);
        require(_blockIndex < totalBlockNos_);
        return blocks_[_blockIndex];
    }

    function registerNewBlock() private returns (address) {
        address adr = new PosBlock();
        require(adr != address(0) && posGm_ != address(0));
        
        PosBlock(adr).setDelegate(posGm_, 1);
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

    function numTotalBlocks() public view returns (uint) { 
        checkDelegate(msg.sender, 1);
        return totalBlockNos_; 
    }

    function numMinedBlocks() public view returns (uint) { 
        checkDelegate(msg.sender, 1);
        return minedBlockNos_; 
    }

    function minePendingBlockByIndex(uint _index) public returns (uint) {
        checkDelegate(msg.sender, 1);
        require(_index < totalBlockNos_);
        
        address myBlock = blocks_[_index];
        if (PosBlock(myBlock).doesMined()) {
            return 0;
        } else {
            PosBlock(myBlock).setMined();
            minedBlockNos_++;
            return PosBlock(myBlock).getCurrentSize();
        }
    }
}
