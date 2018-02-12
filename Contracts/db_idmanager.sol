/*
Copyright (c) 2018, ZSC Dev Team
2018-02-11: v0.01
*/

pragma solidity ^0.4.18;
import "./object.sol";

contract DBIDManager is Object {
    uint[]  IDs_;
    mapping(uint => uint) IDExist_;
    
    // Constructor
    function DBIDManager() public Object("null") {
    }
        
    function addID(uint _id) public only_delegate returns (bool) {
        if (IDExist_[_id] != 0)
            return false;

        IDExist_[_id] = 1;
        IDs_.push(_id);

        return true;
    }

    function removeID(uint _id) public only_delegate returns (bool) {
        if (IDExist_[_id] == 0)
            return false;

        for (uint i = 0; i < IDs_.length; ++i) {
           if (IDs_[i] == _id) {
                IDs_[i] = IDs_[IDs_.length - 1];
                break;
            }
        }
        IDs_.length -= 1;
        return true;
    }
}
