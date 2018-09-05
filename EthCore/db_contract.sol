/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBContract is Object {
    struct ParaInfo {
        string paraName_;
        mapping(uint => string) private values_;
    }

    uint private paraNos_;
    mapping(string => uint) private paraIndice_;
    mapping(string => bool) private paraExists_;
    mapping(uint => string) private paras_;

    // Constructor
    function DBContract(string _name) public Object(_name) {
        paraNos_ = 0;
    }

    function initParameters() internal;

    function initEntity() public {
        checkDelegate(msg.sender, 1);
        initParameters();
    }
    
    function addParameter(string _para) public {
        require(!paraExists_[_para]);
        paraExists_[_para] = true;
        paraIndice_[_para] = paraNos_;
        paras_[paraNos_].paraName_ = _para;
        paraNos_++;
    }

    /*
    function removeParameter(string _para) public {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_para]);
    }
    */

    function setParameter(uint _userIndex, string _para, string _value) internal {
        require(paraExists_[_para]);
        paras_[paraIndice_[_para]].values_[_userIndex] = _value;
    }

    function getParameter(uint _userIndex, string _para) internal view returns (string) {
        require(paraExists_[_para]);
        return paras_[paraIndice_[_para]].values_[_userIndex];
    }
    
    function numParameters() public view returns (uint) {
        return paraNos_;
    }

    function getParameterNameByIndex(uint _index) public view returns (string) {
        require(_index < paraNos_);
        return paras_[_index].paraName_;
    }
}
