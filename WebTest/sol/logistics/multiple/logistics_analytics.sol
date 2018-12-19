/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../../utillib/LibString.sol";
import "../../common/delegate.sol";

contract LogisticsCore {
    function number() external view returns (uint);
    function numberOfTracks(string _num) external view returns (uint);
    function getNumByIndex(uint _index) external view returns (string);
    function getTrackElement(string _num, uint _index, string _tag) external view returns (string);
    function getBriefElementByIndex(uint _index, string _tag) external view returns (string);
}

contract LogisticsAnalytics is Delegate {

    using LibString for *;

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

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    /** [desc] Get first or last track index.
      * [param] _num: logistics parcel num.
      * [param] _position: track position (0: means first track, 1: means last track).
      * [return] track index.
      */
    function _getTrackIndex(string _num, uint8 _position) private view returns (uint) {
        uint i = 0;
        uint index = 0;
        uint trackCount = 0;
        uint64 time = 0;

        // check param
        // require((0 == _position) || (1 == _position));
        
        trackCount = LogisticsCore(coreAddr_).numberOfTracks(_num);

        // first track
        if (0 == _position) {
            uint64 timeMin = uint64(-1);
            for (i=0; i<trackCount; i++) {
                time = uint64(LogisticsCore(coreAddr_).getTrackElement(_num, i, "time").toUint());
                if (time < timeMin) {
                    timeMin = time;
                    index = i;
                }
            }
        } else { // last track
            uint64 timeMax = uint64(0);
            for (i=0; i<trackCount; i++) {
                time = uint64(LogisticsCore(coreAddr_).getTrackElement(_num, i, "time").toUint());
                if (time > timeMax) {
                    timeMax = time;
                    index = i;
                }
            }
        }

        return index;
    }

    /** [desc] Get parcel's track info (first and last track).
      * [param] _index: parcel index.
      * [param] _position: track position (0: means first track, 1: means last track).
      * [param] _tag: element tag.
      * [return] true/false.
      */
    function _getParcelTrackElement(uint _index, uint8 _position, string _tag) private view returns (string) {
        // check param
        require((0 == _position) || (1 == _position));
        string memory num = LogisticsCore(coreAddr_).getNumByIndex(_index);
        uint trackIndex = _getTrackIndex(num, _position);
        return LogisticsCore(coreAddr_).getTrackElement(num, trackIndex, _tag);
    }

    /** [desc] Check if parcel has been sent or received.
      * [param] _direction: parcel's direction (0: means sent, 1: means received).
      * [param] _index: parcel index.
      * [return] true/false.
      */
    function _checkValid(uint8 _direction, uint _index) private view returns (bool) {
        if (0 == _direction) {
            // Parcel has been sent ?
            string memory num = LogisticsCore(coreAddr_).getNumByIndex(_index);
            uint trackCount = LogisticsCore(coreAddr_).numberOfTracks(num);
            if (0 < trackCount) {
                return true;
            } else {
                return false;
            }
        } else {
            // Parcel has been received ?
            // 1. lastStatus == 'GTMS_SIGNED'
            // 2. lastActionCode == 'GTMS_SIGNED'
            // 3. lastCountry == destCountry
            uint8 lastStatus = uint8(LogisticsCore(coreAddr_).getBriefElementByIndex(_index, "lastStatus").toUint());
            uint16 destCountry = uint16(LogisticsCore(coreAddr_).getBriefElementByIndex(_index, "destinationCountry").toUint());
            uint8 lastActionCode = uint8(_getParcelTrackElement(_index, 1, "actionCode").toUint());
            uint16 lastCountry = uint16(_getParcelTrackElement(_index, 1, "country").toUint());
            if ((actionCodes_["GTMS_SIGNED"] == lastStatus)
                && (lastStatus == lastActionCode)
                && (destCountry == lastCountry)) {
                return true;
            } else {
                return false;
            }           
        }
    }

    /** [desc] Check if parcel's sent or last time is valid ?
      * [param] _direction: parcel's direction (0: means sent, 1: means received).
      * [param] _index: parcel index.
      * [param] _startTime: start time (> 0).
      * [param] _endTime: end time (> 0).
      * [return] true/false.
      */
    function _checkTime(uint8 _direction, uint _index, uint64 _startTime, uint64 _endTime) private view returns (bool) {
        uint8 position = 0;
        uint64 time = 0;

        if (0 == _direction) {
            // first track
            position = 0;
        } else {
            // last track
            position = 1;
        }

        // _startTime <= time <= _endTime
        time = uint64(_getParcelTrackElement(_index, position, "time").toUint());
        if ((_startTime <= time) && (_endTime >= time)) {
            return true;
        } else {
            return false;
        }
    }

    /** [desc] Parse condition.
      * [param] _condition: condition array.
      * [return] src/dest country and start/end time array.
      */
    function _parseCondition(bytes32[] _condition) private pure returns (uint16[], uint16[], uint64[], uint64[]) {
        uint16[] memory src = new uint16[](_condition.length);
        uint16[] memory dest = new uint16[](_condition.length);
        uint64[] memory startTime = new uint64[](_condition.length);
        uint64[] memory endTime = new uint64[](_condition.length);

        for (uint i=0; i<_condition.length; i++) {
            src[i] = uint16(_condition[i] >> (256-16));
            dest[i] = uint16(_condition[i] >> (256-16-16));
            startTime[i] = uint64(_condition[i] >> (256-16-16-64));
            endTime[i] = uint64(_condition[i] >> (256-16-16-64-64));
        }

        return (src, dest, startTime, endTime);
    }

    /** [desc] Setup module.
      * [param] _coreAddr: logistics core contract address.
      * [return] none.
      */
    function setup(address _coreAddr) external _onlyOwner {
        // check core and databaseaddress
        require(0 != _coreAddr);
        coreAddr_ = _coreAddr;
    }

    /** [desc] Set action code.
      * [param] _tag: action code tag.
      * [param] _value: action code value.
      * [return] none.
      */
    function setActionCode(string _tag, uint8 _value) external _onlyAdminOrHigher {
        actionCodes_[_tag] = _value;
    }

    /** [desc] Get logistics core contract address.
      * [param] none.
      * [return] logistics core contract address.
      */
    function getCoreAddr() external view returns (address) {
        return coreAddr_;
    }

    /** [desc] Get action code.
      * [param] _tag: action code tag.
      * [return] action code value.
      */
    function getActionCode(string _tag) external view returns (uint8) {
        return actionCodes_[_tag];
    }

    /** [desc] Get parcel's amount.
      * [param] _direction: parcel's direction (0: means sent, 1: means received).
      * [param] _srcCountry: country code of parcels sent (0: means all countries).
      * [param] _destCountry: country code of parcels received (0: means all countries).
      * [param] _startTime: start time (0: means ignore time).
      * [param] _endTime: end time (0: means ignore time).
      * [return] parcel amount.
      */
    function getParcelAmount(uint8 _direction, uint16 _srcCountry, uint16 _destCountry, uint64 _startTime, uint64 _endTime) external view _checkCoreAddr returns (uint) {
        uint i = 0;
        uint amount = 0;
        uint16 srcCountry = 0;
        uint16 destCountry = 0;

        // check param
        require((0 == _direction) || (1 == _direction));
        require(_startTime <= _endTime);

        for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
            if(_checkValid(_direction, i)) {
                srcCountry = uint16(_getParcelTrackElement(i, 0, "country").toUint());
                destCountry = uint16(LogisticsCore(coreAddr_).getBriefElementByIndex(i, "destinationCountry").toUint());
                // 1. all -> all
                // 2. all -> dest
                // 3. src -> all
                // 4. src -> dest
                if (((0 == _srcCountry) && (0 == _destCountry))
                    || ((0 == _srcCountry) && (0 != _destCountry) && (_destCountry == destCountry))
                    || ((0 != _srcCountry) && (0 == _destCountry) && (_srcCountry == srcCountry))
                    || ((0 != _srcCountry) && (0 != _destCountry) && (_srcCountry == srcCountry) && (_destCountry == destCountry))) {
                    if ((0 == _startTime) && (0 == _endTime)) {
                        amount ++;
                    } else {
                        if (_checkTime(_direction, i, _startTime, _endTime)) {
                            amount ++;
                        }
                    }
                }
            }
        }
        return amount;
    }

    /** [desc] Get parcel's amount array.
      * [param] _direction: parcel's direction (0: means sent, 1: means received).
      * [param] _mulMatch: multiple match flag (false: means parcel only match one condition, true: means parcel match conditions).
      * [param] _condition: condition array.
      *         srcCountry(uint16) + destCountry(uint16) + startTime(uint64) + endTime(uint64)
      *         eg. srcCountry(Russia: 0x0283) +
      *             destCountry(China: 0x009c) +
      *             startTime(2018-12-31 23:59:59: 0x000000005c015e80) +
      *             endTime(2018-12-01 00:00:00: 0x000000005c2a3cff)
      *             0x0283009c000000005c015e80000000005c2a3cff
      * [return] parcel amount array.
      */
    function getParcelAmountArray(uint8 _direction, bool _mulMatch, bytes32[] _condition) external view _checkCoreAddr returns (uint[]) {
        uint i = 0;
        uint j = 0;
        uint length = _condition.length;
        uint16 srcCountry = 0;
        uint16 destCountry = 0;
        uint[] memory amount = new uint[](length);
        uint16[] memory src;
        uint16[] memory dest;
        uint64[] memory startTime;
        uint64[] memory endTime;

        // check param
        require((0 == _direction) || (1 == _direction));
        require(0 < length);

        // parse condition
        (src, dest, startTime, endTime) = _parseCondition(_condition);

        for (i=0; i<length; i++) {
            require(startTime[i] <= endTime[i]);
        }

        for (i=0; i<LogisticsCore(coreAddr_).number(); i++) {
            if(_checkValid(_direction, i)) {
                srcCountry = uint16(_getParcelTrackElement(i, 0, "country").toUint());
                destCountry = uint16(LogisticsCore(coreAddr_).getBriefElementByIndex(i, "destinationCountry").toUint());
                // 1. all -> all
                // 2. all -> dest
                // 3. src -> all
                // 4. src -> dest
                for (j=0; j<length; j++) {
                    if (((0 == src[j]) && (0 == dest[j]))
                    || ((0 == src[j]) && (0 != dest[j]) && (dest[j] == destCountry))
                    || ((0 != src[j]) && (0 == dest[j]) && (src[j] == srcCountry))
                    || ((0 != src[j]) && (0 != dest[j]) && (src[j] == srcCountry) && (dest[j] == destCountry))) {
                        if ((0 == startTime[j]) && (0 == endTime[j])) {
                            amount[j] ++;
                            if (!_mulMatch) {
                                break;
                            }
                        } else {
                            if (_checkTime(_direction, i, startTime[j], endTime[j])) {
                                amount[j] ++;
                                if (!_mulMatch) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }
        return amount;
    }
}

