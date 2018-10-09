/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

/*
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

    function takeOutToOwner(uint256 _tokenId) public;
    function transferToOther(address _dest, uint256 _tokenId) public;
}
*/

contract AbisForUserControlApis {
    function submitTransfer(bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint);
    function getUserWalletAddress() public view returns (address);
    function numOfTokens() public view returns (uint);
    function getTokenBalanceInfoBySymbol(bytes32 _symbol) public view returns (string);
    function getTokenBalanceInfoByIndex(uint _index) public view returns (string);
    function getUserTransactionByIndex(uint _index) public view returns (string);
    function getPoSModuleAddresses() public view returns (string);

    function totalSupply() public view returns (uint); //Erc721;
    function transfer(address _to, uint _tokenId) public; //Erc721;
    function ownerOf(uint _tokenId) public view returns (address);

    function createUnit(bool _isRandom, bytes32 _ctgName, address _user) public;
    function activeUnit(uint _robotId, bytes32 _tokenType, uint _durationInDays) public;
    function upgradeUnitSpLev(uint _robotId) public;
    function publishUnit(uint _robotId, uint _price) public;
    function cancelSell(uint _robotId) public;
    function purchaseUnit(uint _robotId) public;
    function claimReward(uint _robotId) public;
    function numUnits(bytes32 _type, address _adr) public view returns (uint);
    function getUnitIdByIndex(bytes32 _type, address _adr, uint _index) public view returns (uint);
    function getUnitInfoByIndex(bytes32 _type, address _adr, uint _index, bytes32[] _paras) public view returns (string);
    function getUnitInfoById(uint _robotId, bytes32[] _paras) public view returns (string);

    function getPublicTradeableTag() public view returns (uint);
    function getPosRatio() public view returns (uint, uint);

    function getUnitName(uint _unitId) public view returns (bytes32);
    function getCategoryName(uint _unitId) public view returns (bytes32);
    function getUnitSpec(uint _unitId) public view returns (bool);
    function getPosMinedSP(uint _unitId) public view returns (uint);
    function getPosRewardSP(uint _unitId) public view returns (uint);
    function getPosLastSP(uint _unitId) public view returns (uint);
    function getUnitStatus(uint _unitId) public view returns (bytes32);
    function getUnitSPBase(uint _unitId) public view returns (uint);
    function getUnitRare(uint _unitId) public view returns (uint);
    function getUnitSPLev(uint _unitId) public view returns (uint);
    function getUnitSPEft(uint _unitId) public view returns (uint);
    function getUnitRRType(uint _unitId) public view returns (uint);
    function getUnitRREft(uint _unitId) public view returns (uint);
    function getUnitRRLevEft(uint _unitId) public view returns (uint);
    function getUnitUPBase(uint _unitId) public view returns (uint);
    function getUnitUPEft(uint _unitId) public view returns (uint);
    function getUnitSPCur(uint _unitId) public view returns (uint);
    function getUnitSPMax(uint _unitId) public view returns (uint);
    function getUnitMineStart(uint _unitId) public view returns (uint);
    function getUnitMineEnd(uint _unitId) public view returns (uint);
    function getUnitSeller(uint _unitId) public view returns (address);
    function getUnitSellPrice(uint _unitId) public view returns (uint);
    function getUnitParaExtra(uint _unitId, bytes32 _para) public view returns (uint);
}

