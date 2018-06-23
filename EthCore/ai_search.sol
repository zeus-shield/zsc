        /*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AISearch is Object {

    struct Attribute {
        bytes32 parameter_;
        bytes32 value_;
    }

    function AISearch(bytes32 _name) public Object(_name) {}
}