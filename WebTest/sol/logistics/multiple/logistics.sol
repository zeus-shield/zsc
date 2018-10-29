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

    // Constructor
    function Logistics() public {
        coreAddr_ = 0;
    }

    function setup(address _coreAddr) public {
        coreAddr_ = _coreAddr;
    }
 
    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) public {
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {
    }

    function updateBriefEx(string _num, string _brief) public {
    }

    function update(string _num, string _transNum, 
                    string _model, string _destinationCountry,
                    string _lastStatus, string _tracks) public {
    }

    function updateEx(string _num, string _info) public {
    }

    function remove(string _num) public {
    }

    function invalid(string _num) public {
    }

    function exist(string _num) public view returns (bool) {
    }

    function number() public view returns (uint) {
    }

    function numberOfTracks(string _num) public view returns (uint) {
    }

    function numberOfInvalid(string _num) public view returns (uint) {
    }
}