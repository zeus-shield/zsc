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

    function getAgreementInfo() public constant returns (bytes32, bytes32, uint, uint, bytes32, uint) {
        checkDelegate(msg.sender, 1);

        return (PlatString.tobytes32(getParameter("status")),
                PlatString.tobytes32(getParameter("provider")),
                PlatString.stringToUint(getParameter("price")),
                PlatString.stringToUint(getParameter("lockedAmount")),
                PlatString.tobytes32(getParameter("walletSymbol")),
                PlatString.stringToUint(getParameter("endTime")) );

    }

 }


