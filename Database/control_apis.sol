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

    /// @dev Check the provider wheather or not existing
    /// @param _node The name of the node to be checked
    function doesProviderExist(bytes32 _node) public only_delegate constant returns (bool) {
        return (getFactory("provider").getNode(_node) != 0);
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
        require(checkAllowedUser(_node));
        return operateNodeParameter("provider", "add", _node, _parameter, "");
    }

    /// @dev Set the value to a paramter of a provider 
    /// @param _node The name of the existing provider
    /// @param _parameter The name of the existing parameter
    /// @param _value The parameter value
    function setProviderParameter(bytes32 _node, bytes32 _parameter, string _value) public only_delegate returns (bool) {
        require(checkAllowedUser(_node));
        return operateNodeParameter("provider", "set", _node, _parameter, _value);
    }

    /// @dev Get the value to a paramter of a node
    /// @param _node The name of the provider
    /// @param _parameter The name of the existing parameter
    function getNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (string) {
        require(checkAllowedUser(_node));
        return getControlBaseParameterValue(_node, _parameter);
    }

    /// @dev Get the number of paramters of a provider
    /// @param _node The name of the existing provider
    function numProviderParameters(bytes32 _node) public only_delegate constant returns (uint) {
        return  getFactory("provider").numNodeParameters(_node);
    }

    /// @dev Get the number of paramters of a provider
    /// @param _node The name of the existing provider
    /* Example:
        var num = numNodeParameters("test");
        if (num > 0) {
            var para = getNodeParameterNameByIndex("test", 0);
        }
    */
    function getProviderParameterNameByIndex(bytes32 _node, uint _index) public only_delegate constant returns (bytes32) {
        return  getFactory("provider").getNodeParameterNameByIndex(_node, _index);
    }
}
