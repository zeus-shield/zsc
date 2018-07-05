/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_node.sol";

contract DBEntity is DBNode {
    uint private paraNos_;
    mapping(bytes32 => uint) private parameterIndice_;
    mapping(uint => bytes32) private parameterNames_;
    mapping(uint => bytes32) private parameterValues_;
    mapping(bytes32 => bool) private parameterExist_;
    mapping(bytes32 => bool) private fundamentalParas_;

    uint walletNos_;
    mapping(uint => bytes32) private walletsIndice_;
    mapping(bytes32 => address) private wallets_;

    // Constructor
    function DBEntity(bytes32 _name) public DBNode(_name) {
        paraNos_ = 0;
    }

    function initParameters() internal;

    function initEntity() public {
        checkDelegate(msg.sender, 1);
        initParameters();
    }

    function numWallets() public returns (uint) {
        checkDelegate(msg.sender, 1);
        return walletNos_;
    }

    function addWallet(bytes32 _symbol, address _adr) public {
        checkDelegate(msg.sender, 1);
        require(wallets_[_symbol] == address(0));

        walletsIndice_[walletNos_] = _symbol;
        wallets_[_symbol] = _adr;
        walletNos_++;
    }

    function getWalletByName(bytes32 _symbol) public returns (address) {
        checkDelegate(msg.sender, 1);
        require(wallets_[_symbol] != address(0));
        return  wallets_[_symbol];
    }

    function getWalletByIndex(uint _index) public returns (address) {
        checkDelegate(msg.sender, 1);
        require(_index < walletNos_);
        return  wallets_[walletsIndice_[_index]];
    }
    
    function __addParameter(bytes32 _parameter) private {
        require(!parameterExist_[_parameter]);
        parameterExist_[_parameter] = true;
        parameterIndice_[_parameter] = paraNos_;
        parameterNames_[paraNos_] = _parameter;
        paraNos_++;
    }

    function addFundamentalParameter(bytes32 _parameter) internal returns (bool) {
        checkDelegate(msg.sender, 1);
        __addParameter(_parameter);
        fundamentalParas_[_parameter] = true;
        return true;
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        __addParameter(_parameter);
        return true;
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_parameter]);
        require(!fundamentalParas_[_parameter]);

        uint index; 
        for (uint i = 0; i < paraNos_; ++i) {
            if (parameterNames_[i] == _parameter) {
                index = i;
                break;
            }
        }

        parameterNames_[index] = parameterNames_[paraNos_ - 1];
        parameterValues_[index] = parameterValues_[paraNos_ - 1];
        parameterIndice_[parameterNames_[index]] = index;

        delete parameterIndice_[_parameter];
        delete parameterNames_[paraNos_ - 1];
        delete parameterValues_[paraNos_ - 1];
        delete parameterExist_[_parameter];
        paraNos_--;

        return true;
    }

    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_parameter]);
        parameterValues_[parameterIndice_[_parameter]] = _value;
        return true;
    }

    function getParameter(bytes32 _parameter) public constant returns (bytes32) {
        checkDelegate(msg.sender, 1);
        require(parameterExist_[_parameter] == true);
        return parameterValues_[parameterIndice_[_parameter]];
    }
    
    function numParameters() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return paraNos_;
    }

    function getParameterNameByIndex(uint _index) public constant returns (bytes32) {
        checkDelegate(msg.sender, 1);
        require(_index < paraNos_);
        return parameterNames_[_index];
    }
}
