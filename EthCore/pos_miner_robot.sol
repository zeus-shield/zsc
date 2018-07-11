/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./erc721_adv.sol";

contract PosMinerRobot is Erc721Adv {
   struct RobotUnit {
        address user_;
        bool buyable_;
        bool activated_;
        uint level_;
        uint price_;
        uint start_;
        uint end_;
        uint curStakerPoint_;
        uint maxStakerPoint_;
        uint rewardRatio_;
    }

    address private posGm_;
    uint internal robotNos_;
    mapping(uint => RobotUnit) internal robots_;

    function PosMinerRobot() public Erc721Adv {
        robotNos_ = 0;
    }

    function checkRobotUser(address _user, uint _robotId) internal view {
        require(_user == robots_[_robotId].user_);
    }

    function initPosVirtualRobot(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }

    function getRobotStatus(uint _robotId) public view returns (address, bool, bool) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        return (robots_[_robotId].user_,
                robots_[_robotId].buyable_,
                robots_[_robotId].activated_);
    }
    
    function getRobotInfo(uint _robotId) public view returns (uint, uint, uint, uint, uint, uint, uint) {
        checkDelegate(msg.sender, 1);
        require(_robotId < robotNos_);
        return (robots_[_robotId].level_,
                robots_[_robotId].price_,
                robots_[_robotId].start_, 
                robots_[_robotId].end_, 
                robots_[_robotId].curStakerPoint_, 
                robots_[_robotId].maxStakerPoint_,
                robots_[_robotId].rewardRatio_);
    }
}
