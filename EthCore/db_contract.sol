/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBContract is Object {
    struct ParaInfo {
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
        paras_[paraNos_] = _para;
        paraNos_++;
    }

    /*
    function removeParameter(string _para) public {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_para]);
    }
    */
}
