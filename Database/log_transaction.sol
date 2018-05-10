/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./log_base.sol";

contract LogTransaction is LogBase, Delegated {

    constructor() public {}

    function addLog(string _log, bool _newLine) public {
        /* TODO */
    }
    
    function printLog(address _addr, uint _index) public view returns (string) {
        /* TODO */
        string memory str = "TODO"; 
        return str;
    }
}
