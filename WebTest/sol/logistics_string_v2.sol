/*
 Copyright (c) 2018, ZSC Dev Team
 2017-12-18: v0.01
*/

pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

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
        // string num_;
        string transNum_;
        string model_;
        string destinationCountry_;
        string lastStatus_;
    }

    // string: original num name
    // eg. JNTCU0600046683YQ
    string[] private nums_;

    // string: original num name
    // uint: discard num count
    // eg. JNTCU0600046683YQ => 3
    mapping(string => uint) private discardNumbers_;

    // string: valid num name(original num name + valid num index)
    // uint: track number
    // eg. JNTCU0600046683YQ-3 => 4
    mapping(string => uint) private trackNumbers_;

    // string: valid num name(original num name + valid num index)
    // Brief: brief info
    // eg. JNTCU0600046683YQ-3 => Brief
    mapping(string => Brief) private briefs_;

    // string: valid track name(original num name + valid num index + track index)
    // Track: track info
    // eg. JNTCU0600046683YQ-3-5 => Track
    mapping(string => Track) private tracks_;  

    string[] private trackTmps_;

    // Constructor
    function Logistics() public {
        nums_.length = 0;
        trackTmps_.length = 0;
    }

    function findNum(string _num) internal view returns (bool, uint) {
        uint i = 0;
        bool found = false;

        // check param
        if (0 == bytes(_num).length) {
            return (found, i);
        }

        if (0 == nums_.length) {
            return (found, i);
        }

        for (i=0; i<nums_.length; i++) {
            if (_num.equals(nums_[i])) {
                found = true;
                break;
            }
        }

        return (found, i);
    }

    function removeNum(uint _index) internal {
        uint leftCount = 0;

        //check param
        if (nums_.length <= _index) {
            return;
        }

        leftCount = nums_.length - _index - 1;
        for (uint i=0; i<leftCount; i++) {
            nums_[_index] = nums_[_index+1];
            _index ++;
        }

        delete nums_[_index];

        nums_.length -= 1;
    }
 
    function findValidNum(string _num) internal view returns (string) {
        return _num.concat("-", discardNumbers_[_num].toString());
    }

    function allocTracks(string _num, uint _length) internal {
        trackNumbers_[_num] += _length;
    }

    function removeTracks(string _num) internal {
        string memory trackName = "";
        for (uint i=0; i<trackNumbers_[_num]; i++) {
            trackName = _num.concat("-", i.toString());
            delete tracks_[trackName];
        }
        trackNumbers_[_num] = 0;
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

        if (trackNumbers_[_num] <= _index) {
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
        uint index = 0;
        bool found = false;
        uint startIndex = 0;

        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_tracks).length)) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        // find valid num name
        string memory validNum = findValidNum(_num);

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (0 != bytes(tracks).length) {
                tracks.split("&", trackTmps_);

                if (0 == _updateType) {
                    // remove all tracks at first
                    removeTracks(validNum);
                }

                startIndex = trackNumbers_[validNum];

                //alloc tracks
                allocTracks(validNum, trackTmps_.length);

                for (uint i=0; i<trackTmps_.length; i++) {
                    updateTrack(validNum, startIndex+i, trackTmps_[i]);
                }
            }
        }
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {
        
        uint index = 0;
        bool found = false;

        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_transNum).length) || (0 == bytes(_model).length)
            || (0 == bytes(_destinationCountry).length) || (0 == bytes(_lastStatus).length)) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            // add num
            nums_.push(_num);
        }

        // find valid num name
        string memory validNum = findValidNum(_num);

        // update brief
        // briefs_[validNum].num_                = validNum;
        briefs_[validNum].transNum_           = _transNum;
        briefs_[validNum].model_              = _model;
        briefs_[validNum].destinationCountry_ = _destinationCountry;
        briefs_[validNum].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(string _brief) public {
        uint index = 0;
        bool found = false;
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
        (found, index) = findNum(num);
        if (!found) {
            // add num
            nums_.push(num);
        }

        // find valid num name
        string memory validNum = findValidNum(num);

        // briefs_[validNum].num_ = validNum;

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
        uint index = 0;
        bool found = false;

        // check param
        if (0 == bytes(_num).length) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        // remove num
        removeNum(index);

        // find valid num name
        string memory validNum = findValidNum(_num);

        // remove tracks at first
        removeTracks(validNum);

        // delete brief
        delete briefs_[validNum];
    }

    function discard(string _num) public {
        uint index = 0;
        bool found = false;

        // check param
        if (0 == bytes(_num).length) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        discardNumbers_[_num] ++;
    }

    function getTracks(string _num) public view returns (string) {
        uint index = 0;
        bool found = false;
        string memory trackName = "";
        string memory str = "";

        // _num = "JNTCU0600046683YQ";

        // check param
        if (0 == bytes(_num).length) {
            return str;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return str;
        }

        // find valid num name
        string memory validNum = findValidNum(_num);

        str = "[";
        for (uint i=0; i<trackNumbers_[validNum]; i++) {
            trackName = validNum.concat("-", i.toString());

            str = str.concat("{", tracks_[trackName].type_.toKeyValue("type"), ",");
            str = str.concat(tracks_[trackName].time_.toKeyValue("time"), ",");
            str = str.concat(tracks_[trackName].country_.toKeyValue("country"), ",");
            str = str.concat(tracks_[trackName].city_.toKeyValue("city"), ",");
            str = str.concat(tracks_[trackName].facilityName_.toKeyValue("facilityName"), ",");
            str = str.concat(tracks_[trackName].timeZone_.toKeyValue("timeZone"), ",");
            str = str.concat(tracks_[trackName].desc_.toKeyValue("desc"), ",");
            str = str.concat(tracks_[trackName].actionCode_.toKeyValue("actionCode"), "}");

            if (trackNumbers_[validNum] != (i+1)) {
                str = str.concat(",");
            }
        }
        str = str.concat("]");

        return str;
    }

    function getBrief(string _num) public view returns (string, string, string, string, string) {
        uint index = 0;
        bool found = false;
        string[5] memory str = ["", "", "", "", ""];

        // _num = "JNTCU0600046683YQ";

        // check param
        if (0 == bytes(_num).length) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        // find valid num name
        string memory validNum = findValidNum(_num);

        str[0] = _num;
        str[1] = briefs_[validNum].transNum_;
        str[2] = briefs_[validNum].model_;
        str[3] = briefs_[validNum].destinationCountry_;
        str[4] = briefs_[validNum].lastStatus_;

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    function getBriefEx(string _num) public view returns (string) {
        uint index = 0;
        bool found = false;
        string memory str = "";

        // _num = "JNTCU0600046683YQ";

        // check param
        if (0 == bytes(_num).length) {
            return str;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return str;
        }

        // find valid num name
        string memory validNum = findValidNum(_num);

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
        if (nums_.length <= _index) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        num = nums_[_index];

        // find valid num name
        string memory validNum = findValidNum(num);

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
        if (nums_.length <= _index) {
            return str;
        }

        num = nums_[_index];

        // find valid num name
        string memory validNum = findValidNum(num);

        str = str.concat("{", num.toKeyValue("num"), ",");
        str = str.concat(briefs_[validNum].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(briefs_[validNum].model_.toKeyValue("model"), ",");
        str = str.concat(briefs_[validNum].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(briefs_[validNum].lastStatus_.toKeyValue("lastStatus"), "}");

        return str;
    }

    function number() public view returns (uint) {
        return nums_.length;
    }

    function numberOfTracks(string _num) public view returns (uint) {
        uint index = 0;
        bool found = false;

        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return 0;
        }

        // find valid num name
        string memory validNum = findValidNum(_num);

        return trackNumbers_[validNum];
    }

    // // for discard debug
    // function numberOfDiscard(string _num) public view returns (uint) {
    //     return discardNumbers_[_num];
    // }

    // function getBriefDiscard(string _num, uint _discardIndex) public view returns (string, string, string, string, string) {
    //     uint index = 0;
    //     bool found = false;
    //     string[5] memory str = ["", "", "", "", ""];

    //     // check param
    //     if (0 == bytes(_num).length) {
    //         return (str[0], str[1], str[2], str[3], str[4]);
    //     }

    //     if (discardNumbers_[_num] <= _discardIndex) {
    //         return (str[0], str[1], str[2], str[3], str[4]);
    //     }

    //     // find num
    //     (found, index) = findNum(_num);
    //     if (!found) {
    //         return (str[0], str[1], str[2], str[3], str[4]);
    //     }

    //     // find discard num name
    //     string memory discardNum = _num.concat("-", _discardIndex.toString());

    //     str[0] = discardNum;
    //     str[1] = briefs_[discardNum].transNum_;
    //     str[2] = briefs_[discardNum].model_;
    //     str[3] = briefs_[discardNum].destinationCountry_;
    //     str[4] = briefs_[discardNum].lastStatus_;

    //     return (str[0], str[1], str[2], str[3], str[4]);
    // }

    // function getTracksDiscard(string _num, uint _discardIndex) public view returns (string) {
    //     uint index = 0;
    //     bool found = false;
    //     string memory trackName = "";
    //     string memory str = "";

    //     // check param
    //     if (0 == bytes(_num).length) {
    //         return str;
    //     }

    //     if (discardNumbers_[_num] <= _discardIndex) {
    //         return str;
    //     }

    //     // find num
    //     (found, index) = findNum(_num);
    //     if (!found) {
    //         return str;
    //     }

    //     // find discard num name
    //     string memory discardNum = _num.concat("-", _discardIndex.toString());

    //     str = "[";
    //     for (uint i=0; i<trackNumbers_[discardNum]; i++) {
    //         trackName = discardNum.concat("-", i.toString());

    //         str = str.concat("{", tracks_[trackName].type_.toKeyValue("type"), ",");
    //         str = str.concat(tracks_[trackName].time_.toKeyValue("time"), ",");
    //         str = str.concat(tracks_[trackName].country_.toKeyValue("country"), ",");
    //         str = str.concat(tracks_[trackName].city_.toKeyValue("city"), ",");
    //         str = str.concat(tracks_[trackName].facilityName_.toKeyValue("facilityName"), ",");
    //         str = str.concat(tracks_[trackName].timeZone_.toKeyValue("timeZone"), ",");
    //         str = str.concat(tracks_[trackName].desc_.toKeyValue("desc"), ",");
    //         str = str.concat(tracks_[trackName].actionCode_.toKeyValue("actionCode"), "}");

    //         if (trackNumbers_[discardNum] != (i+1)) {
    //             str = str.concat(",");
    //         }
    //     }
    //     str = str.concat("]");

    //     return str;
    // }
}