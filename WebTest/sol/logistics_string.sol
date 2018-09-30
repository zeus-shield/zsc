/*
 Copyright (c) 2018, ZSC Dev Team
 2017-12-18: v0.01
*/

pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

import "./utillib/LibString.sol";

contract Logistics {

    using LibString for *;

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

    struct Info {
        string num_;
        string transNum_;
        string model_;
        string destinationCountry_;
        string lastStatus_;

        Track[] tracks_;
    }

    string[] private nums_;
    mapping(string => Info) private infos_;

    string[] private tracks_;

    // Constructor
    function Logistics() public {
        nums_.length = 0;
        tracks_.length = 0;
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
 
    function allocTracks(string _num, uint length) internal {
        infos_[_num].tracks_.length += length;
    }

    function removeTracks(string _num) internal {
        for (uint i=0; i<infos_[_num].tracks_.length; i++) {
            delete infos_[_num].tracks_[i];
        }
        infos_[_num].tracks_.length = 0;
    }

    function updateTrack(string _num, uint index, string _track) internal {
        string memory type32 = "";
        string memory time = "";
        string memory country = "";
        string memory city = "";
        string memory facilityName = "";
        string memory timeZone = "";
        string memory desc = "";
        string memory actionCode = "";

        if (infos_[_num].tracks_.length <= index) {
            return;
        }

        if (_track.keyExists("type")) {
            type32 = _track.getStringValueByKey("type");
            if (0 != bytes(type32).length) {
                infos_[_num].tracks_[index].type_ = type32;
            }
        }

        if (_track.keyExists("time")) {
            time = _track.getStringValueByKey("time");
            if (0 != bytes(time).length) {
                infos_[_num].tracks_[index].time_ = time;
            }
        }

        if (_track.keyExists("country")) {
            country = _track.getStringValueByKey("country");
            if (0 != bytes(country).length) {
                infos_[_num].tracks_[index].country_ = country;
            }
        }

        if (_track.keyExists("city")) {
            city = _track.getStringValueByKey("city");
            if (0 != bytes(city).length) {
                infos_[_num].tracks_[index].city_ = city;
            }
        }

        if (_track.keyExists("facilityName")) {
            facilityName = _track.getStringValueByKey("facilityName");
            if (0 != bytes(facilityName).length) {
                infos_[_num].tracks_[index].facilityName_ = facilityName;
            }
        }

        if (_track.keyExists("timeZone")) {
            timeZone = _track.getStringValueByKey("timeZone");
            if (0 != bytes(timeZone).length) {
                infos_[_num].tracks_[index].timeZone_ = timeZone;
            }
        }

        if (_track.keyExists("desc")) {
            desc = _track.getStringValueByKey("desc");
            if (0 != bytes(desc).length) {
                infos_[_num].tracks_[index].desc_ = desc;
            }
        }

        if (_track.keyExists("actionCode")) {
            actionCode = _track.getStringValueByKey("actionCode");
            if (0 != bytes(actionCode).length) {
                infos_[_num].tracks_[index].actionCode_ = actionCode;
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

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (0 != bytes(tracks).length) {
                tracks.split("&", tracks_);

                if (0 == _updateType) {
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

        infos_[num].num_ = num;

        if (_brief.keyExists("transNum")) {
            transNum = _brief.getStringValueByKey("transNum");
            if (0 != bytes(transNum).length) {
                infos_[num].transNum_ = transNum;
            }
        }

        if (_brief.keyExists("model")) {
            model = _brief.getStringValueByKey("model");
            if (0 != bytes(model).length) {
                infos_[num].model_ = model;
            }
        }

        if (_brief.keyExists("destinationCountry")) {
            destinationCountry = _brief.getStringValueByKey("destinationCountry");
            if (0 != bytes(destinationCountry).length) {
                infos_[num].destinationCountry_ = destinationCountry;
            }
        }

        if (_brief.keyExists("lastStatus")) {
            lastStatus = _brief.getStringValueByKey("lastStatus");
            if (0 != bytes(lastStatus).length) {
                infos_[num].lastStatus_ = lastStatus;
            }
        }

        // log0(num.toBytes32());
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

        // remove tracks at first
        removeTracks(_num);

        // delete brief
        delete infos_[_num];
    }

    function getTracks(string _num) public view returns (string) {
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

        str = "[";
        for (uint i=0; i<infos_[_num].tracks_.length; i++) {
            str = str.concat("{", infos_[_num].tracks_[i].type_.toKeyValue("type"), ",");
            str = str.concat(infos_[_num].tracks_[i].time_.toKeyValue("time"), ",");
            str = str.concat(infos_[_num].tracks_[i].country_.toKeyValue("country"), ",");
            str = str.concat(infos_[_num].tracks_[i].city_.toKeyValue("city"), ",");
            str = str.concat(infos_[_num].tracks_[i].facilityName_.toKeyValue("facilityName"), ",");
            str = str.concat(infos_[_num].tracks_[i].timeZone_.toKeyValue("timeZone"), ",");
            str = str.concat(infos_[_num].tracks_[i].desc_.toKeyValue("desc"), ",");
            str = str.concat(infos_[_num].tracks_[i].actionCode_.toKeyValue("actionCode"), "}");

            if (infos_[_num].tracks_.length != (i+1)) {
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

        str[0] = _num;
        str[1] = infos_[_num].transNum_;
        str[2] = infos_[_num].model_;
        str[3] = infos_[_num].destinationCountry_;
        str[4] = infos_[_num].lastStatus_;

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

        str = str.concat("{", _num.toKeyValue("num"), ",");
        str = str.concat(infos_[_num].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(infos_[_num].model_.toKeyValue("model"), ",");
        str = str.concat(infos_[_num].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(infos_[_num].lastStatus_.toKeyValue("lastStatus"), "}");

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
        str[0] = num;
        str[1] = infos_[num].transNum_;
        str[2] = infos_[num].model_;
        str[3] = infos_[num].destinationCountry_;
        str[4] = infos_[num].lastStatus_;

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
        str = str.concat("{", num.toKeyValue("num"), ",");
        str = str.concat(infos_[num].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(infos_[num].model_.toKeyValue("model"), ",");
        str = str.concat(infos_[num].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(infos_[num].lastStatus_.toKeyValue("lastStatus"), "}");

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

        return infos_[_num].tracks_.length;
    }
}