/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosProofPower is Erc721Adv {
   struct VirtualPowerUnit {
        address _user;
        bool buyable_;
        bool activated_;
        uint level_;
        uint price_;
        uint start_;
        uint end_;
        uint curStakerPoint_;
        uint maxStakerPoint_;
        uint rewards_;
    }

    struct VpuLevelInfo {
        uint rewardRatio_;
        uint maxStakerPoint_;
    }

    struct ClaimInfo {
        uint vpuID_;
        uint amount_;
        uint time_;
    }
    mapping(address => uint) private claimNos_;
    mapping(address => mapping(uint => ClaimInfo)) private userClaims_;

    address private posGm_;
    uint private vpuNos_;
    uint private totalPower_;
    mapping(uint => VirtualPowerUnit) private vpus_;

    uint private blockSizeLimit_ = 0;

    mapping(uint => VpuLevelInfo) private vpuLevelInfo_;

    function PosProofPower() public {
        totalPower_ = 0;
        vpuNos_ = 0;
    }

    function checkVpuUser(address _user, uint _vpuId) internal view {
        require(_user == vpuLevelInfo_[_level]._user);
    }

    function initPosProofPower(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }

    function setRewardRatio(uint _level, uint _ratio, uint _maxStakePoint) public {
        checkDelegate(msg.sender, 1);
        vpuLevelInfo_[_level].rewardRatio_ = _ratio;
        vpuLevelInfo_[_level].maxStakerPoint_ = _maxStakePoint;
    }

    function getVPUInfo(uint _vpuId) public view returns (bool, uint, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_vpuId < vpuNos_);
        return (vpus_[_vpuId].available_,
                vpus_[_vpuId].price_,
                vpus_[_vpuId].maxRewards_, 
                vpus_[_vpuId].totalRewards_, 
                vpus_[_vpuId].curRewards_, 
                vpus_[_vpuId].claimedRewards_);
    }

    function createVpu(address _user, uint _level) public returns (uint) {
        checkDelegate(msg.sender, 1);

        uint tokenId = lastTokenId() + 1;
        _mint(_owner, tokenId);

        vpus_[tokenId] = VirtualPowerUnit(_user, false, false, 1, 0, 0, 0, 0, 0, 0);
        vpuNos_++;
        return tokenId;
    }

    function destroyVpu(address _owner, uint _vpuId) public {
        checkDelegate(msg.sender, 1);
        require(_vpuId < vpuNos_ && vpus_[tokenId].available_);       

        vpus_[tokenId].available_ = false;
        _burn(_owner, _vpuId);
    }
        
    function activeVpu(address _user, uint _vpuId, uint _stakePoint, uint _durationInDays) public {
        checkDelegate(msg.sender, 1);
        checkVpuUser(_user, _vpuId);

        require(!vpus_[_vpuId].activated_);
        require(!vpus_[_vpuId].buyable_);
        require(_stakePoint <= vpuLevelInfo_[_level].maxStakerPoint_);

        uint cur = now;
        uint duraInSecs = _durationInDays.mul(1 day);

        vpus_[_vpuId].start = cur;
        vpus_[_vpuId].end = cur.add(duraInSecs);
    }

    function publishVpu(address _user, uint _vpuId, uint _price) public {
        checkDelegate(msg.sender, 1);
        checkVpuUser(_user, _vpuId);

        require(!vpus_[_vpuId].activated_);
        require(!vpus_[_vpuId].buyable_);

        vpus_[_vpuId].buyable_ = true;
        vpus_[_vpuId].price_ = _price;
    }
}
