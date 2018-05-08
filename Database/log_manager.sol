/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";
import "./delegate.sol";

contract LogManager is Delegated {
    
    struct Listener {
        address log_instance_;
        bytes32 name_;
        bool registered;
    }
    
    mapping(address => Listener)listeners_;
 
 	constructor() public Delegated() {}

    function registerListener(uint _type, address _addr, bytes32 _name) public {
 		/* TODO */
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
