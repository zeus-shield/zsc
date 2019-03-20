/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;

import "../utillib/LibString.sol";
import "../utillib/LibInt.sol";
import "../common/delegate.sol";
import "../common/integral.sol";

contract InsuranceIntegral is Delegate, Integral {

    using LibString for *;
    using LibInt for *;

    struct Trace {
        uint8 type_;
        uint time_;
        uint value_;
        address from_;
        address to_;
    }

    struct TraceDay {
        uint size_;
        /** @dev id => trace info */
        mapping (uint => Trace) infos_;
    }

    struct TraceList {
        /** @dev day size */
        uint size_;
        /** @dev id => day id */
        mapping (uint => uint) dayIds_;
        /** @dev day id => day info */
        mapping (uint => TraceDay) days_;
    }

    uint private cap_;
    mapping (uint8 => uint) private threshold_;
    mapping (address => TraceList) private traces_;

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    modifier _onlyReaderOrHigher() {
        require(checkDelegate(msg.sender, 3));
        _;
    }

    /**
     * @dev Construct the contract.
     */
    constructor () public {
        cap_ = 100000;
        threshold_[0] = 40;
        threshold_[1] = 30;
        threshold_[2] = 20;
        threshold_[3] = 20;
        threshold_[4] = 20;
        threshold_[5] = 20;
        threshold_[6] = 20;
        threshold_[7] = 20;
    }

    /**
     * @dev Destroy the contract.
     */
    function destroy() public _onlyOwner {
        super.kill();
    }

    /**
     * @dev Claim integrals.
     * @param _account address The address that will claim the integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @return Success or failure.
     */
    function claim(address _account, uint8 _type) public _onlyAdminOrHigher returns (bool) {
        if (0 <= _type && 8 > _type) {
            return mint(_account, threshold_[_type]);
        }
        return false;
    }    

    /**
     * @dev Mint integrals.
     * @param _account address The address that will receive the minted integrals.
     * @param _value uint The amount of integrals to mint.
     * @return Success or failure.
     */
    function mint(address _account, uint _value) public _onlyAdminOrHigher returns (bool) {
        if (totalSupply().add(_value) > cap_) {
            return false;
        }
        _mint(_account, _value);
        return true;
    }

    /**
     * @dev Burns a specific amount of integrals.
     * @param _account address The account whose integrals will be burnt.
     * @param _value uint The amount of integral to be burned.
     */
    function burn(address _account, uint _value) public _onlyAdminOrHigher {
        _burn(_account, _value);
    }

    /**
     * @dev Transfer integral to a specified address.
     * @param _owner address The address which owns the integrals.
     * @param _to address The address to transfer to.
     * @param _value uint The amount to be transferred.
     * @return Success or failure.
     */
    function transfer(address _owner, address _to, uint _value) public _onlyAdminOrHigher returns (bool) {
        return super.transfer(_owner, _to, _value);
    }

    /**
     * @dev Add trace.
     * @param _account address The account whose integrals will be traced.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     *         8: Administrator award.
     *         9: Integrals spent.
     *        10: Integrals transfer to someone.
     *        11: Integrals transfer from someone.
     * @param _time uint The trace time(UTC), including TZ and DST.
     * @param _value The amount of integral.
     * @param _from address The address which you want to send integrals from
     * @param _to address The address which you want to transfer to
     */
    function addTrace(address _account, uint8 _type, uint _time, uint _value, address _from, address _to) public _onlyAdminOrHigher {
        // check params
        require(address(0) != _account);
        require(0 <= _type && 12 > _type);

        bool exist = false;
        uint dayId = (_time)/(1 days);

        // check day id exist ?
        for (uint i=0; i<traces_[_account].size_; i++) {
            if (dayId == traces_[_account].dayIds_[i]) {
                exist = true;
                break;
            }
        }

        if (!exist) {
            traces_[_account].dayIds_[traces_[_account].size_] = dayId;
            traces_[_account].size_ ++;
        } 

        traces_[_account].days_[dayId].infos_[traces_[_account].days_[dayId].size_].type_ = _type;
        traces_[_account].days_[dayId].infos_[traces_[_account].days_[dayId].size_].time_ = _time;
        traces_[_account].days_[dayId].infos_[traces_[_account].days_[dayId].size_].value_ = _value;
        traces_[_account].days_[dayId].infos_[traces_[_account].days_[dayId].size_].from_ = _from;
        traces_[_account].days_[dayId].infos_[traces_[_account].days_[dayId].size_].to_ = _to;
        traces_[_account].days_[dayId].size_ ++;
    }

    /**
     * @dev Remove trace.
     * @param _account address The account whose integrals have be traced.
     */
    function removeTrace(address _account) public _onlyAdminOrHigher {
        // check params
        require(address(0) != _account);

        // loop trace day size
        for (uint i=0; i<traces_[_account].size_; i++) {
            traces_[_account].days_[traces_[_account].dayIds_[i]].size_ = 0;
        }

        traces_[_account].size_ = 0;
    }

    /**
     * @dev Update the threshold of different types of bonus integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @param _threshold uint The threshold of different types of bonus integrals.
     */
    function updateThreshold(uint8 _type, uint _threshold) public _onlyAdminOrHigher {
        // check params
        require(0 <= _type && 8 > _type);
        threshold_[_type] = _threshold;
    }

    /**
     * @dev Update cap of integrals.
     * @param _newCap uint The new cap of integrals.
     */
    function updateCap(uint _newCap) public _onlyAdminOrHigher {
        require(_newCap >= totalSupply());
        cap_ = _newCap;
    }

    /**
     * @dev Get trace.
     * @param _account address The account whose integrals have be traced.
     * @param _startTime uint The start time of trace(UTC), including TZ and DST.
     * @param _endTime uint The end time of trace(UTC), including TZ and DST.
     */
    function trace(address _account, uint _startTime, uint _endTime) public view _onlyReaderOrHigher returns (string) {
        // check params
        require(address(0) != _account);
        require(_startTime <= _endTime);

        uint size = 0;
        string memory json = "{\"list\":[";
        // loop trace day size
        for (uint i=0; i<traces_[_account].size_; i++) {
            uint dayId = traces_[_account].dayIds_[i];
            if (((_startTime/(1 days)) <= dayId) && (dayId <= (_endTime/(1 days)))) {
                // loop trace info size for one day
                for (uint j=0; j<traces_[_account].days_[dayId].size_; j++) {
                    // uint claimType = traces_[_account].days_[dayId].infos_[j].type_;
                    // uint time = traces_[_account].days_[dayId].infos_[j].time_;
                    // uint value = traces_[_account].days_[dayId].infos_[j].value_;
                    json = json.concat("{", uint(traces_[_account].days_[dayId].infos_[j].type_).toKeyValue("type"), ",");
                    json = json.concat(traces_[_account].days_[dayId].infos_[j].time_.toKeyValue("time"), ",");
                    json = json.concat(traces_[_account].days_[dayId].infos_[j].value_.toKeyValue("value"), ",");
                    json = json.concat(traces_[_account].days_[dayId].infos_[j].from_.toKeyValue("from"), ",");
                    json = json.concat(traces_[_account].days_[dayId].infos_[j].to_.toKeyValue("to"), "},");
                    size ++;
                }
            }
        }

        if (0 < size) {
            uint reserve = 0;
            json = json.concat("{", reserve.toKeyValue("type"), ",");
            json = json.concat(reserve.toKeyValue("time"), ",");
            json = json.concat(reserve.toKeyValue("value"), "}");
        }
        
        json = json.concat("]}");

        return json;
    }

    /**
     * @dev Get trace size.
     * @param _account address The account whose integrals will be traced.
     * @param _time uint The search time of trace(UTC), including TZ and DST.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     *         8: Administrator award.
     *         9: Integrals spent.
     *        10: Integrals transfer to someone.
     *        11: Integrals transfer from someone.
     */
    function traceSize(address _account, uint _time, uint8 _type) public view _onlyReaderOrHigher returns (uint) {
        // check params
        require(address(0) != _account);
        require(0 <= _type && 12 > _type);

        uint size = 0;
        uint Id = (_time)/(1 days);
        uint dayId = 0;
        for (uint i=0; i<traces_[_account].size_; i++) {
            dayId = traces_[_account].dayIds_[i];
            if (Id == dayId) {
                for (uint j=0; j<traces_[_account].days_[dayId].size_; j++) {
                    if (traces_[_account].days_[dayId].infos_[j].type_ == _type) {
                        size ++;
                    }
                }
            }
        }

        return size;
    }

    /**
     * @dev Get the threshold of different types of bonus integrals.
     * @param _type uint8 The types of bonus integrals.
     *         0: User sign up.
     *         1: User submit data.
     *         2: User check in every day.
     *         3: User invite others.
     *         4: User share to Wechat.
     *         5: User share to QQ.
     *         6: User share to Microblog.
     *         7: User click advertisements.
     * @return The threshold of different types of bonus integrals.
     */
    function threshold(uint8 _type) public view _onlyReaderOrHigher returns (uint) {
        return threshold_[_type];
    }

    /**
     * @dev Get the cap of integrals.
     * @return The cap of integrals.
     */
    function cap() public view _onlyReaderOrHigher returns (uint) {
        return cap_;
    }

    /**
     * @dev Total number of integrals in existence
     * @return The total of integrals.
     */
    function totalSupply() public view _onlyReaderOrHigher returns (uint) {
        return super.totalSupply();
    }

    /**
     * @dev Gets the balance of the specified address.
     * @param _owner The address to query the balance of.
     * @return A uint representing the amount owned by the passed address.
     */
    function balanceOf(address _owner) public view _onlyReaderOrHigher returns (uint) {
        return super.balanceOf(_owner);
    }
}
