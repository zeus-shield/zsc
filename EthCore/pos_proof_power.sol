/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosProofPower is Erc721Adv {
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

    function PosProofPower(bytes32 _name) public Object(_name) {
        totalPower_ = 0;
        ppNos_ = 0;
    }

    function createVirtulPowerUnits(uint256 _number) public {
        checkDelegate(msg.sender, 1);
        require(_number != 0);

        uint lastTokenId = getLastTokenId();
        for (uint256 i = lastTokenId + 1; i < lastTokenId + _number; ++i) {
            _mint(address(this), i);
        }

    }
}

