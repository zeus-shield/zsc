/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";

contract LogTransaction is LogBase {

    struct LogInfo {
        uint nos_;
        mapping(uint => string) logs_;
    }

    LogInfo print_log_;

    constructor() public Delegated() {}

    function initLog() public {
        checkDelegate(msg.sender, 1);

        print_log_.nos_ = 1;
        print_log_.logs_[0] = "registered";
    }

    function addLog(string _log, bool _newLine) public {        
        /* TODO */
    }
    
    function printLog(address _addr, uint _index) public view returns (string) {
        /* TODO */
        string memory str = "TODO"; 
        return str;
    }
}
