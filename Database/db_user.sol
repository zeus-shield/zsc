/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";


contract CallbackDBIDManager is Object {
    function numIDs() public only_delegate constant returns (uint);
    function addID(address _id) public only_delegate returns (bool);
    function removeID(address _id) public only_delegate returns (bool);
    function getID(uint _index) public only_delegate constant returns (address);
}

contract DBUser is DBEntity {
    address private agreements_ = 0;

    struct Payment {
        address sender_;
        address receiver_;
        uint256 amount_;
        bool isInput_;
        bytes data_;
    }

    struct PaymentHistory {
        uint times_;
        uint256 total_;
        mapping(uint => Payment) payments_;
    }
    
    PaymentHistory ethPayments_;
    PaymentHistory ERC20Payments_;

    // Constructor
    function DBUser(bytes32 _name) public DBEntity(_name) {
        ethPayments_.times_ = 0;
        ethPayments_.total_ = 0;
        ERC20Payments_.times_ = 0;
        ERC20Payments_.total_ = 0;
    } 

    function() public payable {
        if (msg.value < (1 ether) / 100) {
            revert();
        } else {
            uint index = ethPayments_.times_++;
            ethPayments_.total_ += msg.value;
            ethPayments_.payments_[index] = Payment(msg.sender, this, msg.value, true, msg.data);
        }
    }

    function executeEtherTransaction(address _dest, uint256 _value, bytes _data) public only_delegate returns (bool) {
        require(ethPayments_.total_ >= _value && _dest != address(this));

        if (_dest.call.value(_value)(_data)) {
            uint index = ethPayments_.times_++;
            ethPayments_.total_ -= _value;
            ethPayments_.payments_[index] = Payment(this, msg.sender, _value, false, _data);
            return true;
        } else {
            return false;
        }
    }

    function executeERC20Transaction(address _tokenAdr, address _dest, uint256 _value, bytes _data) public only_delegate returns (bool) {
        require(_dest != address(this));
        if (ERC20Interface(_tokenAdr).transfer(_dest, _value)) {
            uint index = ERC20Payments_.times_++;
            ERC20Payments_.total_ -= _value;
            ERC20Payments_.payments_[index] = Payment(this, msg.sender, _value,false, _data);
            return true;
        } else {
            return false;
        }
    }

    function addAgreement(address _adr) public only_delegate {
        if (agreements_ == 0) {
            agreements_ =  CallbackDatabase(getDatabase())._createIDManager();
        } 
        CallbackDBIDManager(agreements_).addID(_adr);
    }

    function numAgreements() public only_delegate constant returns (uint) {
        return CallbackDBIDManager(agreements_).numIDs();
    }
}
