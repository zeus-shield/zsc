/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../../common/delegate.sol";
import "./Logistics_database.sol";

contract LogisticsCore is Delegate {

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
    mapping(string => uint) private numIds_;

    /** @desc string(original num name) => bool(num exist flag) */
    mapping(string => bool) private numExists_;

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

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    function _addNum(string _num) private {
        numNames_[numTotalCount_] = _num;
        numIds_[_num] = numTotalCount_;

        numTotalCount_ ++;

        numExists_[_num] = true;
    }

    function _removeNum(string _num) private {
        string memory lastNumName = "";
        uint currentIndex = 0;

        // check num total count
        if (0 == numTotalCount_) {
            return;
        }

        lastNumName = numNames_[numTotalCount_-1];
        currentIndex = numIds_[_num];

        numNames_[currentIndex] = lastNumName;
        delete numNames_[numTotalCount_-1];

        numIds_[lastNumName] = currentIndex;
        delete numIds_[_num];

        numTotalCount_ --;

        numExists_[_num] = false;
    }
 
    function _getValidNumName(string _num) private view returns (string) {
        return _num.concat("-", numInvalidCounts_[_num].toString());
    }

    function setup(address _databaseAddr) external _onlyOwner {
        // check database address
        require(0 != _databaseAddr);
        databaseAddr_ = _databaseAddr;
    }

    // _updateType: 0 means overwrite, 1 means append
    function updateTracks(string _num, string _tracks, uint8 _updateType) external _onlyAdminOrHigher _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);
        require(0 != bytes(_tracks).length);
        require((0 == _updateType) || (1 == _updateType));

        // check num exist
        require(numExists_[_num]);

        // update tracks
        LogisticsDatabase(databaseAddr_).updateTracks(_getValidNumName(_num), _tracks, _updateType);
    }

    function updateBrief(string _num, string _transNum, string _model,
                         uint16 _destinationCountry, uint8 _lastStatus) public _onlyAdminOrHigher _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);

        if (!numExists_[_num]) {
            // add num
            _addNum(_num);
        }

        // update brief
        LogisticsDatabase(databaseAddr_).updateBrief(_getValidNumName(_num), _transNum, _model, _destinationCountry, _lastStatus);
    }

    function updateBriefEx(string _num, string _brief) public _onlyAdminOrHigher _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);
        require(0 != bytes(_brief).length);

        if (!numExists_[_num]) {
            // add num
            _addNum(_num);
        }

        // update brief ex
        LogisticsDatabase(databaseAddr_).updateBriefEx(_getValidNumName(_num), _brief);
    }

    function update(string _num, string _transNum, 
                    string _model, uint16 _destinationCountry,
                    uint8 _lastStatus, string _tracks) external _onlyAdminOrHigher {
        // update brief
        updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus);

        // update tracks from json(similar to)
        if (0 != bytes(_tracks).length) {
            this.updateTracks(_num, _tracks, 0);
        }
    }

    function updateEx(string _num, string _info) external _onlyAdminOrHigher {
        // update brief from json(similar to)
        updateBriefEx(_num, _info);

        // update tracks from json(similar to)
        this.updateTracks(_num, _info, uint8(0));
    }

    function remove(string _num) external _onlyAdminOrHigher _checkDatabaseAddr {
        // check param
        require(0 != bytes(_num).length);

        // check num exist
        require(numExists_[_num]);

        // remove database
        LogisticsDatabase(databaseAddr_).remove(_getValidNumName(_num));

        // remove num
        _removeNum(_num);
    }

    function invalid(string _num) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_num).length);

        // check num exist
        require(numExists_[_num]);

        // remove num
        _removeNum(_num);

        numInvalidCounts_[_num] ++;
    }

    function exist(string _num) external view returns (bool) {
        // check param
        if (0 == bytes(_num).length) {
            return false;
        }

        return numExists_[_num];
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
        if (!numExists_[_num]) {
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

    function getNumByIndex(uint _index) external view returns (string) {
        if(numTotalCount_ <= _index) {
            return "";
        }

        return numNames_[_index];
    }

    function getParcel(string _num) external view _checkDatabaseAddr returns (string, string, uint16, uint8, string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", 0, 0, "");
        }

        // check num exist
        if (!numExists_[_num]) {
            return ("", "", 0, 0, "");
        }

        return LogisticsDatabase(databaseAddr_).getParcel(_getValidNumName(_num));
    }

    function getParcelEx(string _num) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check num exist
        if (!numExists_[_num]) {
            return "";
        }

        return LogisticsDatabase(databaseAddr_).getParcelEx(_num, _getValidNumName(_num));
    }

    function getTracks(string _num) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check num exist
        if (!numExists_[_num]) {
            return "";
        }

        return LogisticsDatabase(databaseAddr_).getTracks(_getValidNumName(_num));
    }

    function getTrackElement(string _num, uint _index, string _tag) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check num exist
        if (!numExists_[_num]) {
            return "";
        }

        return LogisticsDatabase(databaseAddr_).getTrackElement(_getValidNumName(_num), _index, _tag);
    }

    function getBrief(string _num) external view _checkDatabaseAddr returns (string, string, string, uint16, uint8) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", 0, 0);
        }

        // check num exist
        if (!numExists_[_num]) {
            return ("", "", "", 0, 0);
        }

        return LogisticsDatabase(databaseAddr_).getBrief(_num, _getValidNumName(_num));
    }

    function getBriefEx(string _num) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return "";
        }

        // check num exist
        if (!numExists_[_num]) {
            return "";
        }

        return LogisticsDatabase(databaseAddr_).getBriefEx(_num, _getValidNumName(_num));
    }

    function getBriefByIndex(uint _index) external view _checkDatabaseAddr returns (string, string, string, uint16, uint8) {
        // check index
        // require(numTotalCount_ > _index);
        if(numTotalCount_ <= _index) {
            return ("", "", "", 0, 0);
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

    function getBriefElement(string _num, string _tag) external view _checkDatabaseAddr returns (string) {
        // check param
        if (0 == bytes(_num).length) {
            return ("");
        }

        // check num exist
        if (!numExists_[_num]) {
            return ("");
        }

        return LogisticsDatabase(databaseAddr_).getBriefElement(_getValidNumName(_num), _tag);
    }

    function getBriefElementByIndex(uint _index, string _tag) external view _checkDatabaseAddr returns (string) {
        return this.getBriefElement(this.getNumByIndex(_index), _tag);
    }

    function getBriefInvalid(string _num, uint _invalidIndex) external view _checkDatabaseAddr returns (string, string, string, uint16, uint8) {
        // check param
        if (0 == bytes(_num).length) {
            return ("", "", "", 0, 0);
        }

        // check invalid index
        // require(numInvalidCounts_[_num] > _invalidIndex);
        if (numInvalidCounts_[_num] <= _invalidIndex) {
            return ("", "", "", 0, 0);
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

    function getDatabaseContractAddress() external view _onlyOwner returns (address) {
        return databaseAddr_;
    }
}