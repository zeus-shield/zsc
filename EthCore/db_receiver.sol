/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBReceiver is DBEntity {
    uint agrNos_;
    mapping(uint => address) private agreements_;
    mapping(address => bool) private agreementExist_;

    // Constructor
    function DBReceiver(bytes32 _name) public DBEntity(_name) {
        nodeType_ = "receiver";
    }

    function initParameters() internal {
        addFundamentalParameter("userFamilyName");
        addFundamentalParameter("userFirstName");
        addFundamentalParameter("userNationality");
        addFundamentalParameter("userPhone");
        addFundamentalParameter("userGender");
        addFundamentalParameter("userBirthday");
        addFundamentalParameter("userIdentification");
        addFundamentalParameter("userResidentialAddress");
    }

    function bindAgreement(address _adr) public {
        checkDelegate(msg.sender, 1);

        require(!agreementExist_[_adr]);
        agreementExist_[_adr] = true;
        agreements_[agrNos_] = _adr;
        agrNos_++;
    } 

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.removeParameter(_parameter);
    }

    function numAgreements() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return agrNos_;
    }

    function getAgreementByIndex(uint _index) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        require(_index < agrNos_);
        return agreements_[_index];
    }

    function numTemplates() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return 0;
    }

    function getTemplateByIndex(uint _index) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        return address(_index - _index);
    }
}
