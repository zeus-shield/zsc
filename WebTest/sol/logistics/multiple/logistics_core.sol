/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
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

    /*************************************************/
    /** @desc num total count */
    uint private numTotalCount_;

    /** @desc uint(num index) => string(original num name) */
    mapping(uint => string) private numNames_;

    /** @desc string(original num name) => uint(num index) */
    mapping(string => uint) private numIndexs_;

    /** @desc string(original num name) => bool(num exist flag) */
    // mapping(string => bool) private numExist_;

    /** @desc string(original num name) => uint(num invalid count) */
    mapping(string => uint) private numInvalidCounts_;
    /*************************************************/

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
    constructor() public {
        numTotalCount_ = 0;
    }

    function _addNum(string _num) internal {
        numNames_[numTotalCount_] = _num;
        numIndexs_[_num] = numTotalCount_;

        numTotalCount_ ++;

        // numExist_[_num] = true;
    }

    function _removeNum(string _num) internal {
        string memory lastNumName = "";
        uint currentIndex = 0;

        // check num total count
        if (0 == numTotalCount_) {
            return;
        }

        lastNumName = numNames_[numTotalCount_-1];
        currentIndex = numIndexs_[_num];

        numNames_[currentIndex] = lastNumName;
        delete numNames_[numTotalCount_-1];

        numIndexs_[lastNumName] = currentIndex;
        delete numIndexs_[_num];

        numTotalCount_ --;

        // numExist_[_num] = false;
    }
 
    function _getValidNumName(string _num) internal view returns (string) {
        return _num.concat("-", numInvalidCounts_[_num].toString());
    }

    function _allocTracks(string _validNum, uint _length) internal {
        trackCounts_[_validNum] += _length;
    }

    function _removeTracks(string _validNum) internal {
        string memory trackName = "";
        for (uint i=0; i<trackCounts_[_validNum]; i++) {
            trackName = _validNum.concat("-", i.toString());
            delete tracks_[trackName];
        }
        trackCounts_[_validNum] = 0;
    }

    function _updateTrack(string _validNum, uint _index, string _track) internal {
        string memory trackName = "";
        string memory type32 = "";
        string memory time = "";
        string memory country = "";
        string memory city = "";
        string memory facilityName = "";
        string memory timeZone = "";
        string memory desc = "";
        string memory actionCode = "";

        if (trackCounts_[_validNum] <= _index) {
            return;
        }

        trackName = _validNum.concat("-", _index.toString());

        if (_track.keyExists("type")) {
            type32 = _track.getStringValueByKey("type");
            if (0 != bytes(type32).length) {
                tracks_[trackName].type_ = type32;
            }
        }

        if (_track.keyExists("time")) {
            time = _track.getStringValueByKey("time");
            if (0 != bytes(time).length) {
                tracks_[trackName].time_ = time;
            }
        }

        if (_track.keyExists("country")) {
            country = _track.getStringValueByKey("country");
            if (0 != bytes(country).length) {
                tracks_[trackName].country_ = country;
            }
        }

        if (_track.keyExists("city")) {
            city = _track.getStringValueByKey("city");
            if (0 != bytes(city).length) {
                tracks_[trackName].city_ = city;
            }
        }

        if (_track.keyExists("facilityName")) {
            facilityName = _track.getStringValueByKey("facilityName");
            if (0 != bytes(facilityName).length) {
                tracks_[trackName].facilityName_ = facilityName;
            }
        }

        if (_track.keyExists("timeZone")) {
            timeZone = _track.getStringValueByKey("timeZone");
            if (0 != bytes(timeZone).length) {
                tracks_[trackName].timeZone_ = timeZone;
            }
        }

        if (_track.keyExists("desc")) {
            desc = _track.getStringValueByKey("desc");
            if (0 != bytes(desc).length) {
                tracks_[trackName].desc_ = desc;
            }
        }

        if (_track.keyExists("actionCode")) {
            actionCode = _track.getStringValueByKey("actionCode");
            if (0 != bytes(actionCode).length) {
                tracks_[trackName].actionCode_ = actionCode;
            }
        }
    }

    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) public {
        uint startIndex = 0;

        // get valid num name
        string memory validNum = _getValidNumName(_num);

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (0 != bytes(tracks).length) {
                tracks.split("&", trackTmps_[validNum]);

                if (0 == _updateType) {
                    // remove all tracks at first
                    _removeTracks(validNum);
                }

                startIndex = trackCounts_[validNum];

                //alloc tracks
                _allocTracks(validNum, trackTmps_[validNum].length);

                for (uint i=0; i<trackTmps_[validNum].length; i++) {
                    _updateTrack(validNum, startIndex+i, trackTmps_[validNum][i]);
                }
            }
        }
    }

    function updateBrief(bool _numExist, string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {
        if (!_numExist) {
           _addNum(_num); 
        }

        // get valid num name
        string memory validNum = _getValidNumName(_num);

        // update brief
        briefs_[validNum].transNum_           = _transNum;
        briefs_[validNum].model_              = _model;
        briefs_[validNum].destinationCountry_ = _destinationCountry;
        briefs_[validNum].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(bool _numExist, string _num, string _brief) public {
        string memory transNum = "";
        string memory model = "";
        string memory destinationCountry = "";
        string memory lastStatus = "";

        if (!_numExist) {
            // add num
            _addNum(_num);
        }

        // get valid num name
        string memory validNum = _getValidNumName(_num);

        if (_brief.keyExists("transNum")) {
            transNum = _brief.getStringValueByKey("transNum");
            if (0 != bytes(transNum).length) {
                briefs_[validNum].transNum_ = transNum;
            }
        }

        if (_brief.keyExists("model")) {
            model = _brief.getStringValueByKey("model");
            if (0 != bytes(model).length) {
                briefs_[validNum].model_ = model;
            }
        }

        if (_brief.keyExists("destinationCountry")) {
            destinationCountry = _brief.getStringValueByKey("destinationCountry");
            if (0 != bytes(destinationCountry).length) {
                briefs_[validNum].destinationCountry_ = destinationCountry;
            }
        }

        if (_brief.keyExists("lastStatus")) {
            lastStatus = _brief.getStringValueByKey("lastStatus");
            if (0 != bytes(lastStatus).length) {
                briefs_[validNum].lastStatus_ = lastStatus;
            }
        }
    }

    function remove(string _num) public {
        // get valid num name
        string memory validNum = _getValidNumName(_num);

        // remove tracks
        _removeTracks(validNum);

        // remove brief
        delete briefs_[validNum];

        // remove num
        _removeNum(_num);
    }

    function invalid(string _num) public {
    }

    function number() public view returns (uint) {
    }

    function numberOfTracks(string _num) public view returns (uint) {
    }

    function numberOfInvalid(string _num) public view returns (uint) {
    }

    function getTracks(string _num) public view returns (string) {
    }

    function getBrief(string _num) public view returns (string, string, string, string, string) {
    }

    function getBriefEx(string _num) public view returns (string) {
    }

    function getBriefByIndex(uint _index) public view returns (string, string, string, string, string) {
    }

    function getBriefExByIndex(uint _index) public view returns (string) {
    }

    function getBriefInvalid(string _num, uint _invalidIndex) public view returns (string, string, string, string, string) {
    }

    function getTracksInvalid(string _num, uint _invalidIndex) public view returns (string) {
    }
}