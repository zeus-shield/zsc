/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract WalletManager is Object {
    struct Erc20Token {
        bytes32 name_;  
        bytes32 status_;
        bytes32 symbol_ ;
        uint    decimals_;
        address tokenAdr_;
    }

    struct TokenHolder {
        bytes32 name_;
        address adr_;
        mapping(uint => bool) enabledTokens_; // by index
    }

    uint private tokenNos_;
    mapping(uint => Erc20Token) private erc20Tokens_;
    mapping(bytes32 => uint) private erc20TokenIndice_;
    mapping(bytes32 => bool) private erc20TokenExists_;

    uint private holderNos_;
    mapping(uint => TokenHolder) private tokenHoders_;
    mapping(bytes32 => uint) private holderIndices_;
    mapping(bytes32 => bool) private holderExists_;

    address private bindedDB_;
    address private apiController_;

    // Constructor
    constructor() public Object("zsc_wallet_manager") {
        tokenNos_ = 0;
    } 

    function initWalletManager(address _controller, address _database) public {
        require(_database != 0);
        bindedDB_ = _database;

        if (_controller != 0 && _controller != apiController_) {
            if (apiController_ != 0) {
                setDelegate(apiController_, 0);
            }
            apiController_ = _controller;
            setDelegate(_controller, 1);
        }
    }

    function doesTokenContractAdded(bytes32 _symbol) public constant returns (bool) {
        checkDelegate(msg.sender, 1);
        return erc20TokenExists_[_symbol];
    }

    function addTokenContract(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (erc20TokenExists_[_symbol]) return false;

        erc20TokenIndice_[_symbol] = tokenNos_;
        erc20Tokens_[tokenNos_] = Erc20Token("true", _name, _symbol, _decimals, _tokenAdr);
        tokenNos_++;
        return true;
    }

    function removeTokenContract(bytes32 _symbol) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (!erc20TokenExists_[_symbol]) return false;
        
        uint index = erc20TokenIndice_[_symbol];
        delete erc20TokenIndice_[_symbol];
        delete erc20TokenExists_[_symbol];
        delete erc20Tokens_[index];
        tokenNos_--;
    }

    function disableTokenContract(bytes32 _symbol) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (!erc20TokenExists_[_symbol]) return false;
        
        uint index = erc20TokenIndice_[_symbol];
        erc20Tokens_[index].status_ = "false";
    }

    function getTokenContractAddress(bytes32 _symbol) public constant returns (address) {
        checkDelegate(msg.sender, 1);

        require(erc20TokenExists_[_symbol]);
        
        uint index = erc20TokenIndice_[_symbol];
        return erc20Tokens_[index].tokenAdr_;
    }

    function enableTokenByHolder(bytes32 _tokenSymbol, bytes32 _nodeName, address _nodeAddress) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(erc20TokenExists_[_tokenSymbol]);
        require(!holderExists_[_nodeName]);

        uint tokenIndex = erc20TokenIndice_[_tokenSymbol];
        uint holderIndex = holderIndices_[_nodeName];

        holderExists_[_nodeName] = true;
        holderIndices_[_nodeName] = holderNos_;
        tokenHoders_[holderNos_].name_ = _nodeName;
        tokenHoders_[holderNos_].adr_ = _nodeAddress;
        tokenHoders_[holderIndex].enabledTokens_[tokenIndex] = true;   
    }

    function numTokenContracts() public constant returns (uint) {
        return tokenNos_;
    }
    
    function getTokenInfoByIndex(uint _index) public constant returns (bytes32, bytes32, bytes32, uint, address) {
        checkDelegate(msg.sender, 1);

        require(_index < tokenNos_);
        return (erc20Tokens_[_index].name_, 
                erc20Tokens_[_index].status_, 
                erc20Tokens_[_index].symbol_,
                erc20Tokens_[_index].decimals_,
                erc20Tokens_[_index].tokenAdr_);
    }
}
