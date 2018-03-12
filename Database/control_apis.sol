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

    /// @dev creat a provider node
    /// @param _name The name of the provider to be added
    function createProviderNode(bytes32 _name) public returns (address) {
        return createFactoryNode("provider", _name);
    }
}
