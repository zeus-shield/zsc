/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.17;
import "./db_user.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBUser {
    uint private status_; // 0: UNDEFINED; 1: ONGOING; 2: PAID; 3: NOTPAID

    // Constructor
    function DBAgreement(bytes32 _name) public DBUser(_name) {
        setNodeType("agreement");
        status_ = 0;
    }

    function initParameters() internal {
        addParameter("startDate");
        addParameter("endDate");
        addParameter("signDate");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

    function setAgreementStatus(uint _status) public only_delegate { status_ = _status; }

    function getAgreementStatus() public only_delegate constant returns (uint) { status_ = _status; }

    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        if (status_ == 0) {
            super.setParameter(_parameter, _value);
        }
    }

    function() public payable {
        bool ret1 = checkSenderType("provider", msg.sender);
        bool ret2 = checkSenderType("receiver", msg.sender);
        
        require(ret1 || ret2);
    }

    function checkSenderType(bytes32 _type, address _sender) {
        uint nos = numBindedEntities(_type);
        for (uint i = 0; i < nos; ++i) {
            if (_sender == getBindedEntityNameByIndex(_type, i)) return true;
        }        
        return false;
    }

    function executeEtherTransaction(address _dest, uint256 _value, bytes _data) public only_delegate returns (bool) {
        /*to be added here with extra functionalities later: 2018.03.29*/
        return super.executeEtherTransaction(_dest, _value, _data);
    }

    function executeERC20Transaction(address _tokenAdr, address _dest, uint256 _value, bytes _data) public only_delegate returns (bool) {
        /*to be added here with extra functionalities later: 2018.03.29*/
        return super.executeERC20Transaction(_tokenAdr, _dest, _value, _data);
    }
 }


