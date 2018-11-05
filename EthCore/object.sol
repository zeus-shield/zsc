/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract Recorder {
    function addLog(string _log, bool _newLine) public;
    function getRandomNumber(uint _min, uint _max) public returns (uint);
}

contract Object is Delegated {
    bytes32 private name_ = "null";
    address public logRecorder_ = 0;

    // Constructor
    function Object(bytes32 _name) public { 
        name_ = _name;
    }

    function objName() public view returns (bytes32) { 
        return name_;
    }

    function setLogRecorder(address _rocorderAdr) public {
        checkDelegate(msg.sender, 1);
        logRecorder_ = _rocorderAdr;
    }

    function addLog(string _log, bool _newLine) internal {
        if (logRecorder_ != 0) {
            Recorder(logRecorder_).addLog(_log, _newLine);
        }
    }  
    
    function random(uint _min, uint _max) internal returns (uint) {
        require(logRecorder_ != address(0));
        return Recorder(logRecorder_).getRandomNumber(_min, _max);
    }
    
}
