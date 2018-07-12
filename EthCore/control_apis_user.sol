/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract AbisForUserControlApis {
    function setUserStatus(bytes32 _user, bool _tag) public returns (bool);
    function getUserStatus(bytes32 _user) public constant returns (bool);

    function initControlApis(address _zscToken, address _adm) public;
    function addSystemComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool);
    function numFactoryElements(bytes32 _userName, bytes32 _factoryType) public constant returns (uint);
    function getFactoryElementNameByIndex(bytes32 _userName, bytes32 _factoryType, uint _index) public constant returns (bytes32);
    function doesElementExist(bytes32 _userName, bytes32 _enName) public constant returns (bool);
    function addSignatureAdr(bytes32 _userName, address _sigAdr) public returns (bool);
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address);
    function enableUserZSCWallet(bytes32 _userName) public returns (address);
    function createElementNode(bytes32 _factoryType, bytes32 _userName, bytes32 _enName, bytes32 _extraInfo) public returns (address);
    function publishAgreement(bytes32 _userName, bytes32 _agrName) public;
    function getElementNameByAddress(bytes32 _userName, address _adr) public constant returns (bytes32);
    function getElementType(bytes32 _userName, bytes32 _enName) public constant returns (bytes32);
    function addElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool);
    function getElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (bytes32);
    function getElementAddress(bytes32 _userName, bytes32 _enName) public constant returns (address);
    function getElementBalance(bytes32 _userName, bytes32 _enName, bytes32 _symbol) public constant returns (uint);
    function numElementParameters(bytes32 _userName, bytes32 _enName) public constant returns (uint);
    function getElementParameterNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32);
    function submitTransfer(bytes32 _userName, bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint);
    function numElementChildren(bytes32 _userName, bytes32 _enName) public constant returns (uint);
    function getElementChildNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32);
    function numTemplates(bytes32 _userName) public constant returns (uint);
    function getTemplateNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32);
    function numAgreements(bytes32 _userName) public constant returns (uint);
    function getAgreementNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32);
    function purchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint);
    function claimInsurance(bytes32 _userName, bytes32 _agrName) public returns (bool) ;
    function getUserWalletAddress(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (address);
    function getTokenBalanceInfoByIndex(bytes32 _userName, uint _index) public constant returns (string);
    function numUserTransactions(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (uint);
    function getUserTransactionByIndex(bytes32 _userName, bytes32 _tokenSymbol, uint _index) public constant returns (string);
    function setElementMultipleParameters(bytes32 _userName, bytes32 _enName, string _info) public;
    function getModuleAddresses() public constant returns (string);
    
    /*ERC721 for miner robot begin*/
    function totoalSupply() public view returns (uint);
    function balanceOf(address _owner) external view returns (uint);
    function ownerOf(uint _tokenId) external view returns (address);
    function safeTransferFrom(address _from, address _to, uint _tokenId) external;
    function approve(address _approved, uint _tokenId) external;
    function getApproved(uint _tokenId) external view returns (address);
    /*ERC721 for miner robot end*/

    function purchaseMinerRobot(bytes32 _userName, uint _robotId) public;
    function publishMinerRobot(bytes32 _userName, uint _robotId, uint _price) public;
}

