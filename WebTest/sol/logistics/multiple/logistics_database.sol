/**
 Copyright (c) 2018, deduotech.com
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

    modifier _onlyHigherThanAdmin() {
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
        // check index
        require(trackCounts_[_num] > _index);

        string memory trackName = _num.concat("-", _index.toString());

        if (_track.keyExists("type")) {
            tracks_[trackName].type_ = _track.getStringValueByKey("type");
        }

        if (_track.keyExists("time")) {
            tracks_[trackName].time_ = _track.getStringValueByKey("time");
        }

        if (_track.keyExists("country")) {
            tracks_[trackName].country_ = _track.getStringValueByKey("country");
        }

        if (_track.keyExists("city")) {
            tracks_[trackName].city_ = _track.getStringValueByKey("city");
        }

        if (_track.keyExists("facilityName")) {
            tracks_[trackName].facilityName_ = _track.getStringValueByKey("facilityName");
        }

        if (_track.keyExists("timeZone")) {
            tracks_[trackName].timeZone_ = _track.getStringValueByKey("timeZone");
        }

        if (_track.keyExists("desc")) {
            tracks_[trackName].desc_ = _track.getStringValueByKey("desc");
        }

        if (_track.keyExists("actionCode")) {
            tracks_[trackName].actionCode_ = _track.getStringValueByKey("actionCode");
        }
    }

    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) external _onlyHigherThanAdmin {
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
                         string _destinationCountry, string _lastStatus) external _onlyHigherThanAdmin {
        briefs_[_num].transNum_           = _transNum;
        briefs_[_num].model_              = _model;
        briefs_[_num].destinationCountry_ = _destinationCountry;
        briefs_[_num].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(string _num, string _brief) external _onlyHigherThanAdmin {
        if (_brief.keyExists("transNum")) {
            briefs_[_num].transNum_ = _brief.getStringValueByKey("transNum");
        }

        if (_brief.keyExists("model")) {
            briefs_[_num].model_ = _brief.getStringValueByKey("model");
        }

        if (_brief.keyExists("destinationCountry")) {
            briefs_[_num].destinationCountry_ = _brief.getStringValueByKey("destinationCountry");
        }

        if (_brief.keyExists("lastStatus")) {
            briefs_[_num].lastStatus_ = _brief.getStringValueByKey("lastStatus");
        }
    }

    function remove(string _num) external _onlyHigherThanAdmin {
        // remove tracks
        _removeTracks(_num);

        // remove brief
        delete briefs_[_num];
    }

    function numberOfTracks(string _num) external view returns (uint) {
        return trackCounts_[_num];
    }

    function getParcel(string _num) external view returns (string, string, string, string, string) {
        string memory tacks = this.getTracks(_num);

        return (briefs_[_num].transNum_, briefs_[_num].model_, briefs_[_num].destinationCountry_, briefs_[_num].lastStatus_, tacks);
    }

    function getParcelEx(string _num) external view returns (string) {
        string memory str = "";
        string memory tacks = this.getTracks(_num);

        str = str.concat("{", _num.toKeyValue("num"), ",");
        str = str.concat(briefs_[_num].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(briefs_[_num].model_.toKeyValue("model"), ",");
        str = str.concat(briefs_[_num].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(briefs_[_num].lastStatus_.toKeyValue("lastStatus"), ",");
        str = str.concat("\"trackElementList\":", tacks, "}");
        return str;
    }

    function getTracks(string _num) external view returns (string) {
        string memory trackName = "";
        string memory str = "";

        str = "[";
        for (uint i=0; i<trackCounts_[_num]; i++) {
            trackName = _num.concat("-", i.toString());

            str = str.concat("{", tracks_[trackName].type_.toKeyValue("type"), ",");
            str = str.concat(tracks_[trackName].time_.toKeyValue("time"), ",");
            str = str.concat(tracks_[trackName].country_.toKeyValue("country"), ",");
            str = str.concat(tracks_[trackName].city_.toKeyValue("city"), ",");
            str = str.concat(tracks_[trackName].facilityName_.toKeyValue("facilityName"), ",");
            str = str.concat(tracks_[trackName].timeZone_.toKeyValue("timeZone"), ",");
            str = str.concat(tracks_[trackName].desc_.toKeyValue("desc"), ",");
            str = str.concat(tracks_[trackName].actionCode_.toKeyValue("actionCode"), "}");

            if (trackCounts_[_num] != (i+1)) {
                str = str.concat(",");
            }
        }
        str = str.concat("]");

        return str;
    }

    function getBrief(string _originalNum, string _num) external view returns (string, string, string, string, string) {
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