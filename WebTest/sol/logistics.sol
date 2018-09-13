/*
 Copyright (c) 2018, ZSC Dev Team
 2017-12-18: v0.01
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";

contract Logistics {

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
        bytes32 num_;
        bytes32 transNum_;
        bytes32 model_;
        bytes32 destinationCountry_;
        bytes32 lastStatus_;
        Track lastTrack_;
    }

    struct Detail {
        Track[] tracks_;
    }

    mapping(bytes32 => Brief) private briefs_;
    mapping(bytes32 => Detail) private details_;

    // Constructor
    function Logistics() public { 
    }

    function setBrief(bytes32 _num, bytes32 _transNum, 
                      bytes32 _model, bytes32 _destinationCountry,
                      bytes32 _lastStatus) public {
        briefs_[_num].num_                = _num;
        briefs_[_num].transNum_           = _transNum;
        briefs_[_num].model_              = _model;
        briefs_[_num].destinationCountry_ = _destinationCountry;
        briefs_[_num].lastStatus_         = _lastStatus;
    }

    function getBrief(bytes32 _num) public view returns (string) {
        // json formart
        string memory str ="{";
        str = PlatString.append(str, '"num":"', PlatString.bytes32ToString(_num), '",');
        str = PlatString.append(str, '"model":"', PlatString.bytes32ToString(briefs_[_num].model_), '",');
        str = PlatString.append(str, '"destinationCountry":"', PlatString.bytes32ToString(briefs_[_num].destinationCountry_), '",');
        str = PlatString.append(str, '"transNum":"', PlatString.bytes32ToString(briefs_[_num].transNum_), '",');
        str = PlatString.append(str, '"lastStatus":"', PlatString.bytes32ToString(briefs_[_num].lastStatus_), '"}');
        return str;
    }
}
