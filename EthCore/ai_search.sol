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

    struct ElemetInfo {
        address addr_;
        bytes32 type_;
        bytes32 name_;
        /* parameter => value */
        mapping(bytes32 => bytes32) attr_;
    }

    struct FactoryInfo {
        bytes32 type_;
        /* elemet name => ElemetInfo */
        mapping(bytes32 => ElemetInfo) element_;
    }   

    /* factory type => FactoryInfo */
    mapping(bytes32 => FactoryInfo) factory_;

    function AISearch(bytes32 _name) public Object(_name) {}
}