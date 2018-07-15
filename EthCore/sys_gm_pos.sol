/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmPos is Erc721Adv, SysGmBase {
    struct RobotUnit {
        uint level_;
        uint stakePoint_;
        uint rewardRatio_;
        uint mineStart_;
        uint mineEnd_;
        uint price_;
    }

    uint internal robotNos_;
    mapping(uint => RobotUnit) internal robots_;
    
    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function checkRobotUser(address _user, uint _robotId) internal view {
        require(_user == ownerOf(_robotId));
    }

    function isActivated(uint _robotId) internal view returns (bool) {
        return (robots_[_robotId].mineStart_ != 0);
    }

    function isBuyable(uint _robotId) internal view returns (bool) {
        return (robots_[_robotId].price_ != 0);
    }

    function getRobotInfo(uint _robotId) public view returns (uint, uint, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        
        return (robots_[_robotId].level_,
                robots_[_robotId].mineStart_, 
                robots_[_robotId].mineEnd_, 
                robots_[_robotId].stakePoint_,
                robots_[_robotId].rewardRatio_,
                robots_[_robotId].price_);
    }
}
