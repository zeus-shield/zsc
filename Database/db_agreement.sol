/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.17;
import "./db_user.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBNode {
    uint private status_; // 0: CREATED; 1: READY; 2: PUBLISHED; 3: PAID; 4: NOTPAID
    uint private startTime_;
    uint private duration_;
    bytes32 private walletSymbol_;
    uint private amount_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBUser(_name) {
        setNodeType("agreement");
        status_ = 0;
    }

    function initParameters() internal {
        addParameter("duration");
        addParameter("status");
        addParameter("startTime");
        addParameter("endTime");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (status_ > 0 )
            return false;  

        if (_parameter == "duration") {
            duration_ = PlatString.stringToUint(_value);
        }
        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (status_ > 0 )
            return false;  
        return super.addParameter(_parameter, _value);
    }

    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        if (status_ > 0 )
            return false; 
        return super.removeParameter(_parameter);
    }

    function setAgreementStatus(bytes32 _tag) public only_delegate(1) returns (bool) {
        if (status_ > 2) return false;

        if(status_ == 0 && _tag == "READY") status_ = 1;
        else if (status_ == 1 && _tag == "PUBLISHED") status_ = 2;
        else if (status_ == 2 && _tag == "READY") status_ = 1;
        else return false;
       
        return super.setParameter("status",  _tag);
    }
    
    function startInsurance(bytes32 _walletSymbol, uint _price) public only_delegate(1) {
        walletSymbol_ = _walletSymbol;
        price_ = _price;
        status_ = 3;
        startTime_ = now;
        endTime_ = startTime_ + duration_;

        super.setParameter("status", "PAID");
        super.setParameter("startTime", PlatString.uintToString(startTime_));
        super.setParameter("endTime", PlatString.uintToString(endTime_));
    }

    function checkSenderType(bytes32 _type, bytes32 _sender) internal {
        uint nos = numBindedEntities(_type);
        for (uint i = 0; i < nos; ++i) {
            if (_sender == getBindedEntityNameByIndex(_type, i)) return true;
        }        
        return false;
    }
 }


