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
        uint rare_;
        uint spLev_;
        uint spBase_;
        uint rrLev_;
        uint rrBase_;
        uint mineStart_;
        uint mineEnd_;
    }
    uint private robotNos_;
    mapping(uint => RobotUnit) private robots_;

    struct CtgUnit {
        bytes32 name_;
        uint rare_;
        uint spBase_;
        uint rrBase_;
    }
    uint private ctgNos_;
    mapping(uint => RobotUnit) private ctgs_;
    mapping(bytes32 => bool) private ctgExits_;
    mapping(bytes32 => uint) private ctgIndice_;

    address public extraEffectObj_;

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

    function checkUnitUser(address _user, uint _unitId) internal view {
        require(_user == ownerOf(_unitId));
    }

    function setUnitName(uint _unitId, bytes32 _name) internal {
        robots_[_unitId].name_ = _name;
    }
    
    function setUnitStatus(uint _unitId, bytes32 _status) internal {
        robots_[_unitId].status_ = _status;
    }

    function setUnitRare(uint _unitId, bytes32 _rare) internal {
        robots_[_unitId].rare_ = _rare;
    }

    function setUnitSPLev(uint _unitId, uint _lev) internal {
        robots_[_unitId].spLev_ = _lev;
    }

    function setUnitRRLev(uint _unitId, uint _lev) internal {
        robots_[_unitId].rrLev_ = _lev;
    }

    //////////////////////
    function setExtraEffectObj(address _adr) public {
        checkDelegate(msg.sender, 1);
        extraEffectObj_ = _adr;
    }

    function numUnits() public view returns (uint) {
        return robotNos_;  
    }

    function getUnitName(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].name_;
    }

    function getUnitStatus(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].status_;
    }

    function getUnitRare(uint _unitId) public view returns (bytes32) {
        return robots_[_unitId].rare_;
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
