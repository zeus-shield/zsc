/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBEntity {
    uint private status_; // 0: UNDEFINED; 1: ONGOING; 2: PAID; 3: NOTPAID

    // Constructor
    function DBAgreement(bytes32 _name) public DBEntity(_name) {
        setNodeType("agreement");
        status_ = 0;
    }

    function initParameters() internal {
        addParameter("startDate");
        addParameter("endDate");
        addParameter("signDate");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

    function setAgreementStatus(uint _status) public only_delegate { status_ = _status; }

    function getAgreementStatus() public only_delegate constant returns (uint) { status_ = _status; }

    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        if (status_ == 0) {
            super.setParameter(_parameter, _value);
        }
    }
 }


