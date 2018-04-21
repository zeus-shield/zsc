/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBReceiver is DBUser {
    uint agrNos_;
    mapping(uint => address) private agreements_;
    mapping(address => bool) private agreementExist_;

    // Constructor
    function DBReceiver(bytes32 _name) public DBUser(_name) {
        setNodeType("receiver"); 
    }

    function initParameters() internal {
        addParameter("userFamilyName");
        addParameter("userFirstName");
        addParameter("userNationality");
        addParameter("userPhone");
        addParameter("userGender");
        addParameter("userBirthday");
        addParameter("userIdentification");
        addParameter("userResidentialAddress");
    }

    function addChild(address _adr) public only_delegate(1) returns (bool) {
        require(!agreementExist_[_adr]);
        agreementExist_[_adr] = true;
        agreements_[agrNos_] = _adr;
    } 

    function numChildren() public only_delegate(1) returns (uint) {
        return agrNos_;
    }

    function getChildByIndex(uint _index) public only_delegate(1) returns (address) {
        require(_index < agrNos_);
        return agreements_[_index];
    }
}
