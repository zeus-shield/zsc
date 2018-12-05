/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../../utillib/LibString.sol";
// import "../../utillib/LibInt.sol";
// import "../../common/delegate.sol";


contract logisticsAnalytics {

    using LibString for *;
    // using LibInt for *;

    /** @desc core address */
    address private coreAddr_; 

    // Constructor
    constructor() public {
        coreAddr_ = 0;
    }

}