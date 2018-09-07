/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";
import "./erc721_adv.sol";

contract SysGmPos is Erc721Adv, SysGmBase {
    struct RobotCtg {
        bytes32 ctgName_; 
        mapping(bytes32 => uint) paras_;
    }
    uint private ctgNos_;
    mapping(uint => RobotUnit) private ctgs_;
    mapping(bytes32 => uint) private ctgIndice_;
    mapping(bytes32 => bool) private ctgExists_;
    /////////////////////

    struct RobotUnit {
        bytes32 status_;
        bytes32 ctgName_;
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

    function getRobotName(uint _robotId) internal view returns (bytes32) {
        return robots_[_robotId].ctgName_;
    }
    
    /////////////////////
    function numParameters() public view returns (uint) {
        return paraNos_;
    }

    function addParameter(bytes32 _para) public {
        checkDelegate(msg.sender, 5);
        require(!paraExists_[_para]);

        paraExists_[_para] = true;
        paraIndice_[_para] = paraNos_;
        paraNames_[paraNos_] = _para;
        paraNos_++;
    }

    function removeParameter(bytes32 _para) public {
        checkDelegate(msg.sender, 5);
        require(paraExists_[_para]);

        uint index = paraIndice_[_para];
        paraNames_[index] = paraNames_[paraNos_ - 1];
        paraIndice_[paraNames_[index]] = index;


        delete paraIndice_[_para];
        delete paraNames_[paraNos_ - 1];
        paraExists_[_para] = false;

        paraNos_--;
    }

    function getParameterNameByIndex(uint _index) public view returns (bytes32) {
        require(_index < paraNos_);
        return paraNames_[_index];
    }

    /////////////////////
    function numCategories() public view returns (uint) {
        return ctgNos_;
    }

    function addCategory(bytes32 _ctg) public {
        checkDelegate(msg.sender, 5);
        require(!ctgExists_[_ctg]);

        ctgExists_[_ctg] = true;
        ctgIndice_[_ctg] = ctgNos_;
        ctgs_[ctgNos_].ctgName_ = _ctg;
        ctgNos_++;
    }

    function getCategoryNameByIndex(uint _index) public view returns (bytes32) {
        require(_index < ctgNos_);
        return ctgs_[_index].ctgName_;
    }

    /////////////////////
    function getCategoryParameterValue(bytes32 _ctg, bytes32 _para) public returns (uint) {
        require(ctgExists_[_ctg]);

        uint ctgIndex = ctgIndice_[_ctg];
        return ctgs_[ctgIndex].paras_[_para];
    }

    function setCategoryParameterValue(bytes32 _ctg, bytes32 _para, uint _value) internal {
        require(ctgExists_[_ctg]);

        uint ctgIndex = ctgIndice_[_ctg];
        ctgs_[ctgIndex].paras_[_para] = _value;
    }

    function getRobotParameterValue(uint _robotId, bytes32 _para, uint _value) public returns (uint) {
        require(_robotId < robotNos_);
        require(paraExists_[_para]);

        return robots_[_robotId].paras_[_para] = _value;
    }

    function setRobotParameterValue(uint _robotId, bytes32 _para, uint _value) internal {
        require(_robotId < robotNos_);
        require(paraExists_[_para]);

        robots_[_robotId].paras_[_para] = _value;
    }
}
