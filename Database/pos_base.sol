/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./pos_block_pool.sol";
import "./pob_staker_group.sol";

//Proof of Stake for ZSC system
contract PosBase is PosStakerGroup, PosBlockPool {
    uint private constant YEAR_IN_SECONDS = 86400 * 365;
    uint private constant HALF_YEAR_IN_SECONDS = 86400 * 365 / 2;
    uint private constant QUATER_YEAR_IN_SECONDS = 86400 * 365 / 4;

    // Constructor
    function PosBase(bytes32 _name) public Object(_name) {
    } 

    function initPos(address _controller) public only_delegate(1) () {
        setDelegate(_controller, 1);
        createPool("year", YEAR_IN_SECONDS, 10);
        createPool("half year", YEAR_IN_SECONDS, 4);
        createPool("three months", YEAR_IN_SECONDS, 2);
    }

    function minePendingBlocks(uint _poolIndex) public constant only_delegate(1) {
        uint lastPendingBlockIndex = getLastPendingBlockIndex();
        uint blockNos = numBlocks(_poolIndex);
        uint stakerNos = numStakers();
        uint blockSize;
        uint remainingSP;
        bool minedTag;

        for (uint i = lastPendingBlockIndex; i < blockNos - 1; ++i) {
            remainingSP = getTotalRemainingSP();
            blockSize = getBlockByIndex(_poolIndex, i);
            if (blockSize > remainingSP) {
                break;
            }

            minedTag = false;
            while (true) {
                for (uint j = getNextStakerForUseSP(); j < stakerNos; ++j) {
                    blockSize = blockSize - 1 + useStakerSPByIndex(j, 1);
                    if (blockSize == 0) {
                        setNextStakerForUseSP(i);
                        setBlockMinedByIndex(_poolIndex, i);
                        minedTag = true;
                    }
                }
                if (minedTag) {
                    break;
                }
            }
        }
    }

}
