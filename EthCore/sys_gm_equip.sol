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

}
