/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract LogRecorder is Delegated { 
    struct LogInfo {
        uint nos_;
        bytes32 name_;
        mapping(uint => string) logs_;
    }
    mapping(address => bool) listeners_;
    mapping(address => LogInfo) public print_log_;

    function LogRecorder() public Delegated() {}

    function checkListener(address _adr) internal constant {
        require(listeners_[_adr]);
    }

    function registerListener(address _adr, bytes32 _name) public {
        checkDelegate(msg.sender, 1);

        listeners_[_adr] = true;
        print_log_[_adr].name_ = _name;
        print_log_[_adr].nos_ = 1;
        print_log_[_adr].logs_[0] = "registered";
    }

    function addLog(string _log, bool _newLine) public  {
        checkListener(msg.sender);
        
        uint index = print_log_[msg.sender].nos_ - 1;
        if (_newLine == true) {
            print_log_[msg.sender].nos_++;
            print_log_[msg.sender].logs_[index + 1] = _log;
        } else {
            print_log_[msg.sender].logs_[index] = PlatString.append(print_log_[msg.sender].logs_[index], _log);
        }
    }

    function printLog(address _adr, uint _index) public constant returns (string) {
        checkDelegate(msg.sender, 1);
        checkListener(_adr);

        if (_index >= print_log_[_adr].nos_ ) 
            return "null";

        string memory str = PlatString.bytes32ToString(print_log_[_adr].name_);
        str = PlatString.append("[", str, "] ", print_log_[_adr].logs_[_index]);
        return str;
    } 
}

