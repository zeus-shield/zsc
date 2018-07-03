/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosProofPower is Erc721Adv {
    struct ProofPowerInfo {
        uint rewardRatio_;
        uint power_;
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


    function createVPUs(uint _number, uint _ratio, uint _power) public {
        checkDelegate(msg.sender, 1);
        require(_number != 0);
        
        uint firstId = getLastTokenId() + 1;
        uint lastId = firstId + _number;
        for (uint i = firstId; i < lastId; ++i) {
            _mint(address(this), i);
            ppInfos_[i] = ProofPowerInfo(_ratio, _power);
        }
    }

    function purchaseVPU(address _buyerAdr, uint _vpuId) public {
        checkDelegate(msg.sender, 1);
        transfer(address(this), _buyerAdr, _vpuId);
    }
}

