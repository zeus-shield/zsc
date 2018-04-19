/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";

contract DBAgreement is DBEntity {
    bytes32 private status_ = "CREATE"; // 0: CREATED; 1: READY; 2: PUBLISHED; 3: PAID;
    uint private startTime_;
    uint private duration_;
    uint private price_;
    uint private refundPercentage_; // 1 : 100
    bytes32 private walletSymbol_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBUser(_name) {
        setNodeType("agreement");
        status_ = 0;
    }

    function initParameters() internal {
        addParameter("status");
        addParameter("startTime");
        addParameter("endTime");
        addParameter("receiver");
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (status_ == "CREATED" || status_ == "READY") {
            if (_parameter == "duration") {
                duration = PlatString.stringToUint(_value);
            } else if (_parameter == "walletSymbol") {
                walletSymbol_ = PlatString.tobytes32(_value);
            } else if (_parameter == "price") {
                price_ = PlatString.stringToUint(_value);
            } else if (_parameter == "fefund (%)") {
                refundPercentage_ = PlatString.stringToUint(_value);
            } else if (_parameter == "provider") {
                return false;
            } else if (_parameter == "receiver") {
                return false;
            }
            return super.setParameter(_parameter, _value);
        } else {
            return false;
        }
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (status_ == "CREATED") {
            return super.addParameter(_parameter, _value);
        } else {
            return false;
        }
    }

    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        if (status_ == "CREATED") {
            return super.removeParameter(_parameter);
        } else {
            return false;
        }
    }

    function setAgreementStatus(bytes32 _tag, bytes32 _receiver) public only_delegate(1) returns (bool) {
        if (status_ == "PAID") return false;

        if(status_ == "CREATED" && _tag == "READY") {
            super.setParameter("status", "READY");
            status_ = "READY";
        } else if (status_ == "READY" && _tag == "PUBLISHED") {
            super.setParameter("status", "PUBLISHED");
            status_ = "PUBLISHED";
        } else if (status_ == "PUBLISHED" && _tag == "PAID") {
            status_ = "PAID";
            startTime_ = now;
            endTime_ = startTime_ + duration_;
    
            super.setParameter("receiver", _receiver);
            super.setParameter("status", "PAID");
            super.setParameter("startTime", PlatString.uintToString(startTime_));
            super.setParameter("endTime", PlatString.uintToString(endTime_));
        } else {
            return false;
        }
        return super.setParameter("status",  _tag);
    }

    function checkSenderType(bytes32 _type, bytes32 _sender) internal {
        uint nos = numBindedEntities(_type);
        for (uint i = 0; i < nos; ++i) {
            if (_sender == getBindedEntityNameByIndex(_type, i)) return true;
        }        
        return false;
    }
 }


