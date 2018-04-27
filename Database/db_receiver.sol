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
        addParameter("userFamilyName");
        addParameter("userFirstName");
        addParameter("userNationality");
        addParameter("userPhone");
        addParameter("userGender");
        addParameter("userBirthday");
        addParameter("userIdentification");
        addParameter("userResidentialAddress");
    }

    function addChild(address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);

        require(!agreementExist_[_adr]);
        agreementExist_[_adr] = true;
        agreements_[agrNos_] = _adr;
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
}
