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

    function numFactoryElements(bytes32 _userName, bytes32 _factoryType) public constant returns (uint) {
        /* TODO */
        return 0;
    }

    function getFactoryElementNameByIndex(bytes32 _userName, bytes32 _factoryType, uint _index) public constant returns (bytes32) {
        /* TODO */
        return 0;
    }

    function numElementParameters(bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        /* TODO */
        return 0;
    }

    function getElementParameterNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32) {
        /* TODO */
        return 0;
    }

    function getElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (bytes32) {
        /* TODO */
        return 0;
    }
}