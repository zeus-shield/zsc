/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBEntity {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}
    AgreementStatus agreementStatus_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBEntity(_name) {
        setEntityType("agreement");
    }

    function initParameters() internal {
        addParameter("startDate");
        addParameter("endDate");
        addParameter("signDate");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

 }


