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
        addFactoryAdr(mapType(_type), _adr);
    }

    /// @dev Add the database factory of managing the provider nodes
    /// @param _adr The address of the database factory
    function setDatabase(address _adr) public only_owner {
        setDatabaseAdr(_adr);
    }

    /// @dev Creat a user element
    /// @param _factroyType The type of the factory for creating the element
    /// @param _node The name of the element belonging to the user
    function createElement(uint _factroyType, bytes32 _node, bytes32 extraInfo, address extraAdr) public only_registered(_node) returns (address) {
        //require(checkAllowedUser(_node));
        address adr = extraAdr;
        if (adr == 0) adr = msg.sender;
        return createFactoryNode(mapType(_factroyType), _node, extraInfo, adr);
    }

    /// @dev Creat a user element
    /// @param _adr The address of the existing element
    function getElementNameByAddress(address _adr) public only_delegate constant returns (bytes32) {
        require (getDBDatabase().checkeNodeByAddress(_adr));
        return Object(_adr).name();
    }

    /// @dev Get the type of an element
    function getElementType(bytes32 _node) public only_delegate constant returns (bytes32) {
        DBNode nd = getDBNode( _node);
        require(nd != DBNode(0));
        return nd.getNodeType();
    }

    /// @dev Get the number of elements of a database
    function numElements() public only_delegate constant returns (uint) { 
        return getDBDatabase().numNodes(); 
    }
    
    /// @dev Get the number of elements of the database
    /// @param _index The index of the element in the database
    function getElementNameByIndex(uint _index) public only_delegate constant returns (bytes32) { 
        address nd = getDBDatabase().getNodeByIndex(_index);
        require(nd != address(0));
        return Object(nd).name();
    }

    /// @dev Check the element wheather or not existing
    /// @param _node The name of the element to be checked
    function doesElementExist(bytes32 _node) public only_registered(_node) constant returns (bool) {
        return (getDBNode(_node) != DBNode(0));
    }

    /// @dev add a paramter to an element
    /// @param _node The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(bytes32 _node, bytes32 _parameter) public only_registered(_node) returns (bool) {
        return operateNodeParameter("add", _node, _parameter, "");
    }

    /// @dev Set the value to a paramter of an element 
    /// @param _node The name of the element
    /// @param _parameter The name of the existing parameter
    /// @param _value The parameter value
    function setElementParameter(bytes32 _node, bytes32 _parameter, string _value) public only_registered(_node) returns (bool) {
        return operateNodeParameter("set", _node, _parameter, _value);
    }

    /// @dev Get the value to a paramter of a node
    /// @param _node The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _node, bytes32 _parameter) public only_registered(_node) constant returns (string) {
        return getControlInfoParameterValue(_node, _parameter);
    }

    /// @dev Get the value to a paramter of a node
    /// @param _node The name of the element
    function getElementAddress(bytes32 _node) public only_registered(_node) constant returns (address) {
        return address(getDBNode(_node));
    }

    /// @dev Get the value to a paramter of a node
    /// @param _node The name of the element
    function getElementEthBalance(bytes32 _node) public only_registered(_node) constant returns (uint256) {
        return getDBNode(_node).getBlance("ether", 0);
    }

    /// @dev Get the number of paramters of an element
    /// @param _node The name of the existing element
    function numElementParameters(bytes32 _node) public only_registered(_node) constant returns (uint) {
        return  getDBNode(_node).numParameters();
    }

    /// @dev Get the number of paramters of an element
    /// @param _node The name of the existing element
    /// @param _index The index of the parameter
    /* Example:
        var num = numNodeParameters("test");
        if (num > 0) {
            var para = getNodeParameterNameByIndex("test", 0);
        }
    */
    function getElementParameterNameByIndex(bytes32 _node, uint _index) public only_registered(_node) constant returns (bytes32) {
        return  getDBNode(_node).getParameterNameByIndex(_index);
    }

    /// @dev Transfer ETH from a user element to the destination address
    /// @param _node The name of the existing element
    /// @param _dest The destination address
    /// @param _amount The amount of ETH to be transferred
    function elementTransferEth(bytes32 _node, address _dest, uint256 _amount) public only_registered(_node) returns (bool) {
        return  getDBNode(_node).executeEtherTransaction(_dest, _amount, "null");
    }

    /// @dev Get the number of element binded to the node
    /// @param _node The name of the existing element
    /// @param _elementType The type of the element
    function numBindedElements(bytes32 _node, uint _elementType) public only_registered(_node) constant returns (uint) {
        return getDBNode(_node).numBindedEntities(mapType(_elementType));
    }

    /// @dev Get the name of the element binded to the node
    /// @param _node The name of the existing element
    /// @param _elementType The type of the element
    /// @param _index The index of the template
    function getBindedElementNameByIndex(bytes32 _node, uint _elementType, uint _index) public only_registered(_node) constant returns (bytes32) {
        return getDBNode(_node).getBindedEntityNameByIndex(mapType(_elementType), _index);
    }

    function publishInsurance(bytes32 _node, bool _tag) public only_registered(_node) returns (bool) {
        if (_tag) return getDBNode(_node).setAgreementStatus("PUBLISHED");
        else return getDBNode(_node).setAgreementStatus("READY");
    }

    function buyInsurance(bytes32 _user, bytes32 _node, uint _amount) public only_registered(_user) returns (bool) {
        return getDBNode(_user).executeEtherTransaction(address(getDBNode(_node)), _amount, "null");
    }
}
