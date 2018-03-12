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
    function addProviderFactory(address _adr) public only_owner {
        addFactory("provider", _adr);
    }

    /// @dev Get the database factory of managing the provider nodes
    function getProviderFactory() public only_owner constant {
        getFactory("provider");
    }

    /// @dev Creat a provider node
    /// @param _node The name of the added provider
    function createProviderNode(bytes32 _node) public only_delegate returns (address) {
        return createFactoryNode("provider", _node);
    }

    /// @dev add a paramter to a provider node
    /// @param _node The name of the existing provider
    /// @param _parameter The name of the added parameter
    function addProviderParameter(bytes32 _node, bytes32 _parameter) public only_delegate returns (bool) {
        return operateNodeParameter("provider", "add", _node, _parameter, "");
    }

    /// @dev Set the value to a paramter of a provider node
    /// @param _node The name of the existing provider
    /// @param _parameter The name of the existing parameter
    /// @param _value The parameter value
    function setProviderParameter(bytes32 _node, bytes32 _parameter, bytes32 _value) public only_delegate returns (bool) {
        return operateNodeParameter("provider", "set", _node, _parameter, _value);
    }

    /// @dev Get the value to a paramter of a provider node
    /// @param _node The name of the existing provider
    /// @param _parameter The name of the existing parameter
    function getProviderParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (bytes32) {
        return getNodeParameter("provider", _node, _parameter);
    }
}
