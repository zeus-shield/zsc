/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBIDManager is Object {
    address[]  IDs_;
    mapping(address => bool) IDExist_;

    // Constructor
    constructor() public Object("null") {
    }

    function numIds() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return IDs_.length;
    }

    function addId(address _id) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (IDExist_[_id] == true)
            return false;

        IDExist_[_id] = true;
        IDs_.push(_id);

        return true;
    }

    function removeId(address _id) public returns (bool) {
        checkDelegate(msg.sender, 1);

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

    function getId(uint _index) public constant returns (address) {
        checkDelegate(msg.sender, 1);

        if(_index >= IDs_.length) return 0;
        return IDs_[_index];
    }
}
