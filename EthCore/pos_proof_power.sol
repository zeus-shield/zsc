/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosProofPower is Erc721Adv {
    struct VirtualPowerUnit {
        uint rewardRatio_;
        uint power_;
        uint priceMin_;
        uint priceCur_;
    }
    address private posGm_;
    uint private vpuNos_;
    uint private totalPower_;
    mapping(uint => VirtualPowerUnit) private vpus_;

    address private previousBlock_ = address(0);
    address private nextBlock_ = address(0);
    uint private blockSizeLimit_ = 0;

    function PosProofPower() public {
        totalPower_ = 0;
        vpuNos_ = 0;
    }

    function initPosProofPower(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }
    
    function createVPUs(uint[] _ratio, uint[] _power, uint[] _priceMin) public {
        checkDelegate(msg.sender, 1);
        require(_ratio.length != 0);
        require(_ratio.length == _power.length);

        uint firstId = totoalSupply();
        uint lastId = firstId + _ratio.length;
        for (uint i = firstId; i <= lastId; ++i) {
            _mint(address(this), i);
            vpus_[i] = VirtualPowerUnit(_ratio[i], _power[i], _priceMin[i], _priceMin[i]);
            vpuNos_++;
        }
    }

    function createVPUs(uint _number, uint _ratio, uint _power, uint _priceMin) public {
        checkDelegate(msg.sender, 1);
        require(_number != 0 && _ratio != 0 && _power != 0 && _priceMin != 0);

        uint firstId = totoalSupply();
        uint lastId = firstId + _number;
        for (uint i = firstId; i <= lastId; ++i) {
            _mint(address(this), i);
            vpus_[i] = VirtualPowerUnit(_ratio, _power, _priceMin, _priceMin);
            vpuNos_++;
        }
    }
    
    function getVPUInfo(uint _vpuId) public view returns (uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_vpuId < vpuNos_);
        return (vpus_[_vpuId].rewardRatio_, 
                vpus_[_vpuId].power_, 
                vpus_[_vpuId].priceMin_, 
                vpus_[_vpuId].priceCur_);
    }
    
    function purchaseVPU(address _buyerAdr, uint _vpuId) public {
        checkDelegate(msg.sender, 1);
        _transfer(address(this), _buyerAdr, _vpuId);
    }
}

