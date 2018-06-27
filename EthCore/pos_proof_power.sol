/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract PosProofPower is Delegated {
    struct ProofPowerInfo {
        address sender_;
        uint time_;
    }
    
    uint private ppNos_;
    uint private totalPower_;
    mapping(uint => ProofPowerInfo) private ppInfos_;

    address private previousBlock_ = address(0);
    address private nextBlock_ = address(0);
    uint private blockSizeLimit_ = 0;

    function PosProofPower() public Delegated() {
        totalPower_ = 0;
        ppNos_ = 0;
    }

    function getTotalPower() public view returns (uint) {
        checkDelegate(msg.sender, 1);
        return totalPower_;
    }
}

