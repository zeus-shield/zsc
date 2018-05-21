/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract DBDatabase {
    function getNode(bytes32 _name) public constant returns (address);
    function destroyNode(address _node) public returns (bool);
    function checkeNodeByAddress(address _adr) public constant returns (bool);
    function _addNode(address _node) public ;
}

contract DBNode {
    function setId(address _ethWalletiId) public;
    function getId() public returns (address);
    function getNodeType() public constant returns (bytes32);
    function getBlance(bool _locked) public constant returns (uint256);

    function setActivated(bool _activated) public;
    function getActivated() public constant returns (bool);

    function addParameter(bytes32 _parameter) public returns (bool);
    function removeParameter(bytes32 _parameter) public returns (bool);
    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool);
    function getParameter(bytes32 _parameter) public constant returns (bytes32);
    function numParameters() public constant returns (uint);
    function getParameterNameByIndex(uint _index) public constant returns (bytes32);

    function setERC20TokenAddress(address _tokenAdr) public;
    function doesLastTransactionSigned() public constant returns (bool);
    //function submitTransaction(address _dest, uint256 _amount, bytes _data, address _user) public returns (uint);
    //function confirmTransaction(address _sigAdr) public returns (uint);    
    function executeTransaction(address _dest, uint256 _amount, bytes _data) public returns (uint);
    function informTransaction(address _src, address _dest, uint256 _amount) public;
    function numTransactions() public constant returns (uint);
    function getTransactionInfoByIndex(uint _index) public constant returns (uint, bool, bytes32, uint, address, address);

    function setAgreementStatus(bytes32 _tag, bytes32 receiver) public returns (bool);
    function configureHandlers() public returns (bool);
    function getHandler(bytes32 _type) public constant returns (address);
    function numAgreements() public constant returns (uint);
    function getAgreementByIndex(uint _index) public constant returns (address);

    function numChildren() public constant returns(uint);
    function getChildByIndex(uint _index) public  constant returns(address);
    function addChild(address _node) public returns (address);

    function getMiningInfoByIndex(bool _isReward, uint _index) public constant returns (uint, uint);
    function numMiningInfo(bool _isReward) public constant returns (uint);

    function addSignature(address _sigAdr) public returns (bool);
    function getAgreementInfo() public constant returns (bytes32, bytes32, uint, uint, bytes32, uint);
}

contract FactoryBase {
    function setDatabase(address _adr) public;
    function getDatabase() public constant returns (address);
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
}

contract WalletBase {
    function getBlance(bool _locked) public constant returns (uint256);
    function getLockBalanceInfoByAgreement(address _agreementAdr) public constant returns (uint, uint, uint, address);
    function setLockValue(bool _tag, uint _amount, uint _duration, address _agreementAdr) public returns (bool);
    function executeTransaction(address _dest, uint256 _amount, bytes _data) public returns (bool);
}

contract SysOverlayer {
    function getComponent(bytes32 _type, bytes32 _name) public constant returns (address);
    function addComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool);
}
