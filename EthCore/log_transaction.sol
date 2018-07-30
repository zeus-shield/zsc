/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";

contract LogTransaction is LogBase {

    // log info
    struct LogInfo {
        // current time
        uint now_;
        // information
        string info_;
    }

    // module name
    bytes32 name_;
    // number of log
    uint nos_;
    // index => log info
    mapping(uint => LogInfo) log_;

    // constructor
    function LogTransaction() public LogBase() {}

    function initLog(bytes32 _name) external {
        // check sender
        checkDelegate(msg.sender, 1);

        name_ = _name;
        nos_ = 0;
    }

    function addLog(string _log, bool _newLine) external {
        // check sender
        checkDelegate(msg.sender, 1);

        if(true == _newLine && 0 < nos_) {
            nos_++;
            log_[nos_].info_ = _log;

        } else {
            log_[nos_].info_ = PlatString.append(log_[nos_].info_, _log);
        }
        log_[nos_].now_ = now;
    }
    
    function printLog(uint _index) external view returns (string) {
        // check sender
        checkDelegate(msg.sender, 1);

        // check param
        if(_index > nos_ ) 
            return "null";

        string memory str = PlatString.bytes32ToString(name_);
        str = PlatString.append("[", str, "] ", log_[_index].info_);
        return str;
    }

    function printLogByTime(uint _startTime, uint _endTime) external view returns (string) {
        // check param
        checkDelegate(msg.sender, 1);

        // check param
        require(_endTime > _startTime);

        string memory str = PlatString.bytes32ToString(name_);
        str = PlatString.append("[", str, "]\n");
        for(uint i=0; i<=nos_; i++) {
            if(_startTime <= log_[i].now_  && _endTime >= log_[i].now_) {
                string memory time = PlatString.uintToString(log_[i].now_);
                str = PlatString.append(str, "[", time, "] ", log_[i].info_);
                str = PlatString.append(str, "\n");
            }
        }
        return str;
    }
}
