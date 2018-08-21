/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmEquip is Erc721Adv, SysGmBase {
    struct EquipUnit {
        bytes32 status_;
        uint level_;
        uint price_;
        uint spEffect_;
        uint rewardEffect_;
    }

    uint internal equipNos_;
    mapping(uint => RobotUnit) internal equips_;
    
    // Constructor
    function SysGmEquip(bytes32 _name) public SysGmBase(_name) {
    } 

    function checkEquipUser(address _user, uint _equipId) internal view {
        require(_user == ownerOf(_equipId));
    }

    function setEquipStatus(uint _equipId, bytes32 _status) internal {
        robots_[_equipId].status_ = _status;
    }

    function getEquipStatus(uint _equipId) internal view returns (bytes32) {
        return robots_[_equipId].status_;
    }

    function numEquips() public view returns (uint) {
        return robotNos_;  
    }

    function getEquipInfo(uint _equipId) public view returns (bytes32, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_equipId < equipNos_);
        
        return (robots_[_equipId].status_,
                robots_[_equipId].level_,
                robots_[_equipId].price_,
                robots_[_equipId].spEffect_,
                robots_[_equipId].rewardEffect_);
    }
}
