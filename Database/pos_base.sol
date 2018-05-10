/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./pos_block_pool.sol";
import "./pos_staker_group.sol";
import "./manager_base.sol";

//Proof of Stake for ZSC system
contract PosBase is PosStakerGroup, PosBlockPool {
    uint private constant YEAR_IN_SECONDS = 86400 * 365;
    uint private constant HALF_YEAR_IN_SECONDS = 86400 * 365 / 2;
    uint private constant QUATER_YEAR_IN_SECONDS = 86400 * 365 / 4;

    // Constructor
    constructor(bytes32 _name) public ManagerBase(_name) {
    } 

    function initManager(address _systemManager) public {
        checkDelegate(msg.sender, 1);

        super.initManager(_systemManager);
        
        createPool("year", YEAR_IN_SECONDS, 10);
        createPool("half year", YEAR_IN_SECONDS, 4);
        createPool("three months", YEAR_IN_SECONDS, 2);
    }

    function mineSingleBlock(address _block) private {
        uint stakerNos = numStakers();
        uint blockSize = PosBlock(_block).getCurrentSize();
        bool minedTag = false;
        while (true) {
            for (uint i = getNextStakerForUseSP(); i < stakerNos; ++i) {
                blockSize = blockSize - 1 + useStakerSPByIndex(i, 1);
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

    function minePendingBlocks(uint _poolIndex) public {
        checkDelegate(msg.sender, 1);

        uint blockNos = numTotalBlocks(_poolIndex);
        address blockAdr;

        for (uint i = getLastPendingBlockIndex(_poolIndex); i < blockNos - 1; ++i) {
            blockAdr = getBlockByIndex(_poolIndex, i);
            if (PosBlock(blockAdr).getCurrentSize() > getTotalRemainingSP()) {
                break;
            }

            mineSingleBlock(blockAdr);
        }
    }

    function numBlockInfo(uint _poolIndex, bool _isMined) public constant returns (uint) {
        checkDelegate(msg.sender, 1);

        if (_isMined) {
            return numMinedBlocks(_poolIndex);
        } else {
            return numTotalBlocks(_poolIndex);
        }
    }

    function getBlockInfoByIndex(uint _poolIndex, uint _blockIndex) public constant returns (uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        address blockAdr = getBlockByIndex(_poolIndex, _blockIndex);

        uint size = PosBlock(blockAdr).getCurrentSize();
        uint txNos = PosBlock(blockAdr).numTx();
        uint limit = PosBlock(blockAdr).getBlockLimit();

        return (limit, size, txNos);
    }
}
