/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmPos is Erc721Adv, SysGmBase {
    struct RobotUnit {
        bool buyable_;
        bool activated_;
        uint level_;
        uint stakePoint_;
        uint rewardRatio_;
        uint mineStart_;
        uint mineEnd_;
        uint auctionStart_;
        uint auctionEnd_;
        uint startPrice_;
        uint endPrice_;
    }

    uint internal robotNos_;
    mapping(uint => RobotUnit) internal robots_;
    
    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function checkRobotUser(address _user, uint _robotId) internal view {
        require(_user == robots_[_robotId].user_);
    }
    
    function getRobotPrice(uint _robotId) public view returns (uint) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        return robots_[_robotId].endPrice_;
    }

    function getRobotStatus(uint _robotId) public view returns (address, bool, bool) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        return (ownerOf(_robotId),
                robots_[_robotId].buyable_,
                robots_[_robotId].activated_);
    }
    
    function getRobotMiningInfo(uint _robotId) public view returns (uint, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        return (robots_[_robotId].level_,
                robots_[_robotId].mineStart_, 
                robots_[_robotId].mineEnd_, 
                robots_[_robotId].stakePoint_,
                robots_[_robotId].rewardRatio_);
    }

    function getRobotAuctionInfo(uint _robotId) public view returns (uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        return (robots_[_robotId].auctionStart_,
                robots_[_robotId].auctionEnd_, 
                robots_[_robotId].startPrice_,
                robots_[_robotId].endPrice_);
    }
}
