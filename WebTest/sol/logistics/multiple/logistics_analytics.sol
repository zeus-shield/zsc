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

    /** @desc actionCode maping
      * @eg GTMS_SIGNED => 28
      */
    mapping(string => uint8) private actionCodes_;

    // Constructor
    constructor() public {
        coreAddr_ = 0;
    }

    modifier _checkCoreAddr() {
        require(0 != coreAddr_);
        _;
    }

    /** [desc] Get first or last track index.
      * [param]  _type: first or last (0 means 'first', 1 means 'last').
      * [param]  _num: logistics num.
      * [return] track index.
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

    /** [desc] Get dest country's received parcel amounts.
      * [param] _destCountry: country code of parcels received (> 0).
      * [param] _startTime: start time (0: means ignore time).
      * [param] _endTime: end time (0: means ignore time).
      * [return] parcel amounts.
      */
    function _getParcelAmountByDestCountry(uint16 _destCountry, uint64 _startTime, uint64 _endTime) private view returns (uint)  {
        uint i = 0;
        uint index = 0;
        uint amount = 0;
        uint8 lastStatus = 0;
        uint16 destCountry = 0;
        uint64 lastTrackTime = 0;
        string memory num = "";

        // check param
        if ((0 == _destCountry) || (_startTime > _endTime)) {
            return 0;
        }

        for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
            num = LogisticsCore(coreAddr_).getNumByIndex(i);
            lastStatus = uint8(LogisticsCore(coreAddr_).getBriefElement(num, "lastStatus").toUint());
            destCountry = uint16(LogisticsCore(coreAddr_).getBriefElement(num, "destinationCountry").toUint());
            index = _getFirstOrLastTrackIndex(1, num);
            lastTrackTime = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(num, index, "time").toUint());

            if ((destCountry == _destCountry) && (actionCodes_["GTMS_SIGNED"] == lastStatus)) {
                if ((0 == _startTime) && (0 == _endTime)) {
                    // ignore time
                    amount ++;
                } else {
                    // _startTime <= lastTrackTime <= _endTime
                    if ((_startTime <= lastTrackTime) && (_endTime >= lastTrackTime)) {
                        amount ++;
                    }
                }
            }
        }

        return amount;
    }

    /** [desc] Get src country's sent parcel amounts.
      * [param] _srcCountry: country code of parcels sent (> 0).
      * [param] _startTime: start time (0: means ignore time).
      * [param] _endTime: end time (0: means ignore time).
      * [return] parcel amounts.
      */
    function _getParcelAmountBySrcCountry(uint16 _srcCountry, uint64 _startTime, uint64 _endTime) private view returns (uint)  {
        uint i = 0;
        uint index = 0;
        uint amount = 0;
        uint16 srcCountry = 0;
        uint64 firstTrackTime = 0;
        string memory num = "";

        // check param
        if ((0 == _srcCountry) || (_startTime > _endTime)) {
            return 0;
        }

        for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
            num = LogisticsCore(coreAddr_).getNumByIndex(i);
            index = _getFirstOrLastTrackIndex(0, num);
            firstTrackTime = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(num, index, "time").toUint());
            srcCountry = uint16(LogisticsCore(coreAddr_).getTrackElementByIndex(num, index, "country").toUint());

            if (srcCountry == _srcCountry) {
                if ((0 == _startTime) && (0 == _endTime)) {
                    // ignore time
                    amount ++;
                } else {
                    // _startTime <= firstTrackTime <= _endTime
                    if ((_startTime <= firstTrackTime) && (_endTime >= firstTrackTime)) {
                        amount ++;
                    }
                }
            }
        }

        return amount;
    }

    /** [desc] Get parcel amounts by countries.
      * [param] _srcCountry: country code of parcels sent (> 0).
      * [param] _destCountry: country code of parcels received (> 0).
      * [param] _startTime: start time (0: means ignore time).
      * [param] _endTime: end time (0: means ignore time).
      * [return] parcel amounts.
      */
    function _getParcelAmountByCountry(uint16 _srcCountry, uint16 _destCountry, uint64 _startTime, uint64 _endTime) private view returns (uint)  {
        uint i = 0;
        uint index = 0;
        uint amount = 0;
        uint8 lastStatus = 0;
        uint16 srcCountry = 0;
        uint16 destCountry = 0;
        uint64 firstTrackTime = 0;
        uint64 lastTrackTime = 0;
        string memory num = "";

        // check param
        if ((0 == _srcCountry) || (0 == _destCountry) || (_startTime > _endTime)) {
            return 0;
        }

        for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
            num = LogisticsCore(coreAddr_).getNumByIndex(i);
            
            index = _getFirstOrLastTrackIndex(0, num);
            firstTrackTime = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(num, index, "time").toUint());
            srcCountry = uint16(LogisticsCore(coreAddr_).getTrackElementByIndex(num, index, "country").toUint());

            lastStatus = uint8(LogisticsCore(coreAddr_).getBriefElement(num, "lastStatus").toUint());
            destCountry = uint16(LogisticsCore(coreAddr_).getBriefElement(num, "destinationCountry").toUint());
            index = _getFirstOrLastTrackIndex(1, num);
            lastTrackTime = uint64(LogisticsCore(coreAddr_).getTrackElementByIndex(num, index, "time").toUint());

            if ((srcCountry == _srcCountry)
                && (destCountry == _destCountry)
                && (actionCodes_["GTMS_SIGNED"] == lastStatus)) {
                if ((0 == _startTime) && (0 == _endTime)) {
                    // ignore time
                    amount ++;
                } else {
                    // _startTime <= firstTrackTime <= _endTime
                    // _startTime <= lastTrackTime <= _endTime
                    if ((_startTime <= firstTrackTime)
                        && (_endTime >= firstTrackTime)
                        && (_startTime <= lastTrackTime)
                        && (_endTime >= lastTrackTime)) {
                        amount ++;
                    }
                }
            }
        }

        return amount;
    }

    function setup(address _coreAddr) external {
        // check core and databaseaddress
        require(0 != _coreAddr);
        coreAddr_ = _coreAddr;
    }

    function setActionCode(string _tag, uint8 _value) external {
        actionCodes_[_tag] = _value;
    }
    /** [desc] Get parcel amount.
      * [param] _srcCountry: country code of parcels sent (0: means all countries).
      * [param] _destCountry: country code of parcels received (0: means all countries).
      * [param] _startTime: start time (0: means ignore time).
      * [param] _endTime: end time (0: means ignore time).
      * [return] parcel amount.
      */
    function getParcelAmount(uint16 _srcCountry, uint16 _destCountry, uint64 _startTime, uint64 _endTime) external view _checkCoreAddr returns (uint)  {
        uint amount = 0;

        if (0 == _srcCountry) {
            if (0 == _destCountry) {
                if ((0 == _startTime) && (0 == _endTime)) {
                    // all parcel amounts
                    amount = LogisticsCore(coreAddr_).number();
                } else {
                    // TODO
                    return 0;
                }
            } else {
                // dest country's received parcel amounts
                amount = _getParcelAmountByDestCountry(_destCountry, _startTime, _endTime);
            }
        } else {
            if (0 == _destCountry) {
                // src country's sent parcel amounts
                amount = _getParcelAmountBySrcCountry(_srcCountry, _startTime, _endTime);
            } else {

            }
        }

        return amount;
    }

    // _type: 0 means 'sent', 1 means 'received'
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