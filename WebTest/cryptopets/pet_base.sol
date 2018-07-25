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

    PetInfo[] pets_;
    mapping (uint256 => address) indexToOwner_;
    mapping (address => uint256) ownerToCount_;
    mapping (uint256 => address) indexToApproved_;
    mapping (uint256 => address) indexToSireApproved_;

    function PetBase() public PetControl() {}
}