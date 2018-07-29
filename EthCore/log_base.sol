/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

/** @title Log base. */
contract LogBase is Delegated {

    /** @dev Initialize log moudule.
      * @param _name(bytes32): Module name.
      * @return none.
      */
    function initLog(bytes32 _name) public;

    /** @dev Add log.
      * @param _log(string): Content of the log.
      * @param _newLine(bool): If new line or not.
      * @return none.
      */
    function addLog(string _log, bool _newLine) public;

    /** @dev Print log.
      * @param _index(uint): Index of the log.
      * @return none.
      */
    function printLog(uint _index) public view returns (string);

    /** @dev Print log by time.
      * @param _startTime(uint): Start time of the log.
      * @param _endTime(uint): End time of the log.
      * @return none.
      */
    function printLogByTime(uint _startTime, uint _endTime) public view returns (string);
}
