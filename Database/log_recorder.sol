/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./Object.sol";

contract LogRecorder is Delegated { 
    struct LogInfo {
        uint nos_;
        bytes32 name_;
        mapping(uint => string) logs_;
    }
    mapping(address => bool) listeners_;
    mapping(address => LogInfo) print_log_;

    modifier only_listener(address _adr) {require(listeners_[_adr]); _; }

    function LogRecorder() public Delegated() {}

    
    function registerListener(address _adr, bytes32 _name) public only_delegate {
        listeners_[_adr] = true;
        print_log_[_adr].name_ = _name;
    }

    function addLog(string _log, bool _newLine) public only_listener(msg.sender) {
        uint index = print_log_[msg.sender].nos_;
        if (index == 0) {
                print_log_[msg.sender].logs_[index] = _log;
        } else {
            if (_newLine == false) {
                print_log_[msg.sender].logs_[index] = PlatString.append(print_log_[msg.sender].logs_[index], _log);
            } else {
                print_log_[msg.sender].nos_++;
                print_log_[msg.sender].logs_[index + 1] = _log;
            }
        }
    }

    function printLog(address _adr, uint _index) public only_listener(_adr) constant returns (string) {
        if (isDelegate(_adr) == false || _index >= print_log_[msg.sender].nos_ ) 
            return "null";

        string memory str = PlatString.bytes32ToString(print_log_[_adr].name_);
        str = PlatString.append(str, print_log_[_adr].logs_[_index]);
        return str;
    } 
}

