/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./module_base_adv.sol";

contract WalletManager is ModuleBaseAdv {
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

    address private bindedDB_;
    address private apiController_;

    // Constructor
    constructor() public ModuleBaseAdv("zsc_wallet_manager") {
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


contract ModuleManager is Object {
    function getModuleObj(bytes32 _name) public returns (address);
    function getModuleDatabase(bytes32 _name) public returns (address);
}

    function enableWalletByUser(bytes32 _type, bytes32 _user, bytes32 _tokeSymbol, address _creator) internal returns (address) {
        address dbAdr = getModuleManager().getModuleDatabase("user");
        address ndAdr = Database(dbAdr).getNode(_user);

        require(ndAdr != address(0));
        
        if (DBNode(_user).getNodeType() == "staker" && _tokeSymbol != "ZSC") {
            return address(0);
        }

        address parentNode = getDBNode(_user).getHandler("wallet");
        address erc20Address = 0; 
        bytes32 temp;

        temp = formatWalletName(_user, _tokeSymbol);

        if (_tokeSymbol != "ETH") {
            erc20Address = WalletManager(walletGM_).getTokenContractAddress(_tokeSymbol);
            require(erc20Address != 0);
        }

        address walletAdr = getDBFactory(_type).createNode(temp, parentNode, _creator);
        require(walletAdr != 0);
        registerEntityNode(_user, DBNode(walletAdr).name(), walletAdr, _creator);

        DBNode(walletAdr).setERC20TokenAddress(erc20Address);
        WalletManager(walletGM_).enableTokenByHolder(_tokeSymbol, DBNode(walletAdr).name(), walletAdr);

        return walletAdr;
    }
}
