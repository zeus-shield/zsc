/*
 Copyright (c) 2018, ZSC Dev Team
 2017-12-18: v0.01
*/

pragma solidity ^0.4.21;
//pragma experimental ABIEncoderV2;

import "./utillib/LibString.sol";
import "./logistics_track.sol";

contract Logistics {

    using LibString for *;

    struct Info {
        string num_;
        string transNum_;
        string model_;
        string destinationCountry_;
        string lastStatus_;
    }

    string[] private nums_;
    mapping(string => Info[]) private infos_;

    address trackAddress_;

    // Constructor
    function Logistics() public {
        nums_.length = 0;
        trackAddress_ = 0;
    }

    function setTrackContractAdress(address _address) public {
        trackAddress_ = _address;
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
 
    function findNumUpdateValidIndex(string _num) internal view returns (bool, uint) {
        if (0 == infos_[_num].length) {
            return (false, 0);
        } else {
            return (true, infos_[_num].length - 1);
        }
    }

    // _updateType: 0 means overwrite, 1 means add
    function updateTracks(string _num, string _tracks, uint _updateType) public {
        uint index = 0;
        uint numValidIndex = 0;
        bool found = false;

        // check param
        if ((0 == bytes(_num).length) || (0 == bytes(_tracks).length)) {
            return;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return;
        }

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            return;
        }

        if (0 != trackAddress_) {
            LogisticsTrack(trackAddress_).updateTracks(_num, numValidIndex, _tracks, _updateType);
        }
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public {
        
        uint index = 0;
        uint numValidIndex = 0;
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

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            // alloc num
            infos_[_num].length ++;
        }

        // update brief
        infos_[_num][numValidIndex].num_                = _num;
        infos_[_num][numValidIndex].transNum_           = _transNum;
        infos_[_num][numValidIndex].model_              = _model;
        infos_[_num][numValidIndex].destinationCountry_ = _destinationCountry;
        infos_[_num][numValidIndex].lastStatus_         = _lastStatus;
    }

    function updateBriefEx(string _brief) public {
        uint index = 0;
        uint numValidIndex = 0;
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

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(num);
        if (!found) {
            // alloc num
            infos_[num].length ++;
        }

        infos_[num][numValidIndex].num_ = num;

        if (_brief.keyExists("transNum")) {
            transNum = _brief.getStringValueByKey("transNum");
            if (0 != bytes(transNum).length) {
                infos_[num][numValidIndex].transNum_ = transNum;
            }
        }

        if (_brief.keyExists("model")) {
            model = _brief.getStringValueByKey("model");
            if (0 != bytes(model).length) {
                infos_[num][numValidIndex].model_ = model;
            }
        }

        if (_brief.keyExists("destinationCountry")) {
            destinationCountry = _brief.getStringValueByKey("destinationCountry");
            if (0 != bytes(destinationCountry).length) {
                infos_[num][numValidIndex].destinationCountry_ = destinationCountry;
            }
        }

        if (_brief.keyExists("lastStatus")) {
            lastStatus = _brief.getStringValueByKey("lastStatus");
            if (0 != bytes(lastStatus).length) {
                infos_[num][numValidIndex].lastStatus_ = lastStatus;
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
        uint numValidIndex = 0;
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

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            return;
        }

        // remove num
        removeNum(index);

        // remove tracks at first
        if (0 != trackAddress_) {
            LogisticsTrack(trackAddress_).removeTracks(_num, numValidIndex);
        }

        // delete brief
        delete infos_[_num][numValidIndex];
    }

    function checkNum(string _num) public view returns (bool) {
        uint index = 0;
        uint numValidIndex = 0;
        bool found = false;
 
        // check param
        if (0 == bytes(_num).length) {
            return false;
        }

        // find num
        (found, index) = findNum(_num);
        if (!found) {
            return false;
        }

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            return false;
        }

        return true;
    }

    function getBrief(string _num) public view returns (string, string, string, string, string) {
        uint index = 0;
        uint numValidIndex = 0;
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

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        str[0] = _num;
        str[1] = infos_[_num][numValidIndex].transNum_;
        str[2] = infos_[_num][numValidIndex].model_;
        str[3] = infos_[_num][numValidIndex].destinationCountry_;
        str[4] = infos_[_num][numValidIndex].lastStatus_;

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    function getBriefEx(string _num) public view returns (string) {
        uint index = 0;
        uint numValidIndex = 0;
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

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            return str;
        }

        str = str.concat("{", _num.toKeyValue("num"), ",");
        str = str.concat(infos_[_num][numValidIndex].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(infos_[_num][numValidIndex].model_.toKeyValue("model"), ",");
        str = str.concat(infos_[_num][numValidIndex].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(infos_[_num][numValidIndex].lastStatus_.toKeyValue("lastStatus"), "}");

        return str;
    }

    function getBriefByIndex(uint _index) public view returns (string, string, string, string, string) {
        uint numValidIndex = 0;
        bool found = false;
        string memory num = "";
        string[5] memory str = ["", "", "", "", ""];

        // check param
        if (nums_.length <= _index) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        num = nums_[_index];

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(num);
        if (!found) {
            return (str[0], str[1], str[2], str[3], str[4]);
        }

        str[0] = num;
        str[1] = infos_[num][numValidIndex].transNum_;
        str[2] = infos_[num][numValidIndex].model_;
        str[3] = infos_[num][numValidIndex].destinationCountry_;
        str[4] = infos_[num][numValidIndex].lastStatus_;

        return (str[0], str[1], str[2], str[3], str[4]);
    }

    function getBriefExByIndex(uint _index) public view returns (string) {
        uint numValidIndex = 0;
        bool found = false;
        string memory num = "";
        string memory str = "";

        // check param
        if (nums_.length <= _index) {
            return str;
        }

        num = nums_[_index];

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(num);
        if (!found) {
            return str;
        }

        str = str.concat("{", num.toKeyValue("num"), ",");
        str = str.concat(infos_[num][numValidIndex].transNum_.toKeyValue("transNum"), ",");
        str = str.concat(infos_[num][numValidIndex].model_.toKeyValue("model"), ",");
        str = str.concat(infos_[num][numValidIndex].destinationCountry_.toKeyValue("destinationCountry"), ",");
        str = str.concat(infos_[num][numValidIndex].lastStatus_.toKeyValue("lastStatus"), "}");

        return str;
    }

    function number() public view returns (uint) {
        return nums_.length;
    }

    function numberOfTracks(string _num) public view returns (uint) {
        uint index = 0;
        uint numValidIndex = 0;
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

        // find num valid index
        (found, numValidIndex) = findNumUpdateValidIndex(_num);
        if (!found) {
            return 0;
        }

        if (0 != trackAddress_) {
            return LogisticsTrack(trackAddress_).numberOfTracks(_num, numValidIndex);
        }

        return 0;
    }
}