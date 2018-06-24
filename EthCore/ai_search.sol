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
        // parameter count
        uint parameterCount;
        // parameter => value
        mapping(bytes32 => bytes32) parameters_;
    }

    struct FactoryInfo {
        /* factory type:
           provider
           receiver
           staker
           template
           agreement
           wallet-eth
           wallet-erc20
         */
        bytes32 type_;
        // element count
        uint elementCount_;
        // elemet index => elemet name
        mapping(uint => bytes32) elementNames_;
        // elemet name => ElemetInfo
        mapping(bytes32 => ElemetInfo) elements_;
    }   

    // factory type => FactoryInfo
    mapping(bytes32 => FactoryInfo) factorys_;

    function AISearch(bytes32 _name) public Object(_name) {}

    function numFactoryElements(bytes32 _factoryType) public constant returns (uint) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        return factorys_[_factoryType].elementCount_;
    }

    function getFactoryElementNameByIndex(bytes32 _factoryType, uint _index) public constant returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(elementCount_ > _index);

        return factorys_[_factoryType].elementNames_[_index];
    }

    function numElementParameters(bytes32 _factoryType, bytes32 _enName) public constant returns (uint) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _enName);

        return factorys_[_factoryType].elements_[_enName].parameterCount;
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