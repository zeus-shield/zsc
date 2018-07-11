/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosProofPower is Erc721Adv {
   struct VirtualPowerUnit {
        address user_;
        bool buyable_;
        bool activated_;
        uint level_;
        uint price_;
        uint start_;
        uint end_;
        uint curStakerPoint_;
        uint maxStakerPoint_;
        uint rewardRatio_;
    }

    address private posGm_;
    uint private vpuNos_;
    uint private totalPower_;
    mapping(uint => VirtualPowerUnit) internal vpus_;

    function PosProofPower() public Erc721Adv {
        totalPower_ = 0;
        vpuNos_ = 0;
    }

    function checkVpuUser(address _user, uint _vpuId) internal view {
        require(_user == vpus_[_vpuId]._user);
    }

    function initPosProofPower(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }


    function getVpuInfo(uint _vpuId) public view returns (address, bool, bool, uint, uint, uint, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_vpuId < vpuNos_);
        return (vpus_[_vpuId].user_,
                vpus_[_vpuId].buyable_,
                vpus_[_vpuId].activated_,
                vpus_[_vpuId].level_,
                vpus_[_vpuId].price_,
                vpus_[_vpuId].start_, 
                vpus_[_vpuId].end_, 
                vpus_[_vpuId].curStakerPoint_, 
                vpus_[_vpuId].maxStakerPoint_,
                vpus_[_vpuId].rewardRatio_);
    }
    function setRewardRatio(uint _level, uint _ratio, uint _maxStakePoint) public;
    function createVpu(address _user, uint _level, uint _price) public returns (uint);
    function destroyVpu(address _owner, uint _vpuId) public;
    function setRewardRatio(uint _level, uint _ratio, uint _maxStakePoint) public;
    function publishVpu(address _user, uint _vpuId, uint _price) public;
    function activeVpu(address _user, uint _vpuId, uint _stakePoint, uint _durationInDays) public;
    function claimable(address _staker, uint _vpuId) public view returns (bool);
    function claimRwardFromVpu(address _staker, uint _vpuId) public returns (uint);
}
