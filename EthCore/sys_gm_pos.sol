/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmPos is Erc721Adv, SysGmBase {
    struct RobotCtg {
        bytes32 type_; 
        uint prob_; // (0, 10000)
        mapping(bytes32 => uint) paras_;
    }
    uint private ctgNos_;
    mapping(uint => RobotUnit) private ctgNos_;
    /////////////////////

    struct RobotUnit {
        bytes32 status_;
        bytes32 name_;
        mapping(bytes32 => uint) paras_;
    }
    uint private robotNos_;
    mapping(uint => RobotUnit) private robots_;
    /////////////////////

    uint public paraNos_;
    mapping(uint => bytes32) public paraNames_;
    mapping(bytes32 => uint) private paraIndice_;
    mapping(bytes32 => bool) private paraExists_;

    // Constructor
    function SysGmPos(bytes32 _name) public SysGmBase(_name) {
    } 

    function numRobots() public view returns (uint) {
        return robotNos_;  
    }

    /////////////////////
    function checkRobotUser(address _user, uint _robotId) internal view {
        require(_user == ownerOf(_robotId));
    }

    /////////////////////
    function setRobotStatus(uint _robotId, bytes32 _status) internal {
        robots_[_robotId].status_ = _status;
    }

    function getRobotStatus(uint _robotId) internal view returns (bytes32) {
        return robots_[_robotId].status_;
    }

    function setRobotName(uint _robotId, bytes32 _name) internal {
        robots_[_robotId].name_ = _name;
    }

    function getRobotName(uint _robotId) internal view returns (bytes32) {
        return robots_[_robotId].name_;
    }
    /////////////////////


    function numRobotParameter() public view returns (uint) {
        return paraNos_;
    }

    function addRobotParameter(bytes32 _para) public {
        require(!paraExists_[_para]);
        paraExists_[_para] = true;
        paraIndice_[_para] = paraNos_;
        paraNames_[paraNos_] = _para;
        paraNos_++;
    }

    function removeRobotParameter(bytes32 _para) public {
        require(paraExists_[_para]);

        uint index = paraIndice_[_para];
        paraNames_[index] = paraNames_[paraNos_ - 1];
        paraIndice_[paraNames_[index]] = index;


        delete paraIndice_[_para];
        delete paraNames_[paraNos_ - 1];
        paraExists_[_para] = false;

        paraNos_--;
    }
    /////////////////////

    function addRobotCtg(bytes32 _para) public {
        require(!paraExists_[_para]);
        paraExists_[_para] = true;
        paraIndice_[_para] = paraNos_;
        paraNames_[paraNos_] = _para;
        paraNos_++;
    }


    function getRobotParameterNameByIndex(uint _index) public view returns (bytes32) {
        require(_index < paraNos_);
        return paraNames_[_index];
    }

    function getRobotParameterValue(uint _robotId, bytes32 _para) public view returns (uint) {
        require(_robotId < robotNos_);
        require(paraExists_[_para]);

        uint paraIndex = paraIndice_[_para];
        return robots_[_robotId].paras_[paraNames_[paraIndex]];
    }

    function setRobotParameterValue(uint _robotId, bytes32 _para, uint _value) internal {
        require(_robotId < robotNos_);
        require(paraExists_[_para]);

        uint paraIndex = paraIndice_[_para];
        robots_[_robotId].paras_[paraNames_[paraIndex]] = _value;
    }
    ////////////////////

    /*
    function getRobotInfo(uint _robotId) public view returns (bytes32, uint, uint, uint, uint, uint, uint) {
        require(_robotId < robotNos_);
        
        return (robots_[_robotId].status_,
                robots_[_robotId].level_,
                robots_[_robotId].mineStart_, 
                robots_[_robotId].mineEnd_, 
                robots_[_robotId].stakePoint_,
                robots_[_robotId].rewardRatio_,
                robots_[_robotId].price_);
    }
    */
}
