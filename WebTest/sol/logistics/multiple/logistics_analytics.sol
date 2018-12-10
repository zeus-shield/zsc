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
    function getBriefElement(string _num, string _tag) external view returns (string);
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
        // check core and databaseaddress
        require(0 != _coreAddr);
        coreAddr_ = _coreAddr;
    }

    /** [desc] Get first or last track index.
      * [param]  _type: first or last (0 means 'first', 1 means 'last').
      * [param]  _num: last status (0: means ignore last status).
      * [return] parcel amount.
      */
    function _getFirstOrLastTrackIndex(uint8 _type, string _num) private view returns (uint)  {
        uint i = 0;
        uint index = 0;
        uint trackCount = 0;
        uint64 time = 0;

        require(1 >= _type);
        
        trackCount = LogisticsCore(coreAddr_).numberOfTracks(_num);

        if (0 == _type) {
            uint64 timeMin = uint64(-1);
            for (i=0; i<trackCount; i++) {
                time = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(_num, i, "time").toUint());
                if (time < timeMin) {
                    timeMin = time;
                    index = i;
                }
            }
        } else {
            uint64 timeMax = uint64(0);
            for (i=0; i<trackCount; i++) {
                time = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(_num, i, "time").toUint());
                if (time > timeMax) {
                    timeMax = time;
                    index = i;
                }
            }
        }

        return index;
    }
    // type: 0 means 'sent', 1 means 'received'
    function getParcelCountByCountry(uint8 _type, uint16 _country) external view _checkCoreAddr returns (uint)  {
        uint i = 0;
        uint j = 0;
        uint count = 0;

        if (0 == _type) {
            uint64 timeMin = uint64(-1);
            uint64 time = 0;
            uint16 country = 0;
            for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
                // find first track's country
                string  memory num = LogisticsCore(coreAddr_).getNumByIndex(i);
                uint trackCount = LogisticsCore(coreAddr_).numberOfTracks(num);
                for (j=0; j<trackCount; j++) {
                    time = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(num, j, "time").toUint());
                    if (time < timeMin) {
                        country = uint16(LogisticsCore(coreAddr_).getTrackElementByIndex(num, j, "country").toUint());
                        timeMin = time;
                    }
                }

                if (_country == country) {
                    count ++;
                }

            }
        } else if (1 == _type) {
            string memory originalNum = "";
            string memory transNum = "";
            string memory model = "";
            uint16 destinationCountry = 0;
            uint8 lastStatus = 0;
            for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
                (originalNum, transNum, model, destinationCountry, lastStatus) = LogisticsCore(coreAddr_).getBriefByIndex(i);
                if (_country == destinationCountry) {
                    count ++;
                }
            }
        } else {}

        return count;
    }
}