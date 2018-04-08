/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./pos_block_pool.sol";
import "./pob_staker_group.sol";

//Proof of Stake for ZSC system
contract PosBase is Object {
    struct MiningInfo {
        uint lastMinedBlock_;
    }
    MiningInfo private miningInfo_;

    // Constructor
    function PosBase(bytes32 _name) public Object(_name) {
        
    } 

    function minePendingBlocks() public constant only_delegate {
        uint lastPendingBlockIndex = getLastPendingBlockIndex();
        uint unminedGas = getUnminedGas();

        if (lastPendingBlockIndex == 0 || unminedGas == 0) return;

        uint blockNos = numBlock();
        uint stakerNos = numStakers();
        for (uint i = lastPendingBlockIndex; i < blockNos; ++i) {
            if (getBlockSizeByIndex(_index) > getTotalRemainingSP()) {
                break;
            }

            for (uint j = 0; j < stakerNos; ++j) {
                useStakerSPByIndex(j, 1);
            }
            setBlockMinedByIndex(i);
        }
    }

}
