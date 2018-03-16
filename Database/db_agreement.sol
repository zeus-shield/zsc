/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-08: v0.01
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBEntity {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}
    DBIDManager receiverIDs_;
    DBIDManager providerIDs_;
    DBIDManager templateIDs_;

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

    function setProvider(address _id, bool _status) internal returns (bool) {
        if (_status == true) {
            //current version only allows single provider for each agreement
            require(providerIDs_.numIDs() < 1);
            return providerIDs_.addID(_id);
        } else {
            return providerIDs_.removeID(_id);
        }
    }

    function setReceiver(address _id, bool _status) internal returns (bool) {
        if (_status == true) {
            //current version only allows single receiver for each agreement
            require(receiverIDs_.numIDs() < 1);
            return receiverIDs_.addID(_id);
        } else {
            return receiverIDs_.removeID(_id);
        }
    }

    function setTemplate(address _id, bool _status) public only_delegate returns (bool) {
        if (_status == true) {
            //current version only allows single template for each agreement
            require(templateIDs_.numIDs() < 1);
            return templateIDs_.addID(_id);
        } else {
            return templateIDs_.removeID(_id);
        }
    }

    function getProviderByIndex(uint _index) public only_delegate constant returns (address) {
        return providerIDs_.getID(_index);
    }

    function getReceiverByIndex(uint _index) public only_delegate constant returns (address) {
        return receiverIDs_.getID(_index);
    }

    function getTemplateByIndex(uint _index) public only_delegate constant returns (address) {
        return templateIDs_.getID(_index);
    }

    function numProviders() public only_delegate constant returns (uint) {
        return providerIDs_.numIDs();
    }

    function numReceivers() public only_delegate constant returns (uint) {
        return receiverIDs_.numIDs();
    }

    function numTemplates() public only_delegate constant returns (uint) {
        return templateIDs_.numIDs();
    }
    

    function bindSlice(bytes32 _type, address _adr) public only_delegate returns (bool) {
        if (_type == "provider") {
            return setProvider(_adr, true);
        } else if (_type == "receiver") {
            return setReceiver(_adr, true);
        } else {
            revert();
        }
    }

    function unbindSlice(bytes32 _type, address _adr) public only_delegate returns (bool) {
        if (_type == "provider") {
            return setProvider(_adr, false);
        } else if (_type == "receiver") {
            return setReceiver(_adr, false);
        } else {
            revert();
        }
    }
 }


