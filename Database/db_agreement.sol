/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.17;
import "./db_user.sol";
import "./db_idmanager.sol";

contract DBAgreement is DBUser {
    uint private status_; // 0: READY; 1: PUBLISHED; 2: PAID; 3: NOTPAID
    struct AgreementKeyInfo {
        uint startTime_;
        uint endTime_;
        uint insuredAmount;
        uint paymentAmount;
    }

    AgreementKeyInfo private keyInfo_;

    // Constructor
    function DBAgreement(bytes32 _name) public DBUser(_name) {
        setNodeType("agreement");
        status_ = 0;
    }

    function initParameters() internal {
        addParameter("status");
        addParameter("startTime");
        addParameter("endTime");
        addParameter("signedTime");
        addParameter("insuredAmount");
        addParameter("paymentAmount");
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        return false;
        super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        return false;
        super.addParameter(_parameter, _value);
    }

    function setAgreementStatus(bytes32 _tag) public only_delegate returns (bool) {
        if (status_ > 1) return false;

        if (status_ == 0 && _tag == "PUBLISHED") {
            status_ = 1;
            return super.setParameter("status",  _tag);
        } else if (status_ == 1 && _tag == "READY") {
            status_ = 0;
            return super.setParameter("status",  _tag);
        }
        return false;
    }

    function() public payable {
        bytes32 senderName = msg.data;
        
        bool ret1 = checkSenderType("provider", senderName);
        bool ret2 = checkSenderType("receiver", senderName);
        
        require(ret1 || ret2);

        if (ret2 == true) {
            executeEtherTransaction(getNode(getBindedEntityNameByIndex("provider", 0)), msg.value, "");
            status_ = 2;
        }
    }

    function checkSenderType(bytes32 _type, bytes32 _sender) internal {
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
 }


