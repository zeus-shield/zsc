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
}