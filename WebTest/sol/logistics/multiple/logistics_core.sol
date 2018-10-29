/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.21;
// pragma experimental ABIEncoderV2;

import "../../utillib/LibString.sol";
import "../../utillib/LibInt.sol";

contract LogisticsCore {

    using LibString for *;
    using LibInt for *;

    struct Track {
        string type_;
        string time_;
        string country_;
        string city_;
        string facilityName_;
        string timeZone_;
        string desc_;
        string actionCode_;
    }

    struct Brief {
        string transNum_;
        string model_;
        string destinationCountry_;
        string lastStatus_;
    }
}