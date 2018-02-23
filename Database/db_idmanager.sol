/*
Copyright (c) 2018, ZSC Dev Team
2018-02-11: v0.01
*/

pragma solidity ^0.4.18;
import "./object.sol";

contract DBIDManager is Object {
    address[]  IDs_;
    mapping(address => bool) IDExist_;

    // Constructor
    function DBIDManager() public Object("null") {
    }

    function numIDs() public only_delegate constant returns (uint) {
        return IDs_.length;
    }

    function addID(address _id) public only_delegate returns (bool) {
        if (IDExist_[_id] == true)
            return false;

        IDExist_[_id] = true;
        IDs_.push(_id);

        return true;
    }

    function removeID(address _id) public only_delegate returns (bool) {
        if (IDExist_[_id] == false)
            return false;

        for (uint i = 0; i < IDs_.length; ++i) {
           if (IDs_[i] == _id) {
                IDExist_[_id] = false;
                IDs_[i] = IDs_[IDs_.length - 1];
                break;
            }
        }

        delete IDs_[IDs_.length - 1];
        IDs_.length -= 1;
        return true;
    }

    function getID(uint _index) public only_delegate constant returns (address) {
        if(_index >= IDs_.length) return 0;
        return IDs_[_index];
    }
}
