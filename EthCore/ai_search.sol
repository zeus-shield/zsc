        /*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AISearch is Object {

    struct ElementInfo {
        // element base info
        // element address
        address addr_;
        // element type
        bytes32 type_;
        // element name
        bytes32 name_;

        // parameter info for the element
        // parameter count
        uint parameterCount;
        // parameter index => parameter name
        mapping(uint => bytes32) parameterNames_;
        // parameter name => parameter index
        mapping(bytes32 => uint) parameterIndexs_;
        // parameter name => exist flag
        mapping(bytes32 => bool) exist_;
        // parameter name => parameter value
        mapping(bytes32 => bytes32) parameters_;
    }

    struct FactoryInfo {
        // factory base info
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

        // element info for the factory
        // element count
        uint elementCount_;
        // elemet index => elemet name
        mapping(uint => bytes32) elementNames_;
        // elemet name => elemet index
        mapping(bytes32 => uint) elementIndexs_;
        // elemet name => exist flag
        mapping(bytes32 => bool) exist_;
        // elemet name => ElemetInfo
        mapping(bytes32 => ElementInfo) elements_;
    }   

    // factory type => FactoryInfo
    mapping(bytes32 => FactoryInfo) private factorys_;

    function AISearch(bytes32 _name) public Object(_name) {}

    function kill() public {
        // check sender
        checkDelegate(msg.sender, 1);

        // delete all data

        super.kill();
    }

    function removeParameter(bytes32 _factoryType, bytes32 _elementName, bytes32 _parameterName) public {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _elementName);
        require(bytes32(0) != _parameterName);

        // TODO
    }

    function numFactoryElements(bytes32 _factoryType) public view returns (uint) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);

        return factorys_[_factoryType].elementCount_;
    }

    function getFactoryElementNameByIndex(bytes32 _factoryType, uint _index) public view returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(factorys_[_factoryType].elementCount_ > _index);

        return factorys_[_factoryType].elementNames_[_index];
    }

    function numElementParameters(bytes32 _factoryType, bytes32 _enName) public view returns (uint) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _enName);

        return factorys_[_factoryType].elements_[_enName].parameterCount;
    }

    function getElementParameterNameByIndex(bytes32 _factoryType, bytes32 _enName, uint _index) public view returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _enName);
        require(factorys_[_factoryType].elements_[_enName].parameterCount > _index);

        return factorys_[_factoryType].elements_[_enName].parameterNames_[_index];
    }

    function getElementParameter(bytes32 _factoryType, bytes32 _enName, bytes32 _parameter) public view returns (bytes32) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        require(bytes32(0) != _factoryType);
        require(bytes32(0) != _enName);
        require(bytes32(0) != _parameter);

        return factorys_[_factoryType].elements_[_enName].parameters_[_parameter];
    }
}