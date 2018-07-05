/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract PosGasPool is Delegated {
    struct BlockInfo {
        bool mined_;
        uint blockSize_;
        uint reigsterTime_;
    }

    uint totalBlockNos_;
    uint minedBlockNos_;
    uint minedGasUsage_;
    uint remaingPower_;
    mapping(uint => BlockInfo) blocks_;
    
    ////////////////
    uint blockSizeLimit_;

    address private posGm_;

    // Constructor
    function PosGasPool() public {
        blockSizeLimit_ = 1024 * 1024 * 2;
    } 

    function initPosGasPool(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }

    function registerPower(uint _power) public {
        checkDelegate(msg.sender, 1);
        require(posGm_ != address(0));

        remaingPower_ = remaingPower_.add(_power);

        uint curPower = _power;
        while (curPower > blockSizeLimit_) {
            blocks_[totalBlockNos_] = BlockInfo(false, blockSizeLimit_, now);
            totalBlockNos_++;
            curPower = curPower.sub(blockSizeLimit_);
        }
        blocks_[totalBlockNos_] = BlockInfo(false, curPower, now);
        totalBlockNos_++; 
    }

    function getBlockByIndex(uint _blockIndex) public view returns (uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_blockIndex < totalBlockNos_);
        return (blocks_[_blockIndex].gasUsage_, blocks_[_blockIndex].reigsterTime_);
    }

    function numBlocks() public view returns (uint, uint) { 
        checkDelegate(msg.sender, 1);
        return (totalBlockNos_, minedBlockNos_); 
    }
    
    function minePendingBlockByIndex(uint _index) public returns (uint) {
        checkDelegate(msg.sender, 1);
        require(_index < totalBlockNos_);
        
        if (blocks_[_index].mined_ == true) {
            return 0;
        } else {
            blocks_[_index].mined_ = true;
            minedBlockNos_++;
            return blocks_[_index].gasUsage_;
        }
    }
}

