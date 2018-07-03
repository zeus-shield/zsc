/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_include.sol";
import "./sys_gm_base.sol";

contract PosBlock{
    function setBlockSizeLimit(uint _limit) public;
    function setPreviousBlock(address _previous) public;
    function setNextBlock(address _next) public;
    function getPreviousBlock() public constant returns (address);
    function getNextBlock() public constant returns (address);
    function setMined() public;
    function doesMined() public constant returns (bool);
    function checkIsFull(uint _gasUsage) public constant returns (bool);
    function registerTx(address _sender, uint _gasUsage) public returns (bool);
    function getTxInfoByIndex(uint _index) public constant returns (address, uint, uint);
    function getBlockLimit() public constant returns (uint);
    function numTxInfos() public constant returns (uint);
    function getCurrentSize() public constant returns (uint);
}

contract PosBlockPool {
    function getBlockByIndex(uint _blockIndex) public view returns (address);
    function adjustBlockSizeLImit(uint _sizeLimit /*in terms of gas usage*/) public;
    function registerGasUsage(address _sender, uint _gasUsage) public;
    function numTotalBlocks() public view returns (uint);
    function numMinedBlocks() public view returns (uint);
    function minePendingBlockByIndex(uint _index) public returns (uint);
}

contract PosProofPower {
    function createVPUs(uint[] _ratio, uint[] _power, uint[] _priceMin) public;
    function createVPUs(uint _number, uint _ratio, uint _power, uint _priceMin) public;
    function getVPUInfo(uint _vpuId) public view returns (uint, uint, uint, uint);
    function purchaseVPU(address _buyerAdr, uint _vpuId) public;
}

contract PosStakerGroup {
    function setZscTokenAddress(address _adr) public;
    function numStakers() public view returns (uint);
    function registerStakerType(bytes32 _stakerType, uint _dividendDuration, uint _ratio) public;
    function removeStakerType(bytes32 _stakerType) public;
    function addStaker(bytes32 _stakerType, address _nodeAddress) public;
    function removeStaker(address _nodeAddress) public;
    function claimStakerSPByIndex(uint _index, uint _tokenAmount) public returns (uint);
    function getTotalRemainingSP() public view returns (uint);
    function setNextStakerForUseSP(uint _index) public;
    function getNextStakerForUseSP() public view returns (uint);
}

contract SysGmPos is SysGmBase {
    address stakerGroup_;
    address blockPool_;
    address proofPower_;

    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function configurePos(address _stakerGroup, address _blockPool, address _proofPower) public {
        checkDelegate(msg.sender, 1);

        if (_stakerGroup != address(0)) {
            if (stakerGroup_ != _stakerGroup && stakerGroup_ != address(0)) {
                Object(stakerGroup_).kill();
            }
            stakerGroup_ = _stakerGroup;
        }

        if (_blockPool != address(0)) {
            if (blockPool_ != _blockPool && blockPool_ != address(0)) {
                Object(blockPool_).kill();
            }
            blockPool_   = _blockPool;
        }

        if (_proofPower != address(0))  {
            if (proofPower_ != _proofPower && proofPower_ != address(0)) {
                Object(proofPower_).kill();
            }
            proofPower_  = _proofPower;
        }
    }

    function mineSingleBlock(address _block) private {
        uint stakerNos = PosStakerGroup(stakerGroup_).numStakers();
        uint blockSize = PosBlock(_block).getCurrentSize();
        bool minedTag = false;
        while (true) {
            for (uint i = PosStakerGroup(stakerGroup_).getNextStakerForUseSP(); i < stakerNos; ++i) {
                blockSize = blockSize - 1;// + useStakerSPByIndex(i, 1);
                if (blockSize == 0) {
                    PosStakerGroup(stakerGroup_).setNextStakerForUseSP(i);
                    PosBlock(_block).setMined();
                    minedTag = true;
                }
            }
            if (minedTag) {
                break;
            }
        }
    }

    function minePendingBlocks() public {
        checkDelegate(msg.sender, 1);

        uint totalBlocks = PosBlockPool(blockPool_).numTotalBlocks();
        uint minedBlocks = PosBlockPool(blockPool_).numMinedBlocks();
        address blockAdr;

        for (uint i = minedBlocks - 1; i < totalBlocks; ++i) {
            blockAdr = PosBlockPool(blockPool_).getBlockByIndex(i);
            if (PosBlock(blockAdr).getCurrentSize() > PosStakerGroup(stakerGroup_).getTotalRemainingSP()) {
                break;
            }

            mineSingleBlock(blockAdr);
        }
    }

    function numBlockInfo(bool _isMined) public constant returns (uint) {
        checkDelegate(msg.sender, 1);

        if (_isMined) {
            return PosBlockPool(blockPool_).numMinedBlocks();
        } else {
            return PosBlockPool(blockPool_).numTotalBlocks();
        }
    }

    function getBlockInfoByIndex(uint _blockIndex) public constant returns (uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        address blockAdr = PosBlockPool(blockPool_).getBlockByIndex(_blockIndex);

        uint size = PosBlock(blockAdr).getCurrentSize();
        uint txNos = PosBlock(blockAdr).numTxInfos();
        uint limit = PosBlock(blockAdr).getBlockLimit();

        return (limit, size, txNos);
    }
}
