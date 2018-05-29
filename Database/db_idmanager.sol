/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract IDManager is Object {
    uint idNos_;
    address[]  ids_;
    mapping(bytes32 => uint) private indice_;
    mapping(bytes32 => bool) private exists_;

    // Constructor
    function IDManager(bytes32 _name) public Object(_name) {
    }

    function numIds() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return ids_.length;
    }

    function addId(bytes32 _name, address _id) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(!exists_[_name]);

        exists_[_name] = true;
        indice_[_name] = idNos_;
        ids_.push(_id);
        idNos_++;

        return true;
    }

    function removeId(bytes32 _name, address _id) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);

        for (uint i = 0; i < idNos_; ++i) {
           if (ids_[i] == _id) {
                exists_[_name] = false;
                ids_[i] = ids_[ids_.length - 1];
                break;
            }
        }

        delete ids_[ids_.length - 1];
        ids_.length -= 1;
        return true;
    }

    function getId(bytes32 _name, uint _index) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        require(exists_[_name]);

        if(_index >= ids_.length) return 0;
        return ids_[_index];
    }
}
