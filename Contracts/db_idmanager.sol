/*
Copyright (c) 2018, ZSC Dev Team
2018-02-11: v0.01
*/

pragma solidity ^0.4.18;
import "./Object.sol";

contract DBIDManager is Object{
    uint[]  IDs_;
    mapping(uint => uint) IDExist_;
    
    // Constructor
    function DBItem(string _name) public Object(_name) {
    }
    
    function addID(uint _id) public onlyOwner returns (bool) {
        if (IDExist_[_id] != 0)
            return false;

        IDExist_[_id] = 1;
        IDs_.push(_id);

        return true;
    }
}
