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

    /// @dev Set the zsc adm address
    /// @param _adm The address of the zsc adm 
    /// @param _db The address of the database 
    function setSystemModules(address _adm, address _db, address _walletGM, address _simulatorGM, address _pos, address _zscToken) public only_owner {
        setSystemModuleAdrs(_adm, _db, _walletGM, _simulatorGM, _pos, _zscToken);
    }

    /// @dev Add the database factory of managing the elements
    /// @param _typeInUint The type of the database factory
    /// @param _adr The address of the database factory
    function addElementFactory(uint _typeInUint, address _adr) public only_owner {
        addFactoryAdr(mapType(_typeInUint), _adr);
    }

    /// @dev Check the element wheather or not existing
    /// @param _node The name of the element to be checked
    function doesElementExist(bytes32 _node) public only_registered(_node) constant returns (bool) {
        return (getDBNode(_node) != DBNode(0));
    }

    /// @dev Creat an element
    /// @param _typeInUint The type of the factory for creating the element
    /// @param _node The name of the element belonging to the user
    /// @param _extraInfo The extra information
    /// @param _extraAdr The extra address
    function createElement(uint _typeInUint, bytes32 _node, bytes32 _extraInfo, address _extraAdr) public returns (address) {
        require(onlyRegisteredOrDelegated(_node, msg.sender));
        address creatorAdr = _extraAdr;
        if (creatorAdr == 0) {
            creatorAdr = msg.sender;
        }
        return createFactoryNode(mapType(_typeInUint), _node, _extraInfo, creatorAdr);
    }

    function enableElementWallet(uint _typeInUint/*5: eth; 6: erc20*/, bytes32 _user, bytes32 _tokeSymbol, address _extraAdr) public returns (address) {
        require(onlyRegisteredOrDelegated(_user, msg.sender));
        address creatorAdr = _extraAdr;
        if (creatorAdr == 0) {
            creatorAdr = msg.sender;
        }
        return enableWallet(mapType(_typeInUint), _user, _tokeSymbol, creatorAdr);
    }

    /// @dev Get the element by its address
    /// @param _adr The address of the existing element
    function getElementNameByAddress(address _adr) public only_delegate(1) constant returns (bytes32) {
        require (getDBDatabase().checkeNodeByAddress(_adr));
        return Object(_adr).name();
    }

    /// @dev Get the type of an element
    /// @param _node The name of the element belonging to the user
    function getElementType(bytes32 _node) public only_delegate(1) constant returns (bytes32) {
        DBNode nd = getDBNode( _node);
        require(nd != DBNode(0));
        return nd.getNodeType();
    }

    /// @dev Get the number of elements of the database
    function numElements() public only_delegate(1) constant returns (uint) { 
        return getDBDatabase().numNodes(); 
    }
    
    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getElementNameByIndex(uint _index) public only_delegate(1) constant returns (bytes32) { 
        address nd = getDBDatabase().getNodeByIndex(_index);
        require(nd != address(0));
        return Object(nd).name();
    }

    /// @dev Add a paramter to an element
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

    /// @dev Get the value of a paramter of an element
    /// @param _node The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _node, bytes32 _parameter) public only_registered(_node) constant returns (string) {
        return getControlInfoParameterValue(_node, _parameter);
    }

    /// @dev Get the address of the element 
    /// @param _node The name of the element
    function getElementAddress(bytes32 _node) public only_registered(_node) constant returns (address) {
        return address(getDBNode(_node));
    }

    /// @dev Get the eth balance of the element
    /// @param _node The name of the element
    function getElementBalance(bytes32 _node, bytes32 _symbol, bool _locked) public only_registered(_node) constant returns (uint256) {
        string memory str = PlatString.append(_node, "-", _symbol);
        bytes32 walletName = PlatString.tobytes32(str);
        require(getDBNode(walletName) != DBNode(0));

        return getDBNode(walletName).getBlance(_locked);
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
    function elementTransferValue(bytes32 _node, bytes32 _symbol, address _dest, uint256 _amount) public only_registered(_node) returns (bool) {
        string memory str = PlatString.append(_node, "-", _symbol);
        bytes32 walletName = PlatString.tobytes32(str);
        require(getDBNode(walletName) != DBNode(0));

        return  getDBNode(walletName).executeTransaction(_dest, _amount, "null");
    }

    /// @dev Get the number of element binded to the node
    /// @param _node The name of the existing element
    /// @param _elementType The type of the element
    function numBindedElements(bytes32 _node, uint _elementType) public only_registered(_node) constant returns (uint) {
        return getDBNode(_node).numBindedEntities(mapType(_elementType));
    }

    /// @dev Get the name of the element binded to the element by index
    /// @param _node The name of the existing element
    /// @param _elementType The type of the element
    /// @param _index The index of the template
    function getBindedElementNameByIndex(bytes32 _node, uint _elementType, uint _index) public only_registered(_node) constant returns (bytes32) {
        return getDBNode(_node).getBindedEntityNameByIndex(mapType(_elementType), _index);
    }

    /// @dev Announce an insurance agreement by a provider
    /// @param _agreement The agreement name
    /// @param _tag The announcement status
    function announceInsurance(bytes32 _agreement, bool _tag) public only_registered(_agreement) returns (bool) {
        if (_tag) return getDBNode(_agreement).setAgreementStatus("PUBLISHED", "null");
        else return getDBNode(_agreement).setAgreementStatus("READY", "null");
    }

    /// @dev Buy an insurance agreement with Eth from a provider
    /// @param _user The receiver name
    /// @param _agreement The agreement name
    function purchaseInsurance(bytes32 _user, bytes32 _agreement) public only_registered(_user) returns (bool) {
        return getDBNode(_agreement).setAgreementStatus("PUBLISHED", _user);
    }

    function registerErc20Token(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public only_delegate(1) returns (bool) {
        return manageErc20TokenContract(true, _name, _symbol, _decimals, _tokenAdr);
    }

    function removeErc20Token(bytes32 _symbol) public only_delegate(1) returns (bool) {
        return manageErc20TokenContract(false, 0, _symbol, 0, 0);
    }

    function numRegisteredErc20Tokens() public only_delegate(1) constant returns (uint) {
        getWalletManager().numTokenSymbols();
    }

    function getErc20TokenSymbolByIndex(uint _index) public only_delegate(1) constant returns (uint) {
        getWalletManager().getTokenSymbolByIndex(_index);
    }

    function getUserWalletAddress(bytes32 _user, bytes32 _tokenSymbol) public only_delegate(1) constant returns (address) {
        DBNode nd = getDBNode( _user);
        require(nd != DBNode(0));

        string memory temp = PlatString.append(_user, "-", _tokenSymbol);
        address(getDBNode(PlatString.tobytes32(temp)));
    }

}
