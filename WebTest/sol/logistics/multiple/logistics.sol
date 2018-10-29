/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.21;
// pragma experimental ABIEncoderV2;

contract LogisticsCore {
    function updateTracks(string _num, string _tracks, uint _updateType) public;
    function updateBrief(bool _numExist, string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public;
    function updateBriefEx(bool _numExist, string _num, string _brief) public;
    function remove(string _num) public;
    function invalid(string _num) public;
    function number() public view returns (uint);
    function numberOfTracks(string _num) public view returns (uint);
    function numberOfInvalid(string _num) public view returns (uint);
}

contract Logistics {

    /** @desc core address */
    address private coreAddr_; 

    /** @desc string(original num name) => bool(num exist flag) */
    mapping(string => bool) private numExist_;
}