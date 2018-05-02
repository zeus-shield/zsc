/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_user.sol";

contract DBReceiver is DBUser {
    uint agrNos_;
    mapping(uint => address) private agreements_;
    mapping(address => bool) private agreementExist_;

    // Constructor
    constructor(bytes32 _name) public DBUser(_name) {
        setNodeType("receiver"); 
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

    function addChild(address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(!agreementExist_[_adr]);
        agreementExist_[_adr] = true;
        agreements_[agrNos_] = _adr;
        agrNos_++;

        return true;
    } 

    function numChildren() public returns (uint) {
        checkDelegate(msg.sender, 1);
        return agrNos_;
    }

    function getChildByIndex(uint _index) public returns (address) {
        checkDelegate(msg.sender, 1);
        require(_index < agrNos_);
        return agreements_[_index];
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
}
