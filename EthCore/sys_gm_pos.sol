/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_include.sol";
import "./sys_gm_base.sol";
import "./pos_block_pool.sol";
import "./pos_staker_group.sol";

//Proof of Stake for ZSC system
contract SysGmPos is SysGmBase {
    address stakerGroup_;
    address blockPool_;

    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function initSysGm(address _adr) public {
        checkDelegate(msg.sender, 1);
        stakerGroup_ = new PosStakerGroup();
        blockPool_ = new PosBlockPool();
        super.initSysGm(_adr);
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

        uint blockNos = PosBlockPool(blockPool_).numTotalBlocks();
        address blockAdr;

        for (uint i = PosBlockPool(blockPool_).getLastPendingBlockIndex(); i < blockNos - 1; ++i) {
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
