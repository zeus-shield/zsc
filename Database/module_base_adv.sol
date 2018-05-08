/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./module_base.sol";

contract DBNode is Object {
    function setId(address _ethWalletiId) public;
    function getId() public returns (address);
    function getNodeType() public constant returns (bytes32);
    function getBlance(bool _locked) public constant returns (uint256);

    function setActivated(bool _activated) public;
    function getActivated() public constant returns (bool);

    function addParameter(bytes32 _parameter) public returns (bool);
    function removeParameter(bytes32 _parameter) public returns (bool);
    function setParameter(bytes32 _parameter, string _value) public returns (bool);
    function numParameters() public constant returns (uint);
    function getParameterNameByIndex(uint _index) public constant returns (bytes32);

    function setERC20TokenAddress(address _tokenAdr) public;
    function doesLastTransactionSigned() public constant returns (bool);
    function submitTransaction(address _dest, uint256 _amount, bytes _data, address _user) public returns (uint);
    function confirmTransaction(address _sigAdr) public returns (uint);    
    function executeTransaction(bool _doesDirectly, address _dest, uint256 _amount, bytes _data) public returns (uint);
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
}

contract ModuleBaseAdv is ModuleBase {
    constructor(bytes32 _name) public Object(_name) {
    }

    function getDBNode(bytes32 _node) internal constant returns (DBNode) {      
        return DBNode(getDatabase().getNode(_node));
    }
}
