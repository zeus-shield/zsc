/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../../utillib/LibString.sol";
import "../../utillib/LibInt.sol";
import "../../common/delegate.sol";

contract LogisticsDatabase is Delegate {

    using LibString for *;
    using LibInt for *;

    struct Track {
        /** @desc track info
          * city: 0~15(uint16)
          * country: 16~31(uint16)
          * time: 32~95(uint64)
          * timezone: 96~103(int8)
          * actionCode: 103~110(7 bits)
          * type: 111(1 bit)
          */
        uint112 data_;
        string facilityName_;
        string desc_;
    }

    struct Brief {
        string transNum_;
        string model_;
        uint16 destinationCountry_;
        uint8 lastStatus_;
    }

    /** @desc string(valid/invalid num name: original num name + valid/invalid num index) => Brief(brief info)
      * @eg JNTCU0600046683YQ-3 => Brief
      */
    mapping(string => Brief) private briefs_;

    /** @desc string(valid/invalid num name: original num name + valid/invalid num index) => uint(track count)
      * @eg JNTCU0600046683YQ-3 => 4
      */
    mapping(string => uint) private trackCounts_;

    /** @desc string(track name: original num name + valid/invalid num index + track index) => Track(track info)
      * @eg JNTCU0600046683YQ-3-5 => Track
      */
    mapping(string => Track) private tracks_;  

    /** @desc string(valid/invalid num name: original num name + valid/invalid num index) => string[](track temps) */
    mapping(string => string[]) private trackTmps_;

    // Constructor
    constructor() public {}

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    function _allocTracks(string _num, uint _length) private {
        trackCounts_[_num] += _length;
    }

    function _removeTracks(string _num) private {
        string memory trackName = "";
        for (uint i=0; i<trackCounts_[_num]; i++) {
            trackName = _num.concat("-", i.toString());
            delete tracks_[trackName];
        }
        trackCounts_[_num] = 0;
    }

    function _updateTrack(string _num, uint _index, string _track) private {
        uint112 data = 0;

        // check index
        require(trackCounts_[_num] > _index);

        string memory trackName = _num.concat("-", _index.toString());
        data = tracks_[trackName].data_;

        if (_track.keyExists("city")) {
            // clear data
            data = data & uint112(-1) << 16;
            // update data
            data = data | uint16(_track.getStringValueByKey("city").toUint());
            // data = data | uint16(_track.getIntValueByKey("city"));
        }

         if (_track.keyExists("country")) {
            // clear data
            // data = data & (uint112(-1) << (16+16) | uint112(-1) >> (112-16));
            data = data & (uint112(-1) << (16+16) | uint16(-1));
            // update data
            data = data | uint32(_track.getStringValueByKey("country").toUint()) << 16;
            // data = data | uint32(_track.getIntValueByKey("country")) << 16;
        }

        if (_track.keyExists("time")) {
            // clear data
            // data = data & (uint112(-1) << (16+16+64) | uint112(-1) >> (112-16-16));
            data = data & (uint112(-1) << (16+16+64) | uint32(-1));
            // update data
            data = data | uint96(_track.getStringValueByKey("time").toUint()) << (16+16);
            // data = data | uint96(_track.getIntValueByKey("time")) << (16+16);
        }

        if (_track.keyExists("timeZone")) {
            // clear data
            // data = data & (uint112(-1) << (16+16+64+8) | uint112(-1) >> (112-16-16-64));
            data = data & (uint112(-1) << (16+16+64+8) | uint96(-1));
            // update data
            data = data | uint104(_track.getStringValueByKey("timeZone").toInt()) << (16+16+64);
            // data = data | uint104(_track.getIntValueByKey("timeZone")) << (16+16+64);
        }

        if (_track.keyExists("actionCode")) {
            // clear data
            // data = data & (uint112(-1) << (16+16+64+8+7) | uint112(-1) >> (112-16-16-64-8));
            data = data & (uint112(-1) << (16+16+64+8+7) | uint104(-1));
            // update data
            data = data | uint112(_track.getStringValueByKey("actionCode").toUint()) << (16+16+64+8);
            // data = data | uint112(_track.getIntValueByKey("actionCode")) << (16+16+64+8);
        }

        if (_track.keyExists("type")) {
            // clear data
            data = data & (uint112(-1) >> (112-16-16-64-8-7));
            // update data
            data = data | uint112(_track.getStringValueByKey("type").toUint()) << (16+16+64+8+7);
            // data = data | uint112(_track.getIntValueByKey("type")) << (16+16+64+8+7);
        }

        tracks_[trackName].data_ = data;

        if (_track.keyExists("facilityName")) {
            tracks_[trackName].facilityName_ = _track.getStringValueByKey("facilityName");
        }

        if (_track.keyExists("desc")) {
            tracks_[trackName].desc_ = _track.getStringValueByKey("desc");
        }
    }

    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) external _onlyAdminOrHigher {
        uint startIndex = 0;

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (0 != bytes(tracks).length) {
                tracks.split("&", trackTmps_[_num]);

                if (0 == _updateType) {
                    // remove all tracks at first
                    _removeTracks(_num);
                }

                startIndex = trackCounts_[_num];

                //alloc tracks
                _allocTracks(_num, trackTmps_[_num].length);

                for (uint i=0; i<trackTmps_[_num].length; i++) {
                    _updateTrack(_num, startIndex+i, trackTmps_[_num][i]);
                }
            }
        }
    }

    function updateBrief(string _num, string _transNum, string _model,
                         uint16 _destinationCountry, uint8 _lastStatus) external _onlyAdminOrHigher {
        briefs_[_num].transNum_           = _transNum;
        briefs_[_num].model_              = _model;
        briefs_[_num].destinationCountry_ = _destinationCountry;
        briefs_[_num].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(string _num, string _brief) external _onlyAdminOrHigher {
        if (_brief.keyExists("transNum")) {
            briefs_[_num].transNum_ = _brief.getStringValueByKey("transNum");
        }

        if (_brief.keyExists("model")) {
            briefs_[_num].model_ = _brief.getStringValueByKey("model");
        }

        if (_brief.keyExists("destinationCountry")) {
            briefs_[_num].destinationCountry_ = uint16(_brief.getStringValueByKey("destinationCountry").toUint());
        }

        if (_brief.keyExists("lastStatus")) {
            briefs_[_num].lastStatus_ = uint8(_brief.getStringValueByKey("lastStatus").toUint());
        }
    }

    function remove(string _num) external _onlyAdminOrHigher {
        // remove tracks
        _removeTracks(_num);

        // remove brief
        delete briefs_[_num];
    }

    function numberOfTracks(string _num) external view returns (uint) {
        return trackCounts_[_num];
    }

    function getParcel(string _num) external view returns (string, string, uint16, uint8, string) {
        string memory tacks = this.getTracks(_num);

        return (briefs_[_num].transNum_, briefs_[_num].model_, briefs_[_num].destinationCountry_, briefs_[_num].lastStatus_, tacks);
    }

    function getParcelEx(string _originalNum, string _num) external view returns (string) {
        string memory str = "";
        string memory tacks = this.getTracks(_num);

        str = str.concat("{", _originalNum.toKeyValue("num"), ",");
        str = str.concat(briefs_[_num].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(briefs_[_num].model_.toKeyValue("model"), ",");
        str = str.concat(uint(briefs_[_num].destinationCountry_).toString().toKeyValue("destinationCountry"), ",");
        str = str.concat(uint(briefs_[_num].lastStatus_).toString().toKeyValue("lastStatus"), ",");
        str = str.concat("\"trackElementList\":", tacks, "}");
        return str;
    }

    function getTracks(string _num) external view returns (string) {
        uint112 data = 0;
        uint16 city = 0;
        uint16 country = 0;
        uint64 time = 0;
        int8 timezone = 0;
        uint8 actionCode = 0;
        uint8 type8 = 0;
        string memory trackName = "";
        string memory str = "";

        str = "[";
        for (uint i=0; i<trackCounts_[_num]; i++) {
            trackName = _num.concat("-", i.toString());

            data = tracks_[trackName].data_;

            // city = uint16(data & (uint112(-1) >> (112-16)));
            // country = uint16((data & (uint112(-1) << 16 & uint112(-1) >> (112-16-16))) >> 16);
            // time = uint64((data & (uint112(-1) << (16+16) & uint112(-1) >> (112-16-16-64))) >> (16+16));
            // timezone = int8((data & (uint112(-1) << (16+16+64) & uint112(-1) >> (112-16-16-64-8))) >> (16+16+64));
            // actionCode = uint8((data & (uint112(-1) << (16+16+64+8) & uint112(-1) >> (112-16-16-64-8-7))) >> (16+16+64+8));

            city = uint16(data & uint16(-1));
            country = uint16((data & uint32(-1) << 16) >> 16);
            time = uint64((data & uint96(-1) << (16+16)) >> (16+16));
            timezone = int8((data & uint104(-1) << (16+16+64)) >> (16+16+64));
            actionCode = uint8((data & uint112(-1) << (16+16+64+8)) >> (16+16+64+8)) & (uint8(-1) >> 1);

            type8 = uint8((data & uint112(-1) << (16+16+64+8+7)) >> (16+16+64+8+7));

            str = str.concat("{", uint(type8).toString().toKeyValue("type"), ",");
            str = str.concat(uint(time).toString().toKeyValue("time"), ",");
            str = str.concat(uint(country).toString().toKeyValue("country"), ",");
            str = str.concat(uint(city).toString().toKeyValue("city"), ",");
            str = str.concat(tracks_[trackName].facilityName_.toKeyValue("facilityName"), ",");
            str = str.concat(int(timezone).toString().toKeyValue("timeZone"), ",");
            str = str.concat(tracks_[trackName].desc_.toKeyValue("desc"), ",");
            str = str.concat(uint(actionCode).toString().toKeyValue("actionCode"), "}");

            if (trackCounts_[_num] != (i+1)) {
                str = str.concat(",");
            }
        }
        str = str.concat("]");

        return str;
    }

    function getBrief(string _originalNum, string _num) external view returns (string, string, string, uint16, uint8) {
        return (_originalNum, briefs_[_num].transNum_, briefs_[_num].model_, briefs_[_num].destinationCountry_, briefs_[_num].lastStatus_);
    }

    function getBriefEx(string _originalNum, string _num) external view returns (string) {
        string memory str = "";

        str = str.concat("{", _originalNum.toKeyValue("num"), ",");
        str = str.concat(briefs_[_num].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(briefs_[_num].model_.toKeyValue("model"), ",");
        str = str.concat(briefs_[_num].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(briefs_[_num].lastStatus_.toKeyValue("lastStatus"), "}");

        return str;
    }
}