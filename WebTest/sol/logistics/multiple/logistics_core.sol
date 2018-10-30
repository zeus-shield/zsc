/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.21;
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
    function LogisticsCore() public {
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
    }

    function _allocTracks(string _validNum, uint _length) internal {
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
    }

    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) public {
    }

    function updateBrief(bool _numExist, string _num, string _transNum, string _model,
    }

    function updateBriefEx(bool _numExist, string _num, string _brief) public {
    }

    function remove(string _num) public {
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