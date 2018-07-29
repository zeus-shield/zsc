/*
 Copyright (c) 2018, ZSC Dev Team
*/

import "./pet_control.sol";

pragma solidity ^0.4.21;

contract PetBase is PetControl {

    struct PetInfo {
        uint256 genes_;
        uint64 birthTime_;
        uint64 cooldownEndBlock_;
        uint32 matronId_;
        uint32 sireId_;
        uint32 siringWithId_;
        uint16 cooldownIndex_;
        uint16 generation_;
    }

   uint32[14] public cooldowns_ = [
        uint32(1 minutes),
        uint32(2 minutes),
        uint32(5 minutes),
        uint32(10 minutes),
        uint32(30 minutes),
        uint32(1 hours),
        uint32(2 hours),
        uint32(4 hours),
        uint32(8 hours),
        uint32(16 hours),
        uint32(1 days),
        uint32(2 days),
        uint32(4 days),
        uint32(7 days)
    ];


    uint256 secondsPerBlock_ = 15;

    PetInfo[] pets_;
    mapping (uint256 => address) indexToOwner_;
    mapping (address => uint256) ownerToCount_;
    mapping (uint256 => address) indexToApproved_;
    mapping (uint256 => address) indexToSireApproved_;

    SaleClockAuction saleAuction;

    SiringClockAuction siringAuction;

    event Birth(address _owner, uint256 _petId, uint256 _matronId, uint256 _sireId, uint256 _genes);
    event Transfer(address _from, address _to, uint256 _tokenId);

    function PetBase() public PetControl() {}

    function _transfer(address _from, address _to, uint256 _tokenId) internal {

        ownerToCount_[_to]++;

        indexToOwner_[_tokenId] = _to;

        if (address(0) != _from) {
            ownerToCount_[_from]--;
            delete indexToSireApproved_[_tokenId];
            delete indexToApproved_[_tokenId];
        }

        Transfer(_from, _to, _tokenId);
    }

    function _createPet(
        uint256 _matronId, uint256 _sireId,
        uint256 _generation, uint256 _genes, 
        address _owner) internal returns (uint) {

    }

    function setSecondsPerBlock(uint256 _secs) external onlyCLevel {
        require(_secs < cooldowns_[0]);
        secondsPerBlock_ = _secs;
    }
}