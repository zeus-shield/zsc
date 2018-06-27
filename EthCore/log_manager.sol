/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";
import "./log_transaction.sol";
import "./delegate.sol";

contract LogManager is Delegated {

    struct Listener {
        address log_instance_;
        bytes32 name_;
        bool registered_;
    }
    
    // listener address list
    address[] addrs_;

    // listener address => listener info
    mapping(address => Listener)listeners_;

    function LogManager() public Delegated() {}

    function kill() public {
        // check delegate
        checkDelegate(msg.sender, 1);

        for(uint i=0; i<addrs_.length; i++ ) {
            if(0 != addrs_[i])
            {
                if(0 != listeners_[addrs_[i]].log_instance_)
                {
                    Delegated(listeners_[addrs_[i]].log_instance_).kill();
                }
                delete listeners_[addrs_[i]];
            }
        }
        
        delete addrs_;
        super.kill();
    }

    function registerListener(uint _type, address _addr, bytes32 _name) public {
        address instance = address(0);

        // check param
        require(0 != _addr);

        // check delegate
        checkDelegate(msg.sender, 1);

        // check registered
        if(listeners_[_addr].registered_) {
            return;
        }

        if(0 == _type) {
            instance = new LogTransaction();
        }
        else if(_type == 1) {
            //instance = new LogUser();
        }
        else if(_type == 2) {
            // TODO
        }
        else {
            require(false);
        }

        require(0 != instance);

        addrs_.push(_addr);
        
        listeners_[_addr].log_instance_ = instance;
        listeners_[_addr].name_ = _name;
        listeners_[_addr].registered_ = true;

        LogBase(instance).initLog(_name);
    }

    function addLog(string _log, bool _newLine) public {

        // check registered
        require(listeners_[msg.sender].registered_);

        // check instance
        require(0 != listeners_[msg.sender].log_instance_);

        LogBase(listeners_[msg.sender].log_instance_).addLog(_log, _newLine);
    }
    
    function printLog(address _addr, uint _index) public view returns (string) {
        // check param
        require(0 != _addr);

        // check delegate
        checkDelegate(msg.sender, 1);

        // check registered
        require(listeners_[_addr].registered_);

        // check instance
        require(0 != listeners_[_addr].log_instance_);

        return LogBase(listeners_[msg.sender].log_instance_).printLog(_index);
    }

    function printLogByTime(address _addr, uint _startTime, uint _endTime) public view returns (string) {
        // check param
        require(0 != _addr);

        // check delegate
        checkDelegate(msg.sender, 1);

        // check registered
        require(listeners_[_addr].registered_);

        // check instance
        require(0 != listeners_[_addr].log_instance_);

        return LogBase(listeners_[msg.sender].log_instance_).printLogByTime(_startTime, _endTime);
    }
}
