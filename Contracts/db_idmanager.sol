/*
Copyright (c) 2018, ZSC Dev Team
2018-02-11: v0.01
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

library DBIDManager {
    struct IDManager {
        uint[]  IDs_;
        mapping(uint => uint) IDExist_;
    }
    
    function addID(IDManager storage _idmanager, uint _id) public returns (bool) {
        if (_idmanager.IDExist_[_id] != 0)
            return false;

        _idmanager.IDExist_[_id] = 1;
        _idmanager.IDs_.push(_id);

        return true;
    }
}
