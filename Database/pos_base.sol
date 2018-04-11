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

    function mineSingleBlock(uint _poolIndex, uint _blockIndex) private {
        uint stakerNos = numStakers();
        uint blockSize = getBlockByIndex(_poolIndex, _blockIndex);
        bool minedTag = false;
        while (true) {
            for (uint i = getNextStakerForUseSP(); i < stakerNos; ++j) {
                blockSize = blockSize - 1 + useStakerSPByIndex(i, 1);
                if (blockSize == 0) {
                    setNextStakerForUseSP(i);
                    setBlockMinedByIndex(_poolIndex, _blockIndex);
                    minedTag = true;
                }
            }
            if (minedTag) {
                break;
            }
        }
    }

    function minePendingBlocks(uint _poolIndex) public constant only_delegate(1) {
        uint blockNos = numBlocks(_poolIndex);

        for (uint i = getLastPendingBlockIndex(); i < blockNos - 1; ++i) {
            if (getBlockByIndex(_poolIndex, i) > getTotalRemainingSP()) {
                break;
            }

            mineSingleBlock(_poolIndex, i);
        }
    }

}
