/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.21;
// pragma experimental ABIEncoderV2;

contract LogisticsTrack {

    // Constructor
    function LogisticsTrack() public {}

    // _updateType: 0 means overwrite, 1 means add
    function updateTracks(string _num, string _tracks, uint _updateType) public {}

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {}

    function updateBriefEx(string _brief) public {}

    function update(string _num, string _transNum, 
                    string _model, string _destinationCountry,
                    string _lastStatus, string _tracks) public {}

    function updateEx(string _info) public {}

    function remove(string _num) public {}

    function invalid(string _num) public {}

    function getTracks(string _num) public view returns (string) {}

    function getBrief(string _num) public view returns (string, string, string, string, string) {}

    function getBriefEx(string _num) public view returns (string) {}

    function getBriefByIndex(uint _index) public view returns (string, string, string, string, string) {}

    function getBriefExByIndex(uint _index) public view returns (string) {}

    function exist(string _num) public view returns (bool) {}

    function number() public view returns (uint) {}

    function numberOfTracks(string _num) public view returns (uint) {}

    // for invalid debug
    function numberOfInvalidNums(string _num) public view returns (uint) {}

    function getBriefInvalid(string _num, uint _invalidIndex) public view returns (string, string, string, string, string) {}

    function getTracksInvalid(string _num, uint _invalidIndex) public view returns (string) {}
}