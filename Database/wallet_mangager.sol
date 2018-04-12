/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./object.sol";

contract WalletManager is Object {
    struct Erc20Token {
        bytes32 name_;  
        bytes32 symbol_ ;
        uint  decimals_;
        address tokenAdr_;
    }

    uint private tokenNos_;
    mapping(uint => tokenNos_) private erc20Tokens_;
    mapping(bytes32 => uint) private erc20TokenIndice_;
    mapping(bytes32 => bool) private erc20TokenExists_;

    // Constructor
    function WalletManager() public Object("zsc_wallet_manager") {
        tokenNos_ = 0;
    } 

    function addErc20Token(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public only_delegate returns (bool) {
        if (erc20TokenExists_[_symbol]) return false;

        erc20TokenIndice_[_symbol] = tokenNos_;
        erc20Tokens_[tokenNos_] = Erc20Token(_name, _symbol, _decimals, _tokenAdr);
        tokenNos_++;
        return true;
    }

    function removeErc20Token(bytes32 _symbol) public only_delegate returns (bool) {
        if (!erc20TokenExists_[_symbol]) return false;
        
        uint index = erc20TokenIndice_[_symbol];
        delete erc20TokenIndice_[_symbol];
        delete erc20TokenExists_[_symbol];
        delete erc20Tokens_[index];
        tokenNos_--;
    }
}
