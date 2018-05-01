/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./pos_block_pool.sol";
import "./pos_staker_group.sol";

//Proof of Stake for ZSC system
contract PosBase is PosStakerGroup, PosBlockPool {
    uint private constant YEAR_IN_SECONDS = 86400 * 365;
    uint private constant HALF_YEAR_IN_SECONDS = 86400 * 365 / 2;
    uint private constant QUATER_YEAR_IN_SECONDS = 86400 * 365 / 4;

    // Constructor
    constructor(bytes32 _name) public Object(_name) {
    } 

    function initPos(address _controller) public {
        checkDelegate(msg.sender, 1);

        setDelegate(_controller, 1);
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
        address block;

        for (uint i = getLastPendingBlockIndex(_poolIndex); i < blockNos - 1; ++i) {
            block = getBlockByIndex(_poolIndex, i);
            if (PosBlock(block).getCurrentSize() > getTotalRemainingSP()) {
                break;
            }

            mineSingleBlock(block);
        }
    }

    function getPosBlockNos(uint _poolIndex) public returns (string) {
        checkDelegate(msg.sender, 1);

        uint totalBlockNos = numTotalBlocks(_poolIndex);
        uint minedBlockNos = numMinedBlocks(_poolIndex);

        string memory str ="";
        str = PlatString.append(str, "info?totalBlockNos=", PlatString.uintToString(totalBlockNos), "&");
        str = PlatString.append(str, "info?minedBlockNos=", PlatString.uintToString(totalBlockNos.sub(minedBlockNos)), "&");

        return str;
    }

    function getPosBlockInfoByIndex(uint _poolIndex, uint _blockIndex) public returns (string) {
        checkDelegate(msg.sender, 1);
        address block = getBlockByIndex(_poolIndex, _blockIndex);

        uint size = PosBlock(block).getCurrentSize();
        uint txNos = PosBlock(block).numTx();
        uint limit = PosBlock(block).getBlockLimit();

        string memory str ="";
        str = PlatString.append(str, "info?limit=", PlatString.uintToString(limit), "&");
        str = PlatString.append(str, "info?size=", PlatString.uintToString(size), "&");
        str = PlatString.append(str, "info?txNos=", PlatString.uintToString(txNos), "&");

        return str;
    }
}
