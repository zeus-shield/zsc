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
        string  userFamilyName_;
        string  userFirstName_;
        string  userNationality_;
        string  userPhone_;
        uint    userGender_;
        string  userBirthday_;
        string  userIdentification_;
        string  userResidentialAddress_;
        uint[]  agreements_;
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


    function setUserFamilyName(Receiver storage _receiver, string _familyName) public {
        _receiver.userFamilyName_ = _familyName;
    }

   function setUserFirstName(Receiver storage _receiver, string _firstName) public {
        _receiver.userFirstName_ = _firstName;
    }

    function setUserNationality(Receiver storage _receiver, string _nationality) public {
        _receiver.userNationality_ = _nationality;
    }

    function setUserPhone(Receiver storage _receiver, string _phone) public {
        _receiver.userPhone_ = _phone;
    }

    function setUserBirthday(Receiver storage _receiver, string _birthDay) public {
        _receiver.userBirthday_ = _birthDay;
    }

    function setUserIdentification(Receiver storage _receiver, string _identification) public {
        _receiver.userIdentification_ = _identification;
    }

    function setUserResidentialAddress(Receiver storage _receiver, string _residentialAddress) public {
        _receiver.userResidentialAddress_ = _residentialAddress;
    }

    //////////////////////////////////
    //////////////////////////////////
    //////////////////////////////////

    function getName(Receiver storage _receiver) public constant returns (string) {
        return _receiver.name_;
    }

    function getID(Receiver storage _receiver) public constant returns (uint) {
        return _receiver.id_;
    }

    function getEthValue(Receiver storage _receiver) public constant returns (uint) {
        return _receiver.ethTotal_;
    }

    function getZscValue(Receiver storage _receiver) public constant returns (uint) {
        return _receiver.zscTotal_;
    }

    function getActivated(Receiver storage _receiver) public constant returns (bool) {
        return _receiver.activated_;
    } 

    //////////////////////////////////
    function getUserFamilyName(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userFamilyName_;
    } 

    function getUserFirstName(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userFirstName_;
    }

    function getUserNationality(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userNationality_;
    }

    function getUserPhone(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userPhone_;
    }

    function getUserGender(Receiver storage _receiver) public constant returns (uint) {
        return _receiver.userGender_;
    }

    function getUserBirthday(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userBirthday_;
    }

    function getUserIdentification(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userIdentification_;
    }

    function getUserResidentialAddress(Receiver storage _receiver) public constant returns (string) {
        return _receiver.userResidentialAddress_;
    }

    //////////////////////////////////
    //////////////////////////////////

    function addOrderedAgreement(Receiver storage _receiver, uint _agreementID) public returns (bool) {
        if (_receiver.agreementExist_[_agreementID] == 0) 
            return false;

        _receiver.agreementExist_[_agreementID] = 1;
        _receiver.agreementStatus_[_agreementID] = AgreementStatus.ONGOING;
        _receiver.agreements_.push(_agreementID);

        return true;
    }
}

