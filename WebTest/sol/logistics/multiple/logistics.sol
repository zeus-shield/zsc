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

        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_tracks).length)
            || ((0 != _updateType) && (1 != _updateType))) {
            return;
        }

        // check core address
        if (0 == coreAddr_) {
            return;
        }

        // check num exist
        if (!numExist_[_num]) {
            return;
        }

        LogisticsCore(coreAddr_).updateTracks(_num, _tracks, _updateType);
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {
        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_transNum).length) || (0 == bytes(_model).length)
            || (0 == bytes(_destinationCountry).length) || (0 == bytes(_lastStatus).length)) {
            return;
        }

        // check core address
        if (0 == coreAddr_) {
            return;
        }

        LogisticsCore(coreAddr_).updateBrief(numExist_[_num], _num, _transNum, _model, _destinationCountry, _lastStatus);

        // check num exist
        if (!numExist_[_num]) {
            numExist_[_num] = true;
        }
    }

    function updateBriefEx(string _num, string _brief) public {
        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_brief).length)) {
            return;
        }

        // check core address
        if (0 == coreAddr_) {
            return;
        }

        LogisticsCore(coreAddr_).updateBriefEx(numExist_[_num], _num, _brief);

        // check num exist
        if (!numExist_[_num]) {
            numExist_[_num] = true;
        }
    }

    function update(string _num, string _transNum, 
                    string _model, string _destinationCountry,
                    string _lastStatus, string _tracks) public {
        // update brief
        updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);

        // update tracks from json(similar to)
        if (0 != bytes(_tracks).length) {
            updateTracks(_num, _tracks, 0);
        }
    }

    function updateEx(string _num, string _info) public {
        // update brief from json(similar to)
        updateBriefEx(_num, _info);

        // update tracks from json(similar to)
        updateTracks(_num, _info, uint(0));
    }

    function remove(string _num) public {
        // check param
        if (0 == bytes(_num).length) {
            return;
        }

        // check core address
        if (0 == coreAddr_) {
            return;
        }

        // check num exist
        if (!numExist_[_num]) {
            return;
        }

        LogisticsCore(coreAddr_).remove(_num);
        numExist_[_num] = false;
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