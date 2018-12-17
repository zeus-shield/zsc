/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../../common/delegate.sol";

contract LogisticsCore {
    function getParcel(string _num) external view returns (string, string, string, string, string);
    function getParcelEx(string _num) external view returns (string);
}

contract LogisticsAnalytics {
    function getParcelAmount(uint8 _direction, uint16 _srcCountry, uint16 _destCountry, uint64 _startTime, uint64 _endTime) external view returns (uint);
    function getParcelAmountArray(uint8 _direction, bool _mulMatch, bytes32[] _condition) external view returns (uint[]);
}

contract Logistics is Delegate {

    /** @desc core contract address */
    address private coreAddr_; 

    /** @desc analytics contract address */
    address private analyticsAddr_;

    constructor() public {
        coreAddr_ = 0;
        analyticsAddr_ = 0;
    }

    modifier _checkCoreAddr() {
        require(0 != coreAddr_);
        _;
    }

    modifier _checkAnalyticsAddr() {
        require(0 != analyticsAddr_);
        _;
    }

    /** [desc] Setup module.
      * [param] _coreAddr: core contract address.
      * [param] _analyticsAddr: analytics contract address.
      * [return] none.
      */
    function setup(address _coreAddr, address _analyticsAddr) external _onlyOwner {
        // check core contract address
        require(0 != _coreAddr);
        require(0 != _analyticsAddr);
        coreAddr_ = _coreAddr;
        analyticsAddr_ = _analyticsAddr;
    }

    /** [desc] Get info of parcel.
      * [param] _num: parcel num.
      * [return] info of parcel.
      */
    function info(string _num) external view _checkCoreAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        return LogisticsCore(coreAddr_).getParcelEx(_num);
    }

    /** [desc] Get number of parcels.
      * [param] _direction: parcel's direction (0: means sent, 1: means received).
      * [param] _srcCountry: country code of parcels sent (0: means all countries).
      * [param] _destCountry: country code of parcels received (0: means all countries).
      * [param] _startTime: start time (0: means ignore time).
      * [param] _endTime: end time (0: means ignore time).
      * [return] number of parcels.
      */
    function number(uint8 _direction, uint16 _srcCountry, uint16 _destCountry, uint64 _startTime, uint64 _endTime) external view _checkAnalyticsAddr returns (uint) {
        // check param
        require((0 == _direction) || (1 == _direction));
        require(_startTime <= _endTime);
        return LogisticsAnalytics(analyticsAddr_).getParcelAmount(_direction, _srcCountry, _destCountry, _startTime, _endTime);
    }

    /** [desc] Get number array of parcels.
      * [param] _direction: parcel's direction (0: means sent, 1: means received).
      * [param] _mulMatch: multiple match flag (false: means parcel only match one condition, true: means parcel match conditions).
      * [param] _condition: condition array.
      * [return] number array of parcels.
      */
    function numbers(uint8 _direction, bool _mulMatch, bytes32[] _condition) external view _checkAnalyticsAddr returns (uint[]) {
        // check param
        require((0 == _direction) || (1 == _direction));
        require(0 < _condition.length);
        return LogisticsAnalytics(analyticsAddr_).getParcelAmountArray(_direction, _mulMatch, _condition);
    }
}