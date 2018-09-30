/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_gm_base.sol";

contract SysGmToken is SysGmBase {

    struct TokenInfo {
        bytes32 status_;
        bytes32 name_;  
        bytes32 symbol_ ;
        uint    decimals_;
        address address_;
        uint    posableTag_;
        uint    tradeableTag_;
    }

    /* token number */
    uint private number_;

    /* index => token info */
    mapping(uint => TokenInfo) private tokens_;

    /* symbol => index */
    mapping(bytes32 => uint) private indexs_;

    /* symbol => exist */
    mapping(bytes32 => bool) private exists_;

    function SysGmToken(bytes32 _name) public SysGmBase(_name) {
        number_ = 0;
    } 

    function numOfTokens() public view returns (uint) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        return number_;
    }

    function doesTokenExist(bytes32 _symbol) public view returns (bool) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        return exists_[_symbol];
    }

    function setToken(bytes32 _name, bytes32 _symbol, uint _decimals, address _address, uint _posableTag, uint _tradeableTag) public returns (bool) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        /* check exist */
        //require(false == exists_[_symbol]);

        addLog("addToken ", true);
        addLog(PlatString.bytes32ToString(_symbol), false);
        addLog(" : 0x", false);
        addLog(PlatString.addressToString(_address), false);

        uint index;
        if (!exists_[_symbol]) {
            exists_[_symbol] = true;
            indexs_[_symbol] = number_;
            index = number_;
            number_ ++;
        } else {
            index = indexs_[_symbol];
        }
        tokens_[index].name_ = _name;
        tokens_[index].symbol_ = _symbol;
        tokens_[index].decimals_ = _decimals;
        tokens_[index].address_ = _address;
        tokens_[index].posableTag_ = _posableTag;
        tokens_[index].tradeableTag_ = _tradeableTag;

        return true;
    }

    function removeToken(bytes32 _symbol) public returns (bool) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        /* check exist */
        require(true == exists_[_symbol]);

        uint index = indexs_[_symbol];

        tokens_[index] = tokens_[number_ - 1];
        indexs_[tokens_[number_ - 1].symbol_] = index;

        delete tokens_[number_ - 1];
        delete indexs_[_symbol];
        delete exists_[_symbol];

        number_--;

        return true;
    }

    function getTokenInfoByIndex(uint _index) public view returns (bytes32, bytes32, bytes32, uint, address) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        /*check param */
        require(number_ > _index);

        /* check exist */
        //require(true == exists_[tokens_[_index].symbol_]);

        return (tokens_[_index].status_,
                tokens_[_index].name_,
                tokens_[_index].symbol_,
                tokens_[_index].decimals_,
                tokens_[_index].address_);
    }

    function getTokenInfoBySymbol(bytes32 _symbol) public view returns (bytes32, bytes32, bytes32, uint, address) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        require(exists_[_symbol]);

        return getTokenInfoByIndex(indexs_[_symbol]);
    }

    function getTokenAddress(bytes32 _symbol) public view returns (address) {
        /* check exist */
        require(true == exists_[_symbol]);
        return tokens_[indexs_[_symbol]].address_;
    }

    function isTokenPosable(bytes32 _symbol) public view returns (bool) {
        /* check exist */
        require(true == exists_[_symbol]);
        return (tokens_[indexs_[_symbol]].posableTag_ == 1);
    }

    function isTokenTradeable(bytes32 _symbol) public view returns (bool) {
        /* check exist */
        require(true == exists_[_symbol]);
        return (tokens_[indexs_[_symbol]].tradeableTag_ == 1);
    }

    function getTokenInfoStrByIndex(uint _index) public view returns (string) {
        checkDelegate(msg.sender, 1);

        bytes32 status = tokens_[_index].status_;
        bytes32 tokenName = tokens_[_index].name_;
        bytes32 tokenSymbol = tokens_[_index].symbol_;
        uint tokenDecimals = tokens_[_index].decimals_;
        address tokenAdr = tokens_[_index].address_;

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "name=",        PlatString.bytes32ToString(tokenName), "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenDecimals),   "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        str = PlatString.append(str, "posable=",     PlatString.uintToString(tokens_[_index].posableTag_),    "&");
        str = PlatString.append(str, "tradeable=",   PlatString.uintToString(tokens_[_index].tradeableTag_),    "&");
        return str;
    }
}
