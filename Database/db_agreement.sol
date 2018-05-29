/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBAgreement is DBEntity {
    bytes32 private status_ = "CREATE"; // 0: CREATED; 1: READY; 2: PUBLISHED; 3: PAID;
    uint private startTime_;
    uint private duration_;
    uint private endTime_;
    uint private price_;
    uint private refundPercentage_; // 1 : 100
    bytes32 private walletSymbol_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBEntity(_name) {
        setNodeType("agreement");
    }

    function initParameters() internal {
        addFundamentalParameter("status");
        addFundamentalParameter("startTime");
        addFundamentalParameter("endTime");
        addFundamentalParameter("receiver");
    }

    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (_parameter == "copies") {
            return true;
        }

        if (status_ == "CREATED") {
            return super.setParameter(_parameter, _value);
        } else {
            return false;
        }
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (_parameter == "copies" && numChildren() > 0) {
            return false;
        }

        if (status_ == "CREATED") {
            return super.addFundamentalParameter(_parameter);
        } else {
            return false;
        }
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        revert();
        return (_parameter == "null");
    }

    function setAgreementStatus(bytes32 _tag, bytes32 _receiver) public returns (bool) {
        checkDelegate(msg.sender, 1);
        bytes32 curTag = _tag;
        bool ret;

        if (status_ == "PAID") return false;

        if(status_ == "CREATED" && curTag == "READY") {
            status_ = "READY";
        } else if (status_ == "READY") {
            if(curTag == "PUBLISHED") {
                status_ = "PUBLISHED";
            }
        } else if (status_ == "PUBLISHED" && curTag == "PAID") {
            bytes32 temp;

            status_ = "PAID";
            startTime_ = now;
            endTime_ = SafeMath.add(startTime_, duration_);

            ret = super.setParameter("receiver", _receiver);
            require(ret);

            temp = PlatString.tobytes32(PlatString.uintToString(startTime_));
            ret = super.setParameter("startTime", temp);
            require(ret);

            temp = PlatString.tobytes32(PlatString.uintToString(endTime_));
            ret = super.setParameter("endTime", temp);
            require(ret);
        } else {
            return false;
        }
        return super.setParameter("status", curTag);
    }

    function getAgreementInfo() public constant returns (bytes32, bytes32, uint, uint, bytes32, uint) {
        checkDelegate(msg.sender, 1);

        uint price = PlatString.stringToUint(PlatString.bytes32ToString(getParameter("price")));
        uint lockedAmount = PlatString.stringToUint(PlatString.bytes32ToString(getParameter("lockedAmount")));
        uint endTime = PlatString.stringToUint(PlatString.bytes32ToString(getParameter("endTime")));

        return (getParameter("status"),
                getParameter("provider"),
                price,
                lockedAmount,
                getParameter("walletSymbol"),
                endTime);
    }

 }


