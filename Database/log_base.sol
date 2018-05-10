/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract LogBase is Delegated {
    function addLog(string _log, bool _newLine) public;
    function printLog(address _addr, uint _index) public constant returns (string);
}
