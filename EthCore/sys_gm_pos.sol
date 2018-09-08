/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

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

    function checkUnittUser(address _user, uint _robotId) internal view {
        require(_user == ownerOf(_robotId));
    }

    function setUnitStatus(uint _robotId, bytes32 _status) internal {
        robots_[_robotId].status_ = _status;
    }

    //////////////////////
    function numUnits() public view returns (uint) {
        return robotNos_;  
    }

    function getUnitStatus(uint _robotId) public view returns (bytes32) {
        return robots_[_robotId].status_;
    }

    function getUnitName(uint _robotId) public view returns (bytes32) {
        return robots_[_robotId].name_;
    }

    function getUnitName(uint _robotId) public view returns (bytes32) {
        return robots_[_robotId].name_;
    }

    function getUnitSPBase(uint _robotId) public view returns (uint) {
        return robots_[_robotId].spBase_;
    }

    function getUnitSPLev(uint _robotId) public view returns (uint) {
        return robots_[_robotId].spLev_;
    }

    function getUnitSPExtra(uint _robotId) public view returns (uint) {
        return 0;
    }

    function getUnitRRBase(uint _robotId) public view returns (uint) {
        return robots_[_robotId].rrBase_;
    }

    function getUnitRRLev(uint _robotId) public view returns (uint) {
        return robots_[_robotId].rrLev_;
    }

    function getUnitRRExtra(uint _robotId) public view returns (uint) {
        return 0;
    }
}
