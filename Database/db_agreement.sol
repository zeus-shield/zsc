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
    function DBAgreement(bytes32 _name) public Object(_name) {
    }

    function initParameters() internal {
        addParameter("startDate");
        addParameter("endDate");
        addParameter("signDate");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

    function addProvider(uint _id) public returns (bool) {
        return providerIDs_.addID(_id);
    }

    function addReceiver(uint _id) public returns (bool) {
        return receiverIDs_.addID(_id);
    }

    function addTemplate(uint _id) public returns (bool) {
        return receiverIDs_.addID(_id);
    }

    function removeProvider(Agreement storage _agreement, uint _provider_index)  public {
        for (uint i = 0; i < _agreement.providerIDs_.length; ++i) {
           if (_agreement.providerIDs_[i] == _provider_index) {
                _agreement.providerIDs_[i] = _agreement.providerIDs_[_agreement.providerIDs_.length - 1];
                break;
            }
        }
        _agreement.providerIDs_.length -= 1;
    }

    function addReceiver(Agreement storage _agreement, uint _receiver_index)  public {
        for (uint i = 0; i < _agreement.providerIDs_.length; ++i) {
           if (_agreement.providerIDs_[i] == _receiver_index) {
                revert();
            }
        }
        _agreement.receiverIDs_.push(_receiver_index);
    }

    function removeReceiver(Agreement storage _agreement, uint _receiver_index)  public {
        for (uint i = 0; i < _agreement.receiverIDs_.length; ++i) {
           if (_agreement.receiverIDs_[i] == _receiver_index) {
                _agreement.receiverIDs_[i] = _agreement.receiverIDs_[_agreement.receiverIDs_.length - 1];
                break;
            }
        }
        _agreement.receiverIDs_.length -= 1;
    }


    //////////////////////////////////

    
}
