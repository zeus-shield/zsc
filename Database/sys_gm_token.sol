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

    /* token count */
    uint private count_;

    /* index => token info */
    mapping(uint => TokenInfo) private tokens_;

    /* symbol => index */
    mapping(bytes32 => uint) private indexs_;

    /* symbol => exist */
    mapping(bytes32 => bool) private exists_;

    constructor() public SysComModule("sys_gm_token") {
        /* TODO */
    } 

    function getTokenAddress(bytes32 _symbol) internal view returns (address) {
        /* TODO */
        return address(0);
    }

    function doesTokenExists(bytes32 _symbol) public view returns (bool) {
        /* TODO */
        return true;
    }

    function addToken(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public returns (bool) {
        /* TODO */
        return true;
    }

    function removeTokenContract(bytes32 _symbol) public returns (bool) {
        /* TODO */
        return true;
    }

    function disableTokenContract(bytes32 _symbol) public returns (bool) {
        /* TODO */
        return true;
    }

    function numTokenContracts() public view returns (uint) {
        /* TODO */
        return uint(0);
    }
    
    function getTokenInfoByIndex(uint _index) public constant returns (bytes32, bytes32, bytes32, uint, address) {
        /* TODO */
        return (bytes32(0), bytes32(0), bytes32(0), uint(0), address(0));
    }
}
