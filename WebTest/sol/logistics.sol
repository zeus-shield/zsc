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
    }

    function getBriefInfo(bytes32 _num) public view returns (string) {
        // json formart
        string memory str ="{";
        str = PlatString.append(str, '"num":"', PlatString.bytes32ToString(_num), '",');
        str = PlatString.append(str, '"model":"', PlatString.bytes32ToString(infos_[_num].model_), '",');
        str = PlatString.append(str, '"destinationCountry":"', PlatString.bytes32ToString(infos_[_num].destinationCountry_), '",');
        str = PlatString.append(str, '"transNum":"', PlatString.bytes32ToString(infos_[_num].transNum_), '",');
        str = PlatString.append(str, '"lastStatus":"', PlatString.bytes32ToString(infos_[_num].lastStatus_), '"}');
        return str;
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

        if (index >= infos_[_num].tracks_.length) {
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
    function updateTracks(bytes32 _num, string _tracks, uint _updateType) internal {

        uint startIndex = uint(0);

        if ((bytes32(0) == _num) || _tracks.equals("")) {
            return;
        }

        if (_tracks.keyExists("trackElementList")) {

            string memory tracks = _tracks.getArrayValueByKey("trackElementList");
            if (!tracks.equals("")) {
                tracks.split("&", tracks_);

                if (uint(0) == _updateType) {
                    // delete all tracks at first
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

    function addTrack(bytes32 _num, string _tracks) public {
        updateTracks(_num, _tracks, uint(1));
    }

    function updateBrief(bytes32 _num, string _brief) public {
        bytes32 transNum = bytes32(0);
        bytes32 model = bytes32(0);
        bytes32 destinationCountry = bytes32(0);
        bytes32 lastStatus = bytes32(0);

        if ((bytes32(0) == _num) || _brief.equals("")) {
            return;
        }

        infos_[_num].num_ = _num;

        if (_brief.keyExists("transNum")) {
            transNum = PlatString.tobytes32(_brief.getStringValueByKey("transNum"));
            if (bytes32(0) != transNum) {
                infos_[_num].transNum_ = transNum;
            }
        }

        if (_brief.keyExists("model")) {
            model = PlatString.tobytes32(_brief.getStringValueByKey("model"));
            if (bytes32(0) != model) {
                infos_[_num].model_ = model;
            }
        }

        if (_brief.keyExists("destinationCountry")) {
            destinationCountry = PlatString.tobytes32(_brief.getStringValueByKey("destinationCountry"));
            if (bytes32(0) != destinationCountry) {
                infos_[_num].destinationCountry_ = destinationCountry;
            }
        }

        if (_brief.keyExists("lastStatus")) {
            lastStatus = PlatString.tobytes32(_brief.getStringValueByKey("lastStatus"));
            if (bytes32(0) != destinationCountry) {
                infos_[_num].lastStatus_ = lastStatus;
            }
        }

        // log0(_num);
        // log0(transNum);
        // log0(model);
        // log0(destinationCountry);
        // log0(lastStatus);
    }

    function updateBrief(bytes32 _num, bytes32 _transNum, bytes32 _model,
                         bytes32 _destinationCountry, bytes32 _lastStatus) public {
        if ((bytes32(0) == _num) || (bytes32(0) == _transNum) || (bytes32(0) == _model)
            || (bytes32(0) == _destinationCountry) || (bytes32(0) == _lastStatus)) {
            return;
        }

        // update brief
        infos_[_num].num_                = _num;
        infos_[_num].transNum_           = _transNum;
        infos_[_num].model_              = _model;
        infos_[_num].destinationCountry_ = _destinationCountry;
        infos_[_num].lastStatus_         = _lastStatus;
    }

    function update() public {
        string memory _info = "{\"error\":null,\"num\":\"JNTCU0600046683YQ\",\"transNum\":\"MSK0000027695\",\"model\":\"MOSEXP\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"§¡§â§Þ§Ñ§Ó§Ú§â\",\"timeZone\":\"+3\",\"desc\":\"§´§à§Ó§Ñ§â §Ò§í§Ý §å§ã§á§Ö§ê§ß§à §Õ§à§ã§ä§Ñ§Ó§Ý§Ö§ß §á§à§Ý§å§é§Ñ§ä§Ö§Ý§ð. §³§á§Ñ§ã§Ú§Ò§à §é§ä§à §Ó§à§ã§á§à§Ý§î§Ù§à§Ó§Ñ§Ý§Ú§ã§î §ß§Ñ§ê§Ú§Þ§Ú §å§ã§Ý§å§Ô§Ñ§Þ§Ú\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        bytes32 num = bytes32(0);

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
        updateBrief(num, _info);

        // update tracks from json(similar to)
        updateTracks(num, _info, uint(0));
    }

    function update(bytes32 _num, bytes32 _transNum, 
                    bytes32 _model, bytes32 _destinationCountry,
                    bytes32 _lastStatus, string _tracks) public {

        updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);

        // update tracks from json(similar to)
        if (!_tracks.equals("")) {
            updateTracks(_num, _tracks, uint(0));
        }
    }

    function findNum(bytes32 _num) internal returns (bool, uint) {
        uint i = 0;
        bool found = false;

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

    function remove(bytes32 _num) public {
        uint index = 0;
        bool found = false;

        // check param
        if (bytes32(0) == _num) {
            return;
        }

        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        // remove num
        //removeNum(index);

        // remove tracks at first
        removeTracks(_num);

        // delete brief
        delete infos_[_num];
    }
}