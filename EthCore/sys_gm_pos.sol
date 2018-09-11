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
        uint spEft_;
        uint spCur_;
        uint spMax_;
        uint mineStart_;
        uint mineEnd_;
    }
    uint private robotNos_;
    mapping(uint => RobotUnit) private robots_;

    struct CtgUnit {
        bytes32 name_;
        uint rare_;
        uint spEftMin_;
        uint spEftMax_;
    }
    uint private ctgNos_;
    mapping(uint => RobotUnit) private ctgs_;
    mapping(bytes32 => bool) private ctgExits_;
    mapping(bytes32 => uint) private ctgIndice_;

    struct RareGroup {
        uint size_;
        mapping(uint => bytes32) private ctgs_;
    }
    mapping(uint => RareGroup) private rares_;
    mapping(uint => uint) private rareProb_;

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

        return index;
    }

    function checkUnitUser(address _user, uint _unitId) internal view {
        require(_user == ownerOf(_unitId));
    }

    function setUnitStatus(uint _unitId, bytes32 _status) internal {
        robots_[_unitId].status_ = _status;
    }

    function setUnitSPLev(uint _unitId, uint _lev) internal {
        robots_[_unitId].spLev_ = _lev;
    }

    function setUnitSPMax(uint _unitId, uint _max) internal {
        robots_[_unitId].spMax_ = _max;
    }

    function setUnitSPCur(uint _unitId, uint _cur) internal {
        robots_[_unitId].spCur_ = _cur;
    }

    function setUnitMineStart(uint _unitId, uint _tm) internal {
        robots_[_unitId].mineStart_ = _tm;
    }

    function setUnitMineEnd(uint _unitId, uint _tm) internal {
        robots_[_unitId].mineEnd_ = _tm;
    }

    function getRandomUnitCategory() private returns (bytes32) {
        uint ran = random(0, 100);
        uint rareLev;
        uint category;
        if (ran <= rareProb_[0]) {
            rareLev = 0;
        } else if (ran >rareProb_[0] && ran <= rareProb_[1]) {
            rareLev = 1;
        } else if (ran >rareProb_[1] && ran <= rareProb_[2]) {
            rareLev = 2;
        } else {
            rareLev = 3;
        }

        ran = random(0, rares_[rareLev].size_);
        return rares_.ctgs_[ran];
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

    function getUnitSPEft(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spBase_;
    }

    function getUnitSPCur(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spCur_;
    }

    function getUnitSPMax(uint _unitId) public view returns (uint) {
        return robots_[_unitId].spMax_;
    }

    function getUnitSPExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraStakePoint(_unitId);
    }

    function getUnitRRExtra(uint _unitId) public view returns (uint) {
        return SysGmPosEffect(extraEffectObj_).getExtraRewardRatio(_unitId);
    }
}
