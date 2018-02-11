/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-08: v0.01
*/

pragma solidity ^0.4.17;
import "./db_entity.sol";

library DBAgreement {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}

    struct Agreement {
        DBEntity.Entity entity_;

        uint[]  receiverIDs_;
        uint[]  providerIDs_;
        uint[]  templateIDs_;

        uint[]  providerIDs_zsc_;
        uint[]  receiverIDs_eth_;


        mapping(uint => uint) agreementExist_;
        mapping(uint => AgreementStatus) agreementStatus_;
    }

    function initAgreement(Agreement storage _agreement) public {
        DBEntity.insertParameter(_agreement.entity_, "startDate");
        DBEntity.insertParameter(_agreement.entity_, "endDate");
        DBEntity.insertParameter(_agreement.entity_, "signDate");
        DBEntity.insertParameter(_agreement.entity_, "insuredAmount");
        DBEntity.insertParameter(_agreement.entity_, "paymentAmount");
    }

    function addProvider(Agreement storage _agreement, uint _provider_index)  public {
        for (uint i = 0; i < _agreement.providerIDs_.length; ++i) {
           if (_agreement.providerIDs_[i] == _provider_index) {
                revert();
            }
        }
        _agreement.providerIDs_.push(_provider_index);
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
