/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";
import "./log_transaction.sol";
import "./delegate.sol";

/** @title Log manager. */
contract LogManager is Delegated {

    // listener info
    struct Listener {
        // log instance address
        address log_instance_;
        // module name
        bytes32 name_;
        // register flag
        bool registered_;
    }
    
    // listener address list
    address[] addrs_;

    // listener address => listener info
    mapping(address => Listener)listeners_;

    // constructor
    function LogManager() public Delegated() {}

    /** @dev Kill log manager.
      * @param none.
      * @return none.
      */
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

    /** @dev Register listener.
      * @param _type(uint): Type of the listener.
      * @param _addr(address): Address of the listener.
      * @param _name(bytes32): Module name.
      * @return none.
      */
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

    /** @dev Add log.
      * @param _log(string): Content of the log.
      * @param _newLine(bool): If new line or not.
      * @return none.
      */
    function addLog(string _log, bool _newLine) public {

        // check registered
        require(listeners_[msg.sender].registered_);

        // check instance
        require(0 != listeners_[msg.sender].log_instance_);

        LogBase(listeners_[msg.sender].log_instance_).addLog(_log, _newLine);
    }

    /** @dev Print log.
      * @param _addr(address): Address of the listener..
      * @param _index(uint): Index of the log.
      * @return none.
      */
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

    /** @dev Print log by time.
      * @param _addr(address): Address of the listener..
      * @param _startTime(uint): Start time of the log.
      * @param _endTime(uint): End time of the log.
      * @return none.
      */
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
