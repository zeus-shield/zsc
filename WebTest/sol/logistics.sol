/*
 Copyright (c) 2018, ZSC Dev Team
 2017-12-18: v0.01
*/

pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

import "./plat_string.sol";
import "./utillib/LibString.sol";

contract Logistics {

    using LibString for *;

    struct Track {
        bytes32 type_;
        bytes32 time_;
        bytes32 country_;
        bytes32 city_;
        bytes32 facilityName_;
        bytes32 timeZone_;
        string  desc_;
        bytes32 actionCode_;
    }

    struct Info {
        bytes32 num_;
        bytes32 transNum_;
        bytes32 model_;
        bytes32 destinationCountry_;
        bytes32 lastStatus_;

        Track[] tracks_;
    }

    bytes32[] private nums_;
    mapping(bytes32 => Info) private infos_;

    string[] private tracks_;

    // Constructor
    function Logistics() public {
        nums_.length = 0;
        tracks_.length = 0;
    }

    function findNum(bytes32 _num) internal view returns (bool, uint) {
        uint i = 0;
        bool found = false;

        // check param
        if (bytes32(0) == _num) {
            return (found, i);
        }

        if (0 == nums_.length) {
            return (found, i);
        }

        for (i=0; i<nums_.length; i++) {
            if (nums_[i] == _num) {
                found = true;
                break;
            }
        }

        return (found, i);
    }

    function removeNum(uint index) internal {
        uint leftCount = 0;

        //check param
        if (nums_.length <= index) {
            return;
        }

        leftCount = nums_.length - index - 1;
        for (uint i=0; i<leftCount; i++) {
            nums_[index] = nums_[index+1];
            index ++;
        }

        delete nums_[index];

        nums_.length -= 1;
    }
 
    function allocTracks(bytes32 _num, uint length) internal {
        infos_[_num].tracks_.length += length;
    }

    function removeTracks(bytes32 _num) internal {
        for (uint i=0; i<infos_[_num].tracks_.length; i++) {
            delete infos_[_num].tracks_[i];
        }
        infos_[_num].tracks_.length = 0;
    }

    function updateTrack(bytes32 _num, uint index, string _track) internal {
        bytes32 type32 = bytes32(0);
        bytes32 time = bytes32(0);
        bytes32 country = bytes32(0);
        bytes32 city = bytes32(0);
        bytes32 facilityName = bytes32(0);
        bytes32 timeZone = bytes32(0);
        string  memory desc = "";
        bytes32 actionCode = bytes32(0);

        if (infos_[_num].tracks_.length <= index) {
            return;
        }

        if (_track.keyExists("type")) {
            type32 = PlatString.tobytes32(_track.getStringValueByKey("type"));
            if (bytes32(0) != type32) {
                infos_[_num].tracks_[index].type_ = type32;
            }
        }

        if (_track.keyExists("time")) {
            time = PlatString.tobytes32(_track.getStringValueByKey("time"));
            if (bytes32(0) != time) {
                infos_[_num].tracks_[index].time_ = time;
            }
        }

        if (_track.keyExists("country")) {
            country = PlatString.tobytes32(_track.getStringValueByKey("country"));
            if (bytes32(0) != country) {
                infos_[_num].tracks_[index].country_ = country;
            }
        }

        if (_track.keyExists("city")) {
            city = PlatString.tobytes32(_track.getStringValueByKey("city"));
            if (bytes32(0) != city) {
                infos_[_num].tracks_[index].city_ = city;
            }
        }

        if (_track.keyExists("facilityName")) {
            facilityName = PlatString.tobytes32(_track.getStringValueByKey("facilityName"));
            if (bytes32(0) != facilityName) {
                infos_[_num].tracks_[index].facilityName_ = facilityName;
            }
        }

        if (_track.keyExists("timeZone")) {
            timeZone = PlatString.tobytes32(_track.getStringValueByKey("timeZone"));
            if (bytes32(0) != timeZone) {
                infos_[_num].tracks_[index].timeZone_ = timeZone;
            }
        }

        if (_track.keyExists("desc")) {
            desc = _track.getStringValueByKey("desc");
            if (!desc.equals("")) {
                infos_[_num].tracks_[index].desc_ = desc;
            }
        }

        if (_track.keyExists("actionCode")) {
            actionCode = PlatString.tobytes32(_track.getStringValueByKey("actionCode"));
            if (bytes32(0) != actionCode) {
                infos_[_num].tracks_[index].actionCode_ = actionCode;
            }
        }

        // log0(type32);
        // log0(time);
        // log0(country);
        // log0(city);
        // log0(facilityName);
        // log0(timeZone);
        // log0(PlatString.tobytes32(desc));
        // log0(actionCode);
    }

    // _updateType: 0 means overwrite, 1 means add
    function updateTracks(bytes32 _num, string _tracks, uint _updateType) public {
        uint index = 0;
        bool found = false;
        uint startIndex = uint(0);

        // check param
        if ((bytes32(0) == _num) || _tracks.equals("")) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (!tracks.equals("")) {
                tracks.split("&", tracks_);

                if (uint(0) == _updateType) {
                    // remove all tracks at first
                    removeTracks(_num);
                }

                startIndex = infos_[_num].tracks_.length;

                //alloc tracks
                allocTracks(_num, tracks_.length);

                for (uint i=0; i<tracks_.length; i++) {
                    updateTrack(_num, startIndex+i, tracks_[i]);
                }
            }
        }
    }

    function updateBrief(bytes32 _num, bytes32 _transNum, bytes32 _model,
                         bytes32 _destinationCountry, bytes32 _lastStatus) public {
        
        uint index = 0;
        bool found = false;

        // check param
        if ((bytes32(0) == _num) || (bytes32(0) == _transNum) || (bytes32(0) == _model)
            || (bytes32(0) == _destinationCountry) || (bytes32(0) == _lastStatus)) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            // add num
            nums_.push(_num);
        }

        // update brief
        infos_[_num].num_                = _num;
        infos_[_num].transNum_           = _transNum;
        infos_[_num].model_              = _model;
        infos_[_num].destinationCountry_ = _destinationCountry;
        infos_[_num].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(string _brief) public {
        uint index = 0;
        bool found = false;
        bytes32 num = 0;
        bytes32 transNum = bytes32(0);
        bytes32 model = bytes32(0);
        bytes32 destinationCountry = bytes32(0);
        bytes32 lastStatus = bytes32(0);

        // check param
        if (_brief.equals("")) {
            return;
        }

        if (_brief.keyExists("num")) {
            num = PlatString.tobytes32(_brief.getStringValueByKey("num"));
        }

        if (bytes32(0) == num) {
            return;
        }

        // find num
        (found, index) = findNum(num);
        if (!found) {
            // add num
            nums_.push(num);
        }

        infos_[num].num_ = num;

        if (_brief.keyExists("transNum")) {
            transNum = PlatString.tobytes32(_brief.getStringValueByKey("transNum"));
            if (bytes32(0) != transNum) {
                infos_[num].transNum_ = transNum;
            }
        }

        if (_brief.keyExists("model")) {
            model = PlatString.tobytes32(_brief.getStringValueByKey("model"));
            if (bytes32(0) != model) {
                infos_[num].model_ = model;
            }
        }

        if (_brief.keyExists("destinationCountry")) {
            destinationCountry = PlatString.tobytes32(_brief.getStringValueByKey("destinationCountry"));
            if (bytes32(0) != destinationCountry) {
                infos_[num].destinationCountry_ = destinationCountry;
            }
        }

        if (_brief.keyExists("lastStatus")) {
            lastStatus = PlatString.tobytes32(_brief.getStringValueByKey("lastStatus"));
            if (bytes32(0) != destinationCountry) {
                infos_[num].lastStatus_ = lastStatus;
            }
        }

        // log0(num);
        // log0(transNum);
        // log0(model);
        // log0(destinationCountry);
        // log0(lastStatus);
    }

    function update(bytes32 _num, bytes32 _transNum, 
                    bytes32 _model, bytes32 _destinationCountry,
                    bytes32 _lastStatus, string _tracks) public {

        // update brief
        updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);

        // update tracks from json(similar to)
        if (!_tracks.equals("")) {
            updateTracks(_num, _tracks, uint(0));
        }
    }

    function updateEx(string _info) public {
        // string memory _info = "{\"error\":null,\"num\":\"JNTCU0600046683YQ\",\"transNum\":\"MSK0000027695\",\"model\":\"MOSEXP\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"§¡§â§Þ§Ñ§Ó§Ú§â\",\"timeZone\":\"+3\",\"desc\":\"§´§à§Ó§Ñ§â §Ò§í§Ý §å§ã§á§Ö§ê§ß§à §Õ§à§ã§ä§Ñ§Ó§Ý§Ö§ß §á§à§Ý§å§é§Ñ§ä§Ö§Ý§ð. §³§á§Ñ§ã§Ú§Ò§à §é§ä§à §Ó§à§ã§á§à§Ý§î§Ù§à§Ó§Ñ§Ý§Ú§ã§î §ß§Ñ§ê§Ú§Þ§Ú §å§ã§Ý§å§Ô§Ñ§Þ§Ú\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        bytes32 num = bytes32(0);

        // check param
        if (_info.equals("")) {
            return;
        }

        if (_info.keyExists("num")) {
            num = PlatString.tobytes32(_info.getStringValueByKey("num"));
        }

        if (bytes32(0) == num) {
            return;
        }

        // update brief from json(similar to)
        updateBriefEx(_info);

        // update tracks from json(similar to)
        updateTracks(num, _info, uint(0));
    }

    function remove(bytes32 _num) public {
        uint index = 0;
        bool found = false;

        // check param
        if (bytes32(0) == _num) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        // remove num
        removeNum(index);

        // remove tracks at first
        removeTracks(_num);

        // delete brief
        delete infos_[_num];
    }

    function getTracks(bytes32 _num) public view returns (string) {
        uint index = 0;
        bool found = false;
        string memory str = "";

        // _num = PlatString.tobytes32("JNTCU0600046683YQ");

        // check param
        if (bytes32(0) == _num) {
            return str;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return str;
        }

        str = "[";
        for (uint i=0; i<infos_[_num].tracks_.length; i++) {
            str = str.concat("{", PlatString.bytes32ToString(infos_[_num].tracks_[i].type_).toKeyValue("type"), ",");
            str = str.concat(PlatString.bytes32ToString(infos_[_num].tracks_[i].time_).toKeyValue("time"), ",");
            str = str.concat(PlatString.bytes32ToString(infos_[_num].tracks_[i].country_).toKeyValue("country"), ",");
            str = str.concat(PlatString.bytes32ToString(infos_[_num].tracks_[i].city_).toKeyValue("city"), ",");
            str = str.concat(PlatString.bytes32ToString(infos_[_num].tracks_[i].facilityName_).toKeyValue("facilityName"), ",");
            str = str.concat(PlatString.bytes32ToString(infos_[_num].tracks_[i].timeZone_).toKeyValue("timeZone"), ",");
            str = str.concat(infos_[_num].tracks_[i].desc_.toKeyValue("desc"), ",");
            str = str.concat(PlatString.bytes32ToString(infos_[_num].tracks_[i].actionCode_).toKeyValue("actionCode"), "}");

            if (infos_[_num].tracks_.length != (i+1)) {
                str = str.concat(",");
            }
        }
        str = str.concat("]");

        return str;
    }

    function getBrief(bytes32 _num) public view returns (string, string, string, string, string) {
        uint index = 0;
        bool found = false;
        string[5] memory str = ["", "", "", "", ""];

        // _num = PlatString.tobytes32("JNTCU0600046683YQ");

        // check param
        if (bytes32(0) == _num) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        str[0] = PlatString.bytes32ToString(_num);
        str[1] = PlatString.bytes32ToString(infos_[_num].transNum_);
        str[2] = PlatString.bytes32ToString(infos_[_num].model_);
        str[3] = PlatString.bytes32ToString(infos_[_num].destinationCountry_);
        str[4] = PlatString.bytes32ToString(infos_[_num].lastStatus_);

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    function getBriefEx(bytes32 _num) public view returns (string) {
        uint index = 0;
        bool found = false;
        string memory str = "";

        // _num = PlatString.tobytes32("JNTCU0600046683YQ");

        // check param
        if (bytes32(0) == _num) {
            return str;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return str;
        }

        str = str.concat("{", PlatString.bytes32ToString(_num).toKeyValue("num"), ",");
        str = str.concat(PlatString.bytes32ToString(infos_[_num].transNum_).toKeyValue("transNum"), ",");
        str = str.concat(PlatString.bytes32ToString(infos_[_num].model_).toKeyValue("model"), ",");
        str = str.concat(PlatString.bytes32ToString(infos_[_num].destinationCountry_).toKeyValue("destinationCountry"), ",");
        str = str.concat(PlatString.bytes32ToString(infos_[_num].lastStatus_).toKeyValue("lastStatus"), "}");

        return str;
    }

    function number() public view returns (uint) {
        return nums_.length;
    }

    function numberOfTracks(bytes32 _num) public view returns (uint) {
        uint index = 0;
        bool found = false;

        // check param
        if (bytes32(0) == _num) {
            return 0;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return 0;
        }

        return infos_[_num].tracks_.length;
    }
}