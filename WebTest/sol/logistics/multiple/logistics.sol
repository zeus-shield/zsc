/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract LogisticsCore {
    function setup(address _databaseAddr) external;
    function updateTracks(string _num, string _tracks, uint _updateType) external;
    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) external;
    function updateBriefEx(string _num, string _brief) external;
    function remove(string _num) external;
    function invalid(string _num) external;
    function exist(string _num) external view returns (bool);
    function number() external view returns (uint);
    function numberOfTracks(string _num) external view returns (uint);
    function numberOfInvalid(string _num) external view returns (uint);
    function getTracks(string _num) external view returns (string);
    function getBrief(string _num) external view returns (string, string, string, string, string);
    function getBriefEx(string _num) external view returns (string);
    function getBriefByIndex(uint _index) external view returns (string, string, string, string, string);
    function getBriefExByIndex(uint _index) external view returns (string);
    function getBriefInvalid(string _num, uint _invalidIndex) external view returns (string, string, string, string, string);
    function getTracksInvalid(string _num, uint _invalidIndex) external view returns (string);
}

contract Logistics {

    /** @desc core address */
    address private coreAddr_; 

    // Constructor
    constructor() public {
        coreAddr_ = 0;
    }

    modifier _checkCoreAddr() {
        require(0 != coreAddr_);
        _;
    }

    function setup(address _coreAddr) public {
        // check core address
        require(0 != _coreAddr);
        
        coreAddr_ = _coreAddr;
    }
 
    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) public _checkCoreAddr {
        // check param
        require(0 != bytes(_num).length);
        require(0 != bytes(_tracks).length);
        require((0 == _updateType) || (1 == _updateType));

        LogisticsCore(coreAddr_).updateTracks(_num, _tracks, _updateType);
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public _checkCoreAddr {
        // check param
        require(0 != bytes(_num).length);

        LogisticsCore(coreAddr_).updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);
    }

    function updateBriefEx(string _num, string _brief) public _checkCoreAddr {
        // check param
        require(0 != bytes(_num).length);
        require(0 != bytes(_brief).length);

        LogisticsCore(coreAddr_).updateBriefEx(_num, _brief);
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

    function remove(string _num) public _checkCoreAddr {
        // check param
        require(0 != bytes(_num).length);

        LogisticsCore(coreAddr_).remove(_num);
    }

    function invalid(string _num) public _checkCoreAddr {
        // check param
        require(0 != bytes(_num).length);

        LogisticsCore(coreAddr_).invalid(_num);
    }

    function exist(string _num) public view _checkCoreAddr returns (bool) {
        // check param
        if (0 == bytes(_num).length) {
            return false;
        }

        return LogisticsCore(coreAddr_).exist(_num);
    }

    function number() public view _checkCoreAddr returns (uint) {
        return LogisticsCore(coreAddr_).number();
    }

    function numberOfTracks(string _num) public view _checkCoreAddr returns (uint) {
        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        return LogisticsCore(coreAddr_).numberOfTracks(_num);
    }

    function numberOfInvalid(string _num) public view _checkCoreAddr returns (uint) {
        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        return LogisticsCore(coreAddr_).numberOfInvalid(_num);
    }

    function getTracks(string _num) public view _checkCoreAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        return LogisticsCore(coreAddr_).getTracks(_num);
    }

    function getBrief(string _num) public view _checkCoreAddr returns (string, string, string, string, string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", "", "");
        }

        return LogisticsCore(coreAddr_).getBrief(_num);
    }

    function getBriefEx(string _num) public view _checkCoreAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        return LogisticsCore(coreAddr_).getBriefEx(_num);
    }

    function getBriefByIndex(uint _index) public view _checkCoreAddr returns (string, string, string, string, string) {
        return LogisticsCore(coreAddr_).getBriefByIndex(_index);
    }

    function getBriefExByIndex(uint _index) public view _checkCoreAddr returns (string) {
        return LogisticsCore(coreAddr_).getBriefExByIndex(_index);
    }

    function getBriefInvalid(string _num, uint _invalidIndex) public view _checkCoreAddr returns (string, string, string, string, string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", "", "");
        }

        return LogisticsCore(coreAddr_).getBriefInvalid(_num, _invalidIndex);
    }

    function getTracksInvalid(string _num, uint _invalidIndex) public view _checkCoreAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        return LogisticsCore(coreAddr_).getTracksInvalid(_num, _invalidIndex);
    }
}