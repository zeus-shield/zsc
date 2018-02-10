

/*
Copyright (c) 2017 Yong Yao, Zeusshield Blockchain Technology Development Co., Ltd
2017-12-18: v0.01
*/

pragma solidity ^0.4.17;

library DBEntity {
    enum AgreementStatus { UNDEFINED, ONGOING, CANCLED, PAID, NOTPAID}
    struct Entity {
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

    function setName(Entity storage _entity, string _name) public {
        _entity.name_ = _name;
    }

    function setID(Entity storage _entity, uint _id) public {
        _entity.id_ = _id;
    }

    function setEthValue(Entity storage _entity, uint _eth) public {
        _entity.ethTotal_ = _eth;
    }

    function setZscValue(Entity storage _entity, uint _zsc) public {
        _entity.zscTotal_ = _zsc;
    }

    function setActivated(Entity storage _entity, bool _activated) public {
        _entity.activated_ = _activated;
    }

    function addParameter(Entity storage _entity, string _parameter) public returns (bool) {
        if (_entity.parameterExist_[_parameter] != 0)
            return false;

        _entity.parameterExist_[_parameter] = 1;
        return true;
    }

    function removeParameter(Entity storage _entity, string _parameter) public returns (bool) {
        if (_entity.parameterExist_[_parameter] != 0) {
            _entity.parameterExist_[_parameter] = 0;
            _entity.removedParameters_[_parameter] = _entity.parameters_[_parameter];
        }
        return true;
    }

    function setParameter(Entity storage _entity, string _parameter, string _value) public returns (bool) {
        if (_entity.parameterExist_[_parameter] == 0)
            return false;

        _entity.parameters_[_parameter] = _value;
        return true;
    }

    function getParameter(Entity storage _entity, string _parameter) public constant returns (string) {
        if (_entity.parameterExist_[_parameter] == 0) revert();

        return _entity.parameters_[_parameter];
    }


    //////////////////////////////////
    function getName(Entity storage _entity) public constant returns (string) {
        return _entity.name_;
    }

    function getID(Entity storage _entity) public constant returns (uint) {
        return _entity.id_;
    }

    function getEthValue(Entity storage _entity) public constant returns (uint) {
        return _entity.ethTotal_;
    }

    function getZscValue(Entity storage _entity) public constant returns (uint) {
        return _entity.zscTotal_;
    }

    function getActivated(Entity storage _entity) public constant returns (bool) {
        return _entity.activated_;
    }

    //////////////////////////////////

    function addAgreement(Entity storage _entity, uint _agreementID) public returns (bool) {
        if (_entity.agreementExist_[_agreementID] == 0)
            return false;

        _entity.agreementExist_[_agreementID] = 1;
        _entity.agreementStatus_[_agreementID] = AgreementStatus.ONGOING;
        _entity.agreements_.push(_agreementID);

        return true;
    }

    function setAgreementStatus(Entity storage _entity, uint _agreementID, AgreementStatus _status) public returns (bool) {
        if (_entity.agreementExist_[_agreementID] == 0)
            return false;

        _entity.agreementStatus_[_agreementID] = _status;

        return true;
    }
}
