/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmPosEffect {
    function getExtraStakePoint(uint _robotId) public view returns (uint);
    function getExtraRewardRatio(uint _robotId) public view returns (uint);
    function getExtraUpgradeProbability(uint _robotId) public view returns (uint);
}

contract SysGmPos is Erc721Adv, SysGmBase {
    struct RobotUnit {
        bytes32 status_;
        bytes32 name_;
        uint spLev_;
        uint spBase_;
        uint rrLev_;
        uint rrBase_;
        uint mineStart_;
        uint mineEnd_;
    }

    uint private robotNos_;
    mapping(uint => RobotUnit) private robots_;

    function SysGmPosAdv(bytes32 _name) public SysGmPos(_name) {
        dayInSeconds_ = DAY_IN_SECONDS;
    }
    
    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function mintUnit() internal returns (uint) {
        uint index = robotNos_;
        robotNos_++;
        _mint(_user, index);
        setRobotStatus(index, "idle");
        return index;
    }

    function checkUnittUser(address _user, uint _unitId) internal view {
        require(_user == ownerOf(_unitId));
    }

    function setUnitStatus(uint _unitId, bytes32 _status) internal {
        robots_[_unitId].status_ = _status;
    }

    //////////////////////
    function numUnits() public view returns (uint) {
        return robotNos_;  
    }

    function getUnitStatus(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].status_;
    }

    function getUnitName(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].name_;
    }

    function getUnitName(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].name_;
    }

    function getUnitSPBase(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spBase_;
    }

    function getUnitSPLev(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spLev_;
    }

    function getUnitSPExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraStakePoint(_unitId);
    }

    function getUnitRRBase(uint _unitId) public view returns (uint) {
        return robots_[_unitId].rrBase_;
    }

    function getUnitRRLev(uint _unitId) public view returns (uint) {
        return robots_[_unitId].rrLev_;
    }

    function getUnitRRExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraRewardRatio(_unitId);
    }
}
