/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosProofPower is Erc721Adv {
    struct VirtualPowerUnit {
        bool available_;
        uint maxRewards_;
        uint curRewards_;
        uint usedRewards_;
        uint price_;
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
    
    function createVPUs(uint _number, uint _maxReward, uint _price) public {
        checkDelegate(msg.sender, 1);
        require(_number != 0 && _maxReward != 0 && _price != 0);

        uint firstId = totoalSupply();
        uint lastId = firstId + _number;
        for (uint i = firstId; i <= lastId; ++i) {
            _mint(address(this), i);
            vpus_[i] = VirtualPowerUnit(true, _maxReward, 0, 0, _price);
            vpuNos_++;
        }
    }
    
    function getVPUInfo(uint _vpuId) public view returns (bool, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_vpuId < vpuNos_);
        return (vpus_[_vpuId].available_,
                vpus_[_vpuId].maxRewards_, 
                vpus_[_vpuId].curRewards_, 
                vpus_[_vpuId].usedRewards_, 
                vpus_[_vpuId].price_);
    }
    
    function purchaseVPU(address _buyerAdr, uint _vpuId) public {
        checkDelegate(msg.sender, 1);
        _transfer(address(this), _buyerAdr, _vpuId);
    }

    function rewardToVPU(uint _vpuId, uint _rewards) public returns (uint) {
        checkDelegate(msg.sender, 1);
        
        if (vpus_[_vpuId].available_ == false) {
            return _rewards;
        }

        uint sum = vpus_[_vpuId].curRewards_.add(_rewards);

        if (sum < vpus_[_vpuId].maxRewards_) {
            vpus_[_vpuId].curRewards_ = sum;
            return 0;
        } else {
            vpus_[_vpuId].curRewards_ = vpus_[_vpuId].maxRewards_;
            vpus_[_vpuId].available_ = false;
            return vpus_[_vpuId].maxRewards_.sub(sum);
        }
    }
}

