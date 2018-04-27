/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBAgreement is DBEntity {
    bytes32 private status_ = "CREATE"; // 0: CREATED; 1: READY; 2: PUBLISHED; 3: PAID;
    uint private startTime_;
    uint private duration_;
    uint private price_;
    uint private refundPercentage_; // 1 : 100
    bytes32 private walletSymbol_;

    // Constructor
    constructor(bytes32 _name) public DBUser(_name) {
        setNodeType("agreement");
        status_ = 0;
    }

    function initParameters() internal {
        super.addParameter("status");
        super.addParameter("startTime");
        super.addParameter("endTime");
        super.addParameter("receiver");
    }

    function setParameter(bytes32 _parameter, string _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (status_ == "CREATED") {
            return super.setParameter(_parameter, _value);
        } else {
            return false;
        }
    }

    function addParameter(bytes32 _parameter, string _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (status_ == "CREATED") {
            return super.addParameter(_parameter, _value);
        } else {
            return false;
        }
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        return false;
    }

    function setAgreementStatus(bytes32 _tag, bytes32 _receiver) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (status_ == "PAID") return false;

        if(status_ == "CREATED" && _tag == "READY") {
            status_ = "READY";
        } else if (status_ == "READY" && _tag == "PUBLISHED") {
            status_ = "PUBLISHED";
        } else if (status_ == "PUBLISHED" && _tag == "PAID") {
            status_ = "PAID";
            startTime_ = now;
            endTime_ = SafeMath.add(startTime_, duration_);

            ret = super.setParameter("receiver", PlatString.bytes32ToString(_receiver));
            require(ret);
            ret = super.setParameter("startTime", PlatString.uintToString(startTime_));
            require(ret);
            super.setParameter("endTime", PlatString.uintToString(endTime_));
            ret = require(ret);
        } else {
            return false;
        }
        return super.setParameter("status",  _tag);
    }
 }


