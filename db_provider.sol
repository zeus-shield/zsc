/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2018-02-07: v0.01
2018-02-09: v0.02
*/

pragma solidity ^0.4.18;

library DBProvider {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}

    struct Provider {
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

    function setName(Provider storage _provider, string _name) public {
        _provider.name_ = _name;
    }

    function setID(Provider storage _provider, uint _id) public {
        _provider.id_ = _id;
    }

    function setEthValue(Provider storage _provider, uint _eth) public {
        _provider.ethTotal_ = _eth;
    }

    function setZscValue(Provider storage _provider, uint _zsc) public {
        _provider.zscTotal_ = _zsc;
    }

    function setActivated(Provider storage _provider, bool _activated) public {
        _provider.activated_ = _activated;
    } 

    //////////////////////////////////

    function initOrigin(Provider storage _provider) public {
        addParameter(_provider, "assurerType");
        addParameter(_provider, "assurerName");
        addParameter(_provider, "principalFirstName");
        addParameter(_provider, "principalLastName");
        addParameter(_provider, "principalIdentific");
        addParameter(_provider, "principalPhone");
        addParameter(_provider, "principalEmail");
        addParameter(_provider, "principalNationality");
        addParameter(_provider, "companyName");
        addParameter(_provider, "companyId");
        addParameter(_provider, "companyNationality");
        addParameter(_provider, "companyPhone");
        addParameter(_provider, "companyEmail");
        addParameter(_provider, "claimEmail");
        addParameter(_provider, "claimPhone");
    }

    function addParameter(Provider storage _provider, string _parameter) public returns (bool) {
        if (_provider.parameterExist_[_parameter] != 0) 
            return false;

        _provider.parameterExist_[_parameter] = 1;
        return true;
    }

    function removeParameter(Provider storage _provider, string _parameter) public returns (bool) {
        if (_provider.parameterExist_[_parameter] != 0) {
            _provider.parameterExist_[_parameter] = 0;
            _provider.removedParameters_[_parameter] = _provider.parameters_[_parameter];
        }
        return true;
    }

    function setParameter(Provider storage _provider, string _parameter, string _value) public returns (bool) {
        if (_provider.parameterExist_[_parameter] == 0)
            return false;

        _provider.parameters_[_parameter] = _value;
        return true;
    }

    function getParameter(Provider storage _provider, string _parameter) public constant returns (string) {
        if (_provider.parameterExist_[_parameter] == 0) revert();

        return _provider.parameters_[_parameter];
    }


    //////////////////////////////////
    //////////////////////////////////

    function addAgreement(Provider storage _provider, uint _agreementID) public returns (bool) {
        if (_provider.agreementExist_[_agreementID] == 0) 
            return false;

        _provider.agreementExist_[_agreementID] = 1;
        _provider.agreementStatus_[_agreementID] = AgreementStatus.ONGOING;
        _provider.agreements_.push(_agreementID);

        return true;
    }

    function setAgreementStatus(Provider storage _provider, uint _agreementID, AgreementStatus _status) public returns (bool) {
        if (_provider.agreementExist_[_agreementID] == 0) 
            return false;

        _provider.agreementStatus_[_agreementID] = _status;

        return true;
    }
}

