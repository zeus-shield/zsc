/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract LogisticsCore {
    function exist(string _num) external view returns (bool);
    function number() external view returns (uint);
    function numberOfTracks(string _num) external view returns (uint);
    function getTracks(string _num) external view returns (string);
    function getBrief(string _num) external view returns (string, string, string, string, string);
    function getBriefEx(string _num) external view returns (string);
    function getBriefByIndex(uint _index) external view returns (string, string, string, string, string);
    function getBriefExByIndex(uint _index) external view returns (string);
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

    function setup(address _coreAddr) external {
        // check core address
        require(0 != _coreAddr);
        
        coreAddr_ = _coreAddr;
    }
 
    function exist(string _num) external view _checkCoreAddr returns (bool) {
        // check param
        if (0 == bytes(_num).length) {
            return false;
        }

        return LogisticsCore(coreAddr_).exist(_num);
    }

    function number() external view _checkCoreAddr returns (uint) {
        return LogisticsCore(coreAddr_).number();
    }

    function numberOfTracks(string _num) external view _checkCoreAddr returns (uint) {
        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        return LogisticsCore(coreAddr_).numberOfTracks(_num);
    }

    function getTracks(string _num) external view _checkCoreAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        return LogisticsCore(coreAddr_).getTracks(_num);
    }

    function getBrief(string _num) external view _checkCoreAddr returns (string, string, string, string, string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", "", "");
        }

        return LogisticsCore(coreAddr_).getBrief(_num);
    }

    function getBriefEx(string _num) external view _checkCoreAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        return LogisticsCore(coreAddr_).getBriefEx(_num);
    }

    function getBriefByIndex(uint _index) external view _checkCoreAddr returns (string, string, string, string, string) {
        return LogisticsCore(coreAddr_).getBriefByIndex(_index);
    }

    function getBriefExByIndex(uint _index) external view _checkCoreAddr returns (string) {
        return LogisticsCore(coreAddr_).getBriefExByIndex(_index);
    }
}