/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_include.sol";
import "./sys_gm_base.sol";

contract PosProofPower {
    function createVPUs(uint[] _ratio, uint[] _power, uint[] _priceMin) public;
    function createVPUs(uint _number, uint _ratio, uint _power, uint _priceMin) public;
    function getVPUInfo(uint _vpuId) public view returns (uint, uint, uint, uint);
    function purchaseVPU(address _buyerAdr, uint _vpuId) public;
}

contract SysGmPos is SysGmBase {
    address proofPower_;

    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function configurePos(address _proofPower) public {
        checkDelegate(msg.sender, 1);
        require(_proofPower != address(0));

        if (proofPower_ == address(0)) {
            proofPower_  = _proofPower;
        } else {
            if (proofPower_ != _proofPower) {
                Object(proofPower_).setDelegate(address(this), 0);
                proofPower_  = _proofPower;
            }
        }
    }
}
