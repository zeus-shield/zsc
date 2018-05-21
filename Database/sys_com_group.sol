/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_base.sol";

contract SysComGroup is SysComBase {
    uint private adrNos_;

    mapping(uint => bytes32) private names_;
    mapping(uint => address) private adrs_;

    mapping(bytes32 => uint) private indice_;
    mapping(bytes32 => bool) private exists_;

    // Constructor
    constructor(bytes32 _name) public SysComBase(_name) {
    }

    function numAdrs() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return adrNos_;
    }

    function addAdr(bytes32 _name, address _id) public returns (bool) {
        checkDelegate(msg.sender, 1);
        
        getSysOverlayer();
        require(!exists_[_name]);

        exists_[_name] = true;
        indice_[_name] = adrNos_;
        names_[adrNos_] = _name;
        adrs_[adrNos_] = _id;
        adrNos_++;

        return true;
    }

    function removeAdr(bytes32 _name) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);

        uint index = indice_[_name];

        names_[index] = names_[adrNos_ - 1];
        adrs_[index] = adrs_[adrNos_ - 1];
        indice_[names_[index]] = index;

        delete adrs_[adrNos_ - 1];
        delete names_[adrNos_ - 1];
        exists_[_name] = false;
        adrNos_--;

        return true;
    }

    function getAdr(bytes32 _name) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);
        return adrs_[indice_[_name]];
    }

    function delegateObject(address _objectAdr, uint _priority) public {
        checkDelegate(msg.sender, 1); 

        for (uint i = 0; i < adrNos_; ++i) {
            Object(adrs_[i]).setDelegate(_objectAdr, _priority);
        }
    }
}
