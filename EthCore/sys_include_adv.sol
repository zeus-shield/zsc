/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract PosManager {
    function registerStaker(address _nodeAddress) public;
    function removeStaker(address _nodeAddress) public;

    function numBlockInfo(uint _poolIndex, bool _isMined) public constant returns (uint);
    function getBlockInfoByIndex(uint _poolIndex, uint _blockIndex) public constant returns (uint, uint, uint);
}

contract WalletManager {
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

    function conductPurchaseAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _sigAdr) public returns (uint);
    function conductPublishAgreement(bytes32 _userName, bytes32 _agrName, address _creator) public returns (uint);
    function conductInformTransaction(bytes32 _enName, address _dest, uint256 _amount) public returns (bool);
    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) public pure returns (bytes32);
}

contract SimulatorManager {
    function addSimulationRun(uint _proLevel, uint _price, uint _lockedAmount, uint _end, address _agrWallet, address _proWallet, address _recWallet) public returns (bytes32);
    function runSimulation(uint _steps) public;
}

contract FactoryManager {
    function numAdrs() public constant returns (uint);
    function addAdr(bytes32 _name, address _id) public returns (bool);
    function getAdr(bytes32 _name) public constant returns (address);
    function createFactoryNode(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) public returns (address);
}
