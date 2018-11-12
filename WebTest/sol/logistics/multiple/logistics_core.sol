/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "./Logistics_database.sol";

contract LogisticsCore {

    using LibString for *;
    using LibInt for *;

    /** @desc database address */
    address private databaseAddr_;

    /*************************************************/
    /** @desc num total count */
    uint private numTotalCount_;

    /** @desc uint(num index) => string(original num name) */
    mapping(uint => string) private numNames_;

    /** @desc string(original num name) => uint(num index) */
    mapping(string => uint) private numIndexs_;

    /** @desc string(original num name) => bool(num exist flag) */
    mapping(string => bool) private numExist_;

    /** @desc string(original num name) => uint(num invalid count) */
    mapping(string => uint) private numInvalidCounts_;
    /*************************************************/

    // Constructor
    constructor() public {
        databaseAddr_ = 0;
        numTotalCount_ = 0;
    }

    modifier _checkDatabaseAddr() {
        require(0 != databaseAddr_);
        _;
    }

    function _addNum(string _num) internal {
        numNames_[numTotalCount_] = _num;
        numIndexs_[_num] = numTotalCount_;

        numTotalCount_ ++;

        numExist_[_num] = true;
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

        numExist_[_num] = false;
    }
 
    function _getValidNumName(string _num) internal view returns (string) {
        return _num.concat("-", numInvalidCounts_[_num].toString());
    }

    function setup(address _databaseAddr) external {
        // check database address
        require(0 != _databaseAddr);

        databaseAddr_ = _databaseAddr;
    }

    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint _updateType) external _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);
        require(0 != bytes(_tracks).length);
        require((0 == _updateType) || (1 == _updateType));

        // check num exist
        require(numExist_[_num]);

        // update tracks
        LogisticsDatabase(databaseAddr_).updateTracks(_getValidNumName(_num), _tracks, _updateType);
    }

    function updateBrief(string _num, string _transNum, string _model,
                         string _destinationCountry, string _lastStatus) public _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);

        if (!numExist_[_num]) {
            // add num
            _addNum(_num);
        }

        // update brief
        LogisticsDatabase(databaseAddr_).updateBrief(_getValidNumName(_num), _transNum, _model, _destinationCountry, _lastStatus);
    }

    function updateBriefEx(string _num, string _brief) public _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);
        require(0 != bytes(_brief).length);

        if (!numExist_[_num]) {
            // add num
            _addNum(_num);
        }

        // update brief ex
        LogisticsDatabase(databaseAddr_).updateBriefEx(_getValidNumName(_num), _brief);
    }

    function update(string _num, string _transNum, 
                    string _model, string _destinationCountry,
                    string _lastStatus, string _tracks) external {
        // update brief
        updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);

        // update tracks from json(similar to)
        if (0 != bytes(_tracks).length) {
            this.updateTracks(_num, _tracks, 0);
        }
    }

    function updateEx(string _num, string _info) external {
        // update brief from json(similar to)
        updateBriefEx(_num, _info);

        // update tracks from json(similar to)
        this.updateTracks(_num, _info, uint(0));
    }

    function remove(string _num) external _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);

        // check num exist
        require(numExist_[_num]);

        // remove database
        LogisticsDatabase(databaseAddr_).remove(_getValidNumName(_num));

        // remove num
        _removeNum(_num);
    }

    function invalid(string _num) external {
        // check param
        require(0 != bytes(_num).length);

        // check num exist
        require(numExist_[_num]);

        // remove num
        _removeNum(_num);

        numInvalidCounts_[_num] ++;
    }

    function exist(string _num) external view returns (bool) {
        // check param
        if (0 == bytes(_num).length) {
            return false;
        }

        return numExist_[_num];
    }

    function number() external view returns (uint) {
        return numTotalCount_;
    }

    function numberOfTracks(string _num) external view _checkDatabaseAddr returns (uint) {
        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        // check num exist
        if (!numExist_[_num]) {
            return 0;
        }

        return LogisticsDatabase(databaseAddr_).numberOfTracks(_getValidNumName(_num));
    }

    function numberOfInvalid(string _num) external view returns (uint) {
        // check param
        if (0 == bytes(_num).length) {
            return 0;
        }

        return numInvalidCounts_[_num];
    }

    function getTracks(string _num) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check num exist
        if (!numExist_[_num]) {
            return "";
        }

        return LogisticsDatabase(databaseAddr_).getTracks(_getValidNumName(_num));
    }

    function getBrief(string _num) external view _checkDatabaseAddr returns (string, string, string, string, string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", "", "");
        }

        // check num exist
        if (!numExist_[_num]) {
            return ("", "", "", "", "");
        }

        return LogisticsDatabase(databaseAddr_).getBrief(_num, _getValidNumName(_num));
    }

    function getBriefEx(string _num) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check num exist
        if (!numExist_[_num]) {
            return "";
        }

        return LogisticsDatabase(databaseAddr_).getBriefEx(_num, _getValidNumName(_num));
    }

    function getBriefByIndex(uint _index) external view _checkDatabaseAddr returns (string, string, string, string, string) {
        // check index
        // require(numTotalCount_ > _index);
        if(numTotalCount_ <= _index) {
            return ("", "", "", "", "");
        }

        string memory num = numNames_[_index];

        return LogisticsDatabase(databaseAddr_).getBrief(num, _getValidNumName(num));
    }

    function getBriefExByIndex(uint _index) external view _checkDatabaseAddr returns (string) {
        // check index
        // require(numTotalCount_ > _index);
        if(numTotalCount_ <= _index) {
            return ("");
        }        

        string memory num = numNames_[_index];

        return LogisticsDatabase(databaseAddr_).getBriefEx(num, _getValidNumName(num));
    }

    function getBriefInvalid(string _num, uint _invalidIndex) external view _checkDatabaseAddr returns (string, string, string, string, string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", "", "");
        }

        // check invalid index
        // require(numInvalidCounts_[_num] > _invalidIndex);
        if (numInvalidCounts_[_num] <= _invalidIndex) {
            return ("", "", "", "", "");
        }

        // don't need to check num exist

        // get invalid num name
        string memory invalidNum = _num.concat("-", _invalidIndex.toString());

        return LogisticsDatabase(databaseAddr_).getBrief(invalidNum, invalidNum);
    }

    function getTracksInvalid(string _num, uint _invalidIndex) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check invalid index
        // require(numInvalidCounts_[_num] > _invalidIndex);
        if (numInvalidCounts_[_num] <= _invalidIndex) {
            return ("");
        }        

        // don't need to check num exist

        // find invalid num name
        string memory invalidNum = _num.concat("-", _invalidIndex.toString());

        return LogisticsDatabase(databaseAddr_).getTracks(invalidNum);
    }
}