/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_include.sol";
import "./sys_gm_base.sol";

//Proof of Stake for ZSC system
contract SysGmPos is SysGmBase {
    address stakerGroup_;
    address blockPool_;

    // Constructor
    function PosBase(bytes32 _name) public SysGmBase(_name) {
    } 

    function mineSingleBlock(address _block) private {
        uint stakerNos = numStakers();
        uint blockSize = PosBlock(_block).getCurrentSize();
        bool minedTag = false;
        while (true) {
            for (uint i = getNextStakerForUseSP(); i < stakerNos; ++i) {
                blockSize = blockSize - 1;// + useStakerSPByIndex(i, 1);
                if (blockSize == 0) {
                    setNextStakerForUseSP(i);
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

        uint blockNos = numTotalBlocks();
        address blockAdr;

        for (uint i = getLastPendingBlockIndex(); i < blockNos - 1; ++i) {
            blockAdr = getBlockByIndex(i);
            if (PosBlock(blockAdr).getCurrentSize() > getTotalRemainingSP()) {
                break;
            }

            mineSingleBlock(blockAdr);
        }
    }

    function numBlockInfo(bool _isMined) public constant returns (uint) {
        checkDelegate(msg.sender, 1);

        if (_isMined) {
            return numMinedBlocks();
        } else {
            return numTotalBlocks();
        }
    }

    function getBlockInfoByIndex(uint _blockIndex) public constant returns (uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        address blockAdr = getBlockByIndex(_blockIndex);

        uint size = PosBlock(blockAdr).getCurrentSize();
        uint txNos = PosBlock(blockAdr).numTxInfos();
        uint limit = PosBlock(blockAdr).getBlockLimit();

        return (limit, size, txNos);
    }
}
