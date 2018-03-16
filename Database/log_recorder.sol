/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./Object.sol";

contract LogRecorder is Delegated { 
    mapping(address => bool) listeners_;
    mapping(address => string) print_log_;

    modifier only_listener(address _adr) {require(listeners_[_adr]); _; }

    function registerListener(address _adr) public only_delegate {
        listeners_[_adr] = true;
    }

    function addLog(string _log) public only_delegate {
        print_log_[msg.sender] = PlatString.append(print_log_[msg.sender], _log);
    }

    function printLog(address _adr) public only_delegate only_listener(_adr) constant returns (string) {
        return print_log_[_adr];
    } 
}

