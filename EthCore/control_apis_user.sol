/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract AbisForUserControlApis {
    function numFactoryElements(bytes32 _factoryType) public view returns (uint);
    function getFactoryElementNameByIndex(bytes32 _factoryType, uint _index) public view returns (bytes32);
    function doesElementExist(bytes32 _enName) public view returns (bool);
    function createElementNode(bytes32 _factoryType, bytes32 _extraInfo) public returns (address);
    function getElementType(bytes32 _enName) public view returns (bytes32);
    function getElementParameter(bytes32 _enName, bytes32 _parameter) public view returns (bytes32);
    function getElementAddress(bytes32 _enName) public view returns (address);
    function numElementParameters(bytes32 _enName) public view returns (uint);
    function getElementParameterNameByIndex(bytes32 _enName, uint _index) public view returns (bytes32);
    function submitTransfer(bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint);
    function numElementChildren(bytes32 _enName) public view returns (uint);
    function getElementChildNameByIndex(bytes32 _enName, uint _index) public view returns (bytes32);
    function getElementBalance(bytes32 _enName, bytes32 _symbol) public view returns (uint);
    function numTemplates() public view returns (uint);
    function getTemplateNameByIndex(uint _index) public view returns (bytes32);
    function numAgreements() public view returns (uint);
    function getAgreementNameByIndex(uint _index) public view returns (bytes32);
    function enableUserWallet() public returns (address);
    function numUserTransactions() public view returns (uint);
    function setElementMultipleParameters(bytes32 _enName, string _info) public;

    function publishAgreement(bytes32 _agrName, bytes32 _symbol) public;
    function purchaseAgreement(bytes32 _agrName, bytes32 _symbol) public returns (uint);
    function claimInsurance(bytes32 _agrName, bytes32 _symbol) public returns (bool);

    function getUserWalletAddress() public view returns (address);
    function numOfTokens() public view returns (uint);
    function getTokenBalanceInfoByIndex(uint _index) public view returns (string);
    function getTokenBalanceInfoBySymbol(bytes32 _symbol) public view returns (string);
    function getModuleAddresses() public view returns (string);
    
    /*ERC721 for miner robot begin*/
    function numUserMinerRobot(bool _fromSystemWallet) public view returns (uint);
    function getUserMinerRobotInfoByIndex(bool _fromSystemWallet, uint _index) public view returns (string);
    function numSellingMinerRobot() public view returns (uint);
    function getSellingMinerRobotInfoByIndex(uint _index) public view returns (string);
     
    function createMinerRobot() public;
    function enhanceMinerRobot(uint _robotId) public;
    function activeMinerRobot(uint _robotId, bytes32 _tokenType, uint _rewardType) public;
    function publishMinerRobot(uint _robotId, uint _price) public;
    function cancalSellingMinerRobot(uint _robotId) public;
    function purchaseMinerRobot(uint _robotId) public;
    function claimReward(uint _robotId, bytes32 _tokenType) public;
    /*ERC721 for miner robot end*/

    function takeOutToOwner(uint256 _tokenId) public;
    function transferToOther(address _dest, uint256 _tokenId) public;
}

