/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract PosManager is Object {
    function registerStaker(address _nodeAddress) public;
    function removeStaker(address _nodeAddress) public;

    function numBlockInfo(uint _poolIndex, bool _isMined) public constant returns (uint);
    function getBlockInfoByIndex(uint _poolIndex, uint _blockIndex) public constant returns (uint, uint, uint);
}

contract WalletManager is Object {
    function initWalletManager(address _controller, address _database) public;
    function doesTokenContractAdded() public constant returns (bool);
    function addTokenContract(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public returns (bool);
    function removeTokenContract(bytes32 _symbol) public returns (bool);
    function disableTokenContract(bytes32 _symbol) public returns (bool);
    function getTokenContractAddress(bytes32 _symbol) public constant returns (address);
    function enableTokenByHolder(bytes32 _tokenSymbol, bytes32 _nodeName, address _nodeAddress) public returns (bool);
    function numTokenContracts() public constant returns (uint);
    function getTokenInfoByIndex(uint _index) public constant returns (bytes32, bytes32, bytes32, uint, address);
    function enableWalletByUser(bytes32 _user, bytes32 _tokeSymbol, address _creator) public returns (address);

    function conductPurchaseAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _sigAdr) internal returns (uint);
}

contract SimulatorManager is Object {
    function addSimulationRun(uint _proLevel, uint _price, uint _lockedAmount, uint _end, address _agrWallet, address _proWallet, address _recWallet) public returns (bytes32);
    function runSimulation(uint _steps) public;
}

contract FactoryManager {
    function createFactoryNode(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) public returns (address) {
}

contract DBManager {
    function addNodeParameter(bytes32 _dbName, bytes32 _nodeName, bytes32 _parameter) public returns (bool);
    function setNodeParameterValue(bytes32 _dbName, bytes32 _nodeName, bytes32 _parameter, bytes32 _value) public returns (bool);
    function getNodeParameterValue(bytes32 _dbName, bytes32 _nodeName, bytes32 _parameter) public constant returns (bytes32);
}
