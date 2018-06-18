/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBAgreement is DBEntity {
    bytes32 private status_ ; // 0: CREATED; 1: PUBLISHED; 2: PAID;
    uint private startTime_;
    uint private duration_;
    uint private endTime_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBEntity(_name) {
        nodeType_ = "agreement";
        status_ = "CREATED"; 
    }

    function initParameters() internal {
        addFundamentalParameter("status");
        addFundamentalParameter("endTime");
        addFundamentalParameter("receiver");

        super.setParameter("status", "CREATED");
    }

    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (status_ == "CREATED") {
            if (_parameter == "duration") {
                duration_ = PlatString.stringToUint(PlatString.bytes32ToString(_value));
            }
            return super.setParameter(_parameter, _value);
        } else {
            return false;
        }
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (status_ == "CREATED") {
            return addFundamentalParameter(_parameter);
        } else {
            return false;
        }
    }

    function setAgreementStatus(bytes32 _tag, bytes32 _receiver) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (status_ == "PAID") return false;

        if(status_ == "CREATED" && _tag == "PUBLISHED") {
            status_ = "PUBLISHED";
        } else if (status_ == "PUBLISHED" && _tag == "PAID") {
            bytes32 temp;

            status_ = "PAID";
            startTime_ = now;
            endTime_ = startTime_ + duration_;

            super.setParameter("receiver", _receiver);

            temp = PlatString.tobytes32(PlatString.uintToString(startTime_));
            super.setParameter("startTime", temp);
        } else {
            return false;
        }
        return super.setParameter("status", status_);
    }

    /*
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
    */

    function simulatePayforInsurance() public returns (uint) {
        uint current = now;
        if (current < endTime_) return 0;

        uint randValue = uint(keccak256(block.blockhash(block.number-1), current ))%100;

        if (randValue < 50) {
            status_ = "Insurance to receiver";
            super.setParameter("status", status_);
            return 1;
        } else {
            status_ = "Paid to provider";
            super.setParameter("status", status_);
            return 2;
        }
    } 
 }


