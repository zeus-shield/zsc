/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../../utillib/LibString.sol";
// import "../../utillib/LibInt.sol";
// import "../../common/delegate.sol";

contract LogisticsCore {
    function number() external view returns (uint);
    function numberOfTracks(string _num) external view returns (uint);
    function getNumByIndex(uint _index) external view returns (string);
    function getTrackElementByIndex(string _num, uint _index, string _elementType) external view returns (string);
    function getBriefByIndex(uint _index) external view returns (string, string, string, uint16, uint8);
}

contract logisticsAnalytics {

    using LibString for *;
    // using LibInt for *;

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
    }

    // type: 0 means 'sent', 1 means 'received'
    function getParcelCountByCountry(uint8 _type, uint16 _country) external view _checkCoreAddr returns (uint)  {
}