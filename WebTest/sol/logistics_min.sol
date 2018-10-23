/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.21;
// pragma experimental ABIEncoderV2;

import "./utillib/LibString.sol";
import "./utillib/LibInt.sol";

contract Logistics {

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
    mapping(string => bool) private numExists_;

    /** @desc string(original num name) => uint(num invalid count) */
    mapping(string => uint) private numInvalidCounts_;
    /*************************************************/

    /** @desc string(valid num name: original num name + valid num index) => Brief(brief info)
      * @eg JNTCU0600046683YQ-3 => Brief
      */
    mapping(string => Brief) private briefs_;

    /** @desc string(valid num name: original num name + valid num index) => uint(track count)
      * @eg JNTCU0600046683YQ-3 => 4
      */
    mapping(string => uint) private trackCounts_;

    /** @desc string(track name: original num name + valid num index + track index) => Track(track info)
      * @eg JNTCU0600046683YQ-3-5 => Track
      */
    mapping(string => Track) private tracks_;  

    /** @desc string(valid num name: original num name + valid num index) => string[](track temps) */
    mapping(string => string[]) private trackTmps_;

    // Constructor
    function Logistics() public {
        numTotalCount_ = 0;
    }

    function findNum(string _num) internal view returns (bool) {
        // check num total count
        if (0 == numTotalCount_) {
            return false;
        }

        return numExists_[_num];
    }

    function addNum(string _num) internal {
        // check param
        if (0 == bytes(_num).length) {
            return;
        }

        numNames_[numTotalCount_] = _num;
        numIndexs_[_num] = numTotalCount_;
        numExists_[_num] = true;

        numTotalCount_ ++;
    }

    function removeNum(string _num) internal {
        string memory lastNumName = "";
        uint currentIndex = 0;

        // check param
        if (0 == bytes(_num).length) {
            return;
        }

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

        numExists_[_num] = false;

        numTotalCount_ --;
    }
 
    function getValidNumName(string _num) internal view returns (string) {
        return _num.concat("-", numInvalidCounts_[_num].toString());
    }

    function allocTracks(string _num, uint _length) internal {
        trackCounts_[_num] += _length;
    }

    function removeTracks(string _num) internal {
        string memory trackName = "";
        for (uint i=0; i<trackCounts_[_num]; i++) {
            trackName = _num.concat("-", i.toString());
            delete tracks_[trackName];
        }
        trackCounts_[_num] = 0;
    }

    function updateTrack(string _num, uint _index, string _track) internal {
        string memory trackName = "";
        string memory type32 = "";
        string memory time = "";
        string memory country = "";
        string memory city = "";
        string memory facilityName = "";
        string memory timeZone = "";
        string memory desc = "";
        string memory actionCode = "";

        if (trackCounts_[_num] <= _index) {
            return;
        }

        trackName = _num.concat("-", _index.toString());

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

        // log0(type32.toBytes32());
        // log0(time.toBytes32());
        // log0(country.toBytes32());
        // log0(city.toBytes32());
        // log0(facilityName.toBytes32());
        // log0(timeZone.toBytes32());
        // log0(desc.toBytes32());
        // log0(actionCode.toBytes32());
    }

    // _updateType: 0 means overwrite, 1 means add
    function updateTracks(string _num, string _tracks, uint _updateType) public {
        uint startIndex = 0;

        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_tracks).length)) {
            return;
        }

        // find num
        if (!findNum(_num)) {
            return;
        }

        // get valid num name
        string memory validNum = getValidNumName(_num);

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (0 != bytes(tracks).length) {
                tracks.split("&", trackTmps_[validNum]);

                if (0 == _updateType) {
                    // remove all tracks at first
                    removeTracks(validNum);
                }

                startIndex = trackCounts_[validNum];

                //alloc tracks
                allocTracks(validNum, trackTmps_[validNum].length);

                for (uint i=0; i<trackTmps_[validNum].length; i++) {
                    updateTrack(validNum, startIndex+i, trackTmps_[validNum][i]);
                }
            }
        }
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {
        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_transNum).length) || (0 == bytes(_model).length)
            || (0 == bytes(_destinationCountry).length) || (0 == bytes(_lastStatus).length)) {
            return;
        }

        // find num
        if (!findNum(_num)) {
            // add num
            addNum(_num);
        }

        // get valid num name
        string memory validNum = getValidNumName(_num);

        // update brief
        briefs_[validNum].transNum_           = _transNum;
        briefs_[validNum].model_              = _model;
        briefs_[validNum].destinationCountry_ = _destinationCountry;
        briefs_[validNum].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(string _brief) public {
        string memory num = "";
        string memory transNum = "";
        string memory model = "";
        string memory destinationCountry = "";
        string memory lastStatus = "";

        // check param
        if (0 == bytes(_brief).length) {
            return;
        }

        if (_brief.keyExists("num")) {
            num = _brief.getStringValueByKey("num");
        }

        if (0 == bytes(num).length) {
            return;
        }

        // find num
        if (!findNum(num)) {
            // add num
            addNum(num);
        }

        // get valid num name
        string memory validNum = getValidNumName(num);

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

        // log0(validNum.toBytes32());
        // log0(transNum.toBytes32());
        // log0(model.toBytes32());
        // log0(destinationCountry.toBytes32());
        // log0(lastStatus.toBytes32());
    }

    function update(string _num, string _transNum, 
                    string _model, string _destinationCountry,
                    string _lastStatus, string _tracks) public {

        // update brief
        updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);

        // update tracks from json(similar to)
        if (0 != bytes(_tracks).length) {
            updateTracks(_num, _tracks, 0);
        }
    }

    function updateEx(string _info) public {
        // string memory _info = "{\"error\":null,\"num\":\"JNTCU0600046683YQ\",\"transNum\":\"MSK0000027695\",\"model\":\"MOSEXP\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"§¡§â§Þ§Ñ§Ó§Ú§â\",\"timeZone\":\"+3\",\"desc\":\"§´§à§Ó§Ñ§â §Ò§í§Ý §å§ã§á§Ö§ê§ß§à §Õ§à§ã§ä§Ñ§Ó§Ý§Ö§ß §á§à§Ý§å§é§Ñ§ä§Ö§Ý§ð. §³§á§Ñ§ã§Ú§Ò§à §é§ä§à §Ó§à§ã§á§à§Ý§î§Ù§à§Ó§Ñ§Ý§Ú§ã§î §ß§Ñ§ê§Ú§Þ§Ú §å§ã§Ý§å§Ô§Ñ§Þ§Ú\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        string memory num = "";

        // check param
        if (0 == bytes(_info).length) {
            return;
        }

        if (_info.keyExists("num")) {
            num = _info.getStringValueByKey("num");
        }

        if (0 == bytes(num).length) {
            return;
        }

        // update brief from json(similar to)
        updateBriefEx(_info);

        // update tracks from json(similar to)
        updateTracks(num, _info, uint(0));
    }

    function remove(string _num) public {
        // check param
        if (0 == bytes(_num).length) {
            return;
        }

        // find num
        if (!findNum(_num)) {
            return;
        }

        // remove num
        removeNum(_num);

        // get valid num name
        string memory validNum = getValidNumName(_num);

        // remove tracks at first
        removeTracks(validNum);

        // remove brief
        delete briefs_[validNum];
    }

    function invalid(string _num) public {
        // check param
        if (0 == bytes(_num).length) {
            return;
        }

        // find num
        if (!findNum(_num)) {
            return;
        }

        // remove num
        removeNum(_num);

        numInvalidCounts_[_num] ++;
    }

    function getTracks(string _num) public view returns (string) {
        string memory trackName = "";
        string memory str = "";

        // _num = "JNTCU0600046683YQ";

        // check param
        if (0 == bytes(_num).length) {
            return str;
        }

        // find num
        if (!findNum(_num)) {
            return str;
        }

        // get valid num name
        string memory validNum = getValidNumName(_num);

        str = "[";
        for (uint i=0; i<trackCounts_[validNum]; i++) {
            trackName = validNum.concat("-", i.toString());

            str = str.concat("{", tracks_[trackName].type_.toKeyValue("type"), ",");
            str = str.concat(tracks_[trackName].time_.toKeyValue("time"), ",");
            str = str.concat(tracks_[trackName].country_.toKeyValue("country"), ",");
            str = str.concat(tracks_[trackName].city_.toKeyValue("city"), ",");
            str = str.concat(tracks_[trackName].facilityName_.toKeyValue("facilityName"), ",");
            str = str.concat(tracks_[trackName].timeZone_.toKeyValue("timeZone"), ",");
            str = str.concat(tracks_[trackName].desc_.toKeyValue("desc"), ",");
            str = str.concat(tracks_[trackName].actionCode_.toKeyValue("actionCode"), "}");

            if (trackCounts_[validNum] != (i+1)) {
                str = str.concat(",");
            }
        }
        str = str.concat("]");

        return str;
    }

    function getBrief(string _num) public view returns (string, string, string, string, string) {
        bool found = false;
        string[5] memory str = ["", "", "", "", ""];

        // _num = "JNTCU0600046683YQ";

        // check param
        if (0 == bytes(_num).length) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        // find num
        found = findNum(_num);
        if (!found) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        // get valid num name
        string memory validNum = getValidNumName(_num);

        str[0] = _num;
        str[1] = briefs_[validNum].transNum_;
        str[2] = briefs_[validNum].model_;
        str[3] = briefs_[validNum].destinationCountry_;
        str[4] = briefs_[validNum].lastStatus_;

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    function getBriefEx(string _num) public view returns (string) {
        bool found = false;
        string memory str = "";

        // _num = "JNTCU0600046683YQ";

        // check param
        if (0 == bytes(_num).length) {
            return str;
        }

        // find num
        found = findNum(_num);
        if (!found) {
            return str;
        }

        // get valid num name
        string memory validNum = getValidNumName(_num);

        str = str.concat("{", _num.toKeyValue("num"), ",");
        str = str.concat(briefs_[validNum].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(briefs_[validNum].model_.toKeyValue("model"), ",");
        str = str.concat(briefs_[validNum].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(briefs_[validNum].lastStatus_.toKeyValue("lastStatus"), "}");

        return str;
    }

    function getBriefByIndex(uint _index) public view returns (string, string, string, string, string) {
        string memory num = "";
        string[5] memory str = ["", "", "", "", ""];

        // check param
        if (numTotalCount_ <= _index) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        num = numNames_[_index];

        // get valid num name
        string memory validNum = getValidNumName(num);

        str[0] = num;
        str[1] = briefs_[validNum].transNum_;
        str[2] = briefs_[validNum].model_;
        str[3] = briefs_[validNum].destinationCountry_;
        str[4] = briefs_[validNum].lastStatus_;

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    function getBriefExByIndex(uint _index) public view returns (string) {
        string memory num = "";
        string memory str = "";

        // check param
        if (numTotalCount_ <= _index) {
            return str;
        }

        num = numNames_[_index];

        // get valid num name
        string memory validNum = getValidNumName(num);

        str = str.concat("{", num.toKeyValue("num"), ",");
        str = str.concat(briefs_[validNum].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(briefs_[validNum].model_.toKeyValue("model"), ",");
        str = str.concat(briefs_[validNum].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(briefs_[validNum].lastStatus_.toKeyValue("lastStatus"), "}");

        return str;
    }

    function exist(string _num) public view returns (bool) {
        // check param
        if (0 == bytes(_num).length) {
            return false;
        }

        return findNum(_num);
    }

    function number() public view returns (uint) {
        return numTotalCount_;
    }

    function numberOfTracks(string _num) public view returns (uint) {
        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        // find num
        if (!findNum(_num)) {
            return 0;
        }

        // get valid num name
        string memory validNum = getValidNumName(_num);

        return trackCounts_[validNum];
    }

    // for invalid debug
    function numberOfInvalidNums(string _num) public view returns (uint) {
        return numInvalidCounts_[_num];
    }

    function getBriefInvalid(string _num, uint _invalidIndex) public view returns (string, string, string, string, string) {
        string[5] memory str = ["", "", "", "", ""];

        // check param
        if (0 == bytes(_num).length) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        if (numInvalidCounts_[_num] <= _invalidIndex) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        // find num
        // if (!findNum(_num)) {
        //     return (str[0], str[1], str[2], str[3], str[4]);
        // }

        // get invalid num name
        string memory invalidNum = _num.concat("-", _invalidIndex.toString());

        str[0] = invalidNum;
        str[1] = briefs_[invalidNum].transNum_;
        str[2] = briefs_[invalidNum].model_;
        str[3] = briefs_[invalidNum].destinationCountry_;
        str[4] = briefs_[invalidNum].lastStatus_;

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    // function getTracksInvalid(string _num, uint _invalidIndex) public view returns (string) {
    //     string memory trackName = "";
    //     string memory str = "";

    //     // check param
    //     if (0 == bytes(_num).length) {
    //         return str;
    //     }

    //     if (numInvalidCounts_[_num] <= _invalidIndex) {
    //         return str;
    //     }

    //     // find num
    //     // if (!findNum(_num)) {
    //     //     return str;
    //     // }

    //     // find invalid num name
    //     string memory invalidNum = _num.concat("-", _invalidIndex.toString());

    //     str = "[";
    //     for (uint i=0; i<trackCounts_[invalidNum]; i++) {
    //         trackName = invalidNum.concat("-", i.toString());

    //         str = str.concat("{", tracks_[trackName].type_.toKeyValue("type"), ",");
    //         str = str.concat(tracks_[trackName].time_.toKeyValue("time"), ",");
    //         str = str.concat(tracks_[trackName].country_.toKeyValue("country"), ",");
    //         str = str.concat(tracks_[trackName].city_.toKeyValue("city"), ",");
    //         str = str.concat(tracks_[trackName].facilityName_.toKeyValue("facilityName"), ",");
    //         str = str.concat(tracks_[trackName].timeZone_.toKeyValue("timeZone"), ",");
    //         str = str.concat(tracks_[trackName].desc_.toKeyValue("desc"), ",");
    //         str = str.concat(tracks_[trackName].actionCode_.toKeyValue("actionCode"), "}");

    //         if (trackCounts_[invalidNum] != (i+1)) {
    //             str = str.concat(",");
    //         }
    //     }
    //     str = str.concat("]");

    //     return str;
    // }
}