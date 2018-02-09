/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2017-12-18: v0.01
2018-02-07: v0.02
2018-02-09: v0.03
*/

pragma solidity ^0.4.18;

library DBReceiver {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}

    struct Receiver {
        string  name_ ;  
        uint    id_ ;
        bool    activated_;
        uint    ethTotal_;
        uint    zscTotal_;
        uint    zscSuspend_;
        uint[]  agreements_;

        mapping(string => string) parameters_;
        mapping(string => uint) parameterExist_;

        mapping(string => string) removedParameters_;

        mapping(uint => uint) agreementExist_;
        mapping(uint => AgreementStatus) agreementStatus_; 
    }

    //////////////////////////////////

    function setName(Receiver storage _receiver, string _name) public {
        _receiver.name_ = _name;
    }

    function setID(Receiver storage _receiver, uint _id) public {
        _receiver.id_ = _id;
    }

    function setEthValue(Receiver storage _receiver, uint _eth) public {
        _receiver.ethTotal_ = _eth;
    }

    function setZscValue(Receiver storage _receiver, uint _zsc) public {
        _receiver.zscTotal_ = _zsc;
    }

    function setActivated(Receiver storage _receiver, bool _activated) public {
        _receiver.activated_ = _activated;
    } 

    //////////////////////////////////

    function initOrigin(Receiver storage _receiver) public {
        addParameter(_receiver, "userFamilyName");
        addParameter(_receiver, "userFirstName");
        addParameter(_receiver, "userNationality");
        addParameter(_receiver, "userPhone");
        addParameter(_receiver, "userGender");
        addParameter(_receiver, "userBirthday");
        addParameter(_receiver, "userIdentification");
        addParameter(_receiver, "userResidentialAddress");
    }

    function addParameter(Receiver storage _receiver, string _parameter) public returns (bool) {
        if (_receiver.parameterExist_[_parameter] != 0) 
            return false;

        _receiver.parameterExist_[_parameter] = 1;
        return true;
    }

    function removeParameter(Receiver storage _receiver, string _parameter) public returns (bool) {
        if (_receiver.parameterExist_[_parameter] != 0) {
            _receiver.parameterExist_[_parameter] = 0;
            _receiver.removedParameters_[_parameter] = _receiver.parameters_[_parameter];
        }
        return true;
    }

    function setParameter(Receiver storage _receiver, string _parameter, string _value) public returns (bool) {
        if (_receiver.parameterExist_[_parameter] == 0)
            return false;

        _receiver.parameters_[_parameter] = _value;
        return true;
    }

    function getParameter(Receiver storage _receiver, string _parameter) public constant returns (string) {
        if (_receiver.parameterExist_[_parameter] == 0) revert();

        return _receiver.parameters_[_parameter];
    }


    //////////////////////////////////
    //////////////////////////////////

    function addAgreement(Receiver storage _receiver, uint _agreementID) public returns (bool) {
        if (_receiver.agreementExist_[_agreementID] == 0) 
            return false;

        _receiver.agreementExist_[_agreementID] = 1;
        _receiver.agreementStatus_[_agreementID] = AgreementStatus.ONGOING;
        _receiver.agreements_.push(_agreementID);

        return true;
    }

    function setAgreementStatus(Receiver storage _receiver, uint _agreementID, AgreementStatus _status) public returns (bool) {
        if (_receiver.agreementExist_[_agreementID] == 0) 
            return false;

        _receiver.agreementStatus_[_agreementID] = _status;

        return true;
    }
}

