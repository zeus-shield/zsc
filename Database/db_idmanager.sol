/*
Copyright (c) 2018, ZSC Dev Team
2018-02-11: v0.01
*/

pragma solidity ^0.4.18;
import "./object.sol";

contract DBIDManager is Object {
    uint[]  IDs_;
    mapping(uint => bool) IDExist_;
    
    // Constructor
    function DBIDManager() public Object("null") {
    }
        
    function addID(uint _id) public only_delegate returns (bool) {
        if (IDExist_[_id] == true)
            return false;

        IDExist_[_id] = true;
        IDs_.push(_id);

        return true;
    }

    function removeID(uint _id) public only_delegate returns (bool) {
        if (IDExist_[_id] == false)
            return false;

        for (uint i = 0; i < IDs_.length; ++i) {
           if (IDs_[i] == _id) {
                IDs_[i] = IDs_[IDs_.length - 1];
                break;
            }
        }

        IDs_.length -= 1;
        delete IDs_[_id]; 
        return true;
    }
}
