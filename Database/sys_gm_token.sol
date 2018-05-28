/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_module.sol";

contract SysGmToken is SysComModule {

    struct TokenInfo {
        bytes32 status_;
        bytes32 name_;  
        bytes32 symbol_ ;
        uint    decimals_;
        address address_;
    }

    /* token number */
    uint private number_;

    /* index => token info */
    mapping(uint => TokenInfo) private tokens_;

    /* symbol => index */
    mapping(bytes32 => uint) private indexs_;

    /* symbol => exist */
    mapping(bytes32 => bool) private exists_;

    constructor() public SysComModule("sys_gm_token") {
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

    function addToken(bytes32 _name, bytes32 _symbol, uint _decimals, address _address) public returns (bool) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        /* check exist */
        require(false == exists_[_symbol]);

        exists_[_symbol] = true;
        indexs_[_symbol] = number_;
        tokens_[number_] = TokenInfo("true", _name, _symbol, _decimals, _address);
        number_ ++;

        return true;
    }

    function removeToken(bytes32 _symbol) public returns (bool) {
        /* TODO */
        return true;
    }

    function getTokenInfoByIndex(uint _index) public view returns (bytes32, bytes32, bytes32, uint, address) {
        /* TODO */
        return (bytes32(0), bytes32(0), bytes32(0), uint(0), address(0));
    }

    function getTokenAddress(bytes32 _symbol) public view returns (address) {
        /* check delegate */
        checkDelegate(msg.sender, 1);

        /* check exist */
        require(true == exists_[_symbol]);

        return tokens_[indexs_[_symbol]].address_;
    }
}
