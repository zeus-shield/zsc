/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./control_base.sol";

contract ControlApis is ControlBase {
    /// @dev Constructor
    /// @param _name The name of the controller
    function ControlApis(bytes32 _name) public ControlBase(_name) {
    }

    /// @dev Add the database factory of managing the provider nodes
    /// @param _adr The address of the database factory
    function addFactory(uint _type, address _adr) public only_owner {
        addFactory(factoryType(_type), _adr);
    }

    /// @dev Check the element wheather or not existing
    /// @param _factroyType The type of the factory for checking the element
    /// @param _node The name of the element to be checked
    function doesElementExist(uint _factroyType, bytes32 _node) public only_delegate constant returns (bool) {
        return (getDBNode(factoryType(_factroyType), _node) != DBNode(0));
    }

    /// @dev Creat a user element
    /// @param _factroyType The type of the factory for creating the element
    /// @param _user The name of the user
    /// @param _node The name of the element belonging to the user
    function createElement(uint _factroyType, bytes32 _user, bytes32 _node) public only_delegate returns (address) {
        return createFactoryNode(factoryType(_factroyType), _user, _node);
    }

    /// @dev add a paramter to an element
    /// @param _factroyType The type of the factory for adding the element
    /// @param _node The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(uint _factroyType, bytes32 _node, bytes32 _parameter) public only_delegate returns (bool) {
        require(checkAllowedUser(_node));
        return operateNodeParameter(factoryType(_factroyType), "add", _node, _parameter, "");
    }

    /// @dev Set the value to a paramter of an element 
    /// @param _factroyType The type of the factory for setting the element
    /// @param _node The name of the element
    /// @param _parameter The name of the existing parameter
    /// @param _value The parameter value
    function setElementParameter(uint _factroyType, bytes32 _node, bytes32 _parameter, string _value) public only_delegate returns (bool) {
        require(checkAllowedUser(_node));
        return operateNodeParameter(factoryType(_factroyType), "set", _node, _parameter, _value);
    }

    /// @dev Get the value to a paramter of a node
    /// @param _node The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (string) {
        require(checkAllowedUser(_node));
        return getControlInfoParameterValue(_node, _parameter);
    }

    /// @dev Get the value to a paramter of a node
    /// @param _factroyType The type of the factory for checking the element
    /// @param _node The name of the element
    function getElementAddress(uint _factroyType, bytes32 _node) public only_delegate constant returns (address) {
        require(checkAllowedUser(_node));
        return address(getDBNode(factoryType(_factroyType), _node));
    }

    /// @dev Get the value to a paramter of a node
    /// @param _factroyType The type of the factory for checking the element
    /// @param _node The name of the element
    function getElementEthBalance(uint _factroyType, bytes32 _node) public only_delegate constant returns (uint256) {
        return getDBNode(factoryType(_factroyType), _node).getBlance("ether", 0);
    }

    /// @dev Get the number of paramters of an element
    /// @param _factroyType The type of the factory for checking the element
    /// @param _node The name of the existing element
    function numElementParameters(uint _factroyType, bytes32 _node) public only_delegate constant returns (uint) {
        return  getDBNode(factoryType(_factroyType), _node).numParameters();
    }

    /// @dev Get the number of paramters of an element
    /// @param _factroyType The type of the factory for checking the element
    /// @param _node The name of the existing element
    /// @param _index The index of the parameter
    /* Example:
        var num = numNodeParameters("test");
        if (num > 0) {
            var para = getNodeParameterNameByIndex("test", 0);
        }
    */
    function getElementParameterNameByIndex(uint _factroyType, bytes32 _node, uint _index) public only_delegate constant returns (bytes32) {
        return  getDBNode(factoryType(_factroyType), _node).getParameterNameByIndex(_index);
    }

    function withDraw(uint _factroyType, bytes32 _node, address _dest, uint256 _value) public only_delegate returns (bool) {
        return  getDBNode(factoryType(_factroyType), _node).executeEtherTransaction(_dest, _value, "null");
    }
}
