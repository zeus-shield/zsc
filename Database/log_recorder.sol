/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./Object.sol";

contract LogRecorder is Delegated { 
    struct LogInfo {
        uint nos_;
        mapping(uint => string) logs_;
    }
    mapping(address => bool) listeners_;
    mapping(address => LogInfo) print_log_;

    modifier only_listener(address _adr) {require(listeners_[_adr]); _; }

    function LogRecorder() public Delegated() {}

    function registerListener(address _adr) public only_delegate {
        listeners_[_adr] = true;
    }

    function addLog(string _log) public only_delegate {
        uint index = print_log_[msg.sender].nos_;
        print_log_[msg.sender].nos_++;
        print_log_[msg.sender].logs[index] = _log;
    }

    function printLog(address _adr, uint _index) public only_delegate only_listener(_adr) constant returns (string) {
        return print_log_[_adr].logs_[_index];
    } 
}

