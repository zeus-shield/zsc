/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract AbisForUserControlApis {
    function setUserStatus(bytes32 _user, bool _tag) public returns (bool);
    function getUserStatus(bytes32 _user) public constant returns (bool);

    /// @dev Set the zsc adm address
    /// @param _adm The address of the zsc adm 
    function initControlApis(address _zscToken, address _adm) public;

    function addSystemComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool);
   
    /// @dev Get the number of elements of the database
    function numFactoryElements(bytes32 _userName, bytes32 _factoryType) public constant returns (uint);

    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getFactoryElementNameByIndex(bytes32 _userName, bytes32 _factoryType, uint _index) public constant returns (bytes32);

    /// @dev Check the element wheather or not existing
    /// @param _enName The name of the element to be checked
    function doesElementExist(bytes32 _userName, bytes32 _enName) public constant returns (bool);

    function addSignatureAdr(bytes32 _userName, address _sigAdr) public returns (bool);

    /// @dev Creat an element
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address);

    function enableUserZSCWallet(bytes32 _userName) public returns (address);

    function createElementNode(bytes32 _factoryType, bytes32 _userName, bytes32 _enName, bytes32 _extraInfo) public returns (address);

    function publishAgreement(bytes32 _userName, bytes32 _agrName) public;
    
    /// @dev Get the element by its address
    /// @param _adr The address of the existing element
    function getElementNameByAddress(bytes32 _userName, address _adr) public constant returns (bytes32);

    /// @dev Get the type of an element
    /// @param _enName The name of the element belonging to the user
    function getElementType(bytes32 _userName, bytes32 _enName) public constant returns (bytes32);

    /// @dev Add a paramter to an element
    /// @param _enName The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool);

    /// @dev Get the value of a paramter of an element
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (bytes32);

    /// @dev Get the address of the element 
    /// @param _enName The name of the element
    function getElementAddress(bytes32 _userName, bytes32 _enName) public constant returns (address);
    //Disabled during alpha-test
    /// @dev Get the eth balance of the element
    /// @param _enName The name of the element
    function getElementBalance(bytes32 _userName, bytes32 _enName, bytes32 _symbol) public constant returns (uint);
    /// @dev Get the number of paramters of an element
    /// @param _enName The name of the existing element
    function numElementParameters(bytes32 _userName, bytes32 _enName) public constant returns (uint);
    function getElementParameterNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32);
    /// @dev Transfer a particular amount from a user wallet to the destination address
    /// @param _dest The destination address
    /// @param _amount The amount to be transferred
    function submitTransfer(bytes32 _userName, bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint);

    function numElementChildren(bytes32 _userName, bytes32 _enName) public constant returns (uint);

    function getElementChildNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32);

    function numTemplates(bytes32 _userName) public constant returns (uint);

    function getTemplateNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32);

    function numAgreements(bytes32 _userName) public constant returns (uint);
    function getAgreementNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32);

    /// @dev Buy an insurance agreement from a provider
    function purchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint);

    function claimInsurance(bytes32 _userName, bytes32 _agrName) public returns (bool) ;

    function getUserWalletAddress(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (address);

    function getTokenBalanceInfoByIndex(bytes32 _userName, uint _index) public constant returns (string);

    function numUserTransactions(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (uint);
    function getUserTransactionByIndex(bytes32 _userName, bytes32 _tokenSymbol, uint _index) public constant returns (string);
    function setElementMultipleParameters(bytes32 _userName, bytes32 _enName, string _info) public;

}

