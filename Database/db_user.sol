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

    struct PaymentHistory {
        address addr_;
        bytes32 name_;
        bytes32 data_;
        uint amount_;
        bool isInput_;
    }
    
    PaymentHistory[] payments_;
    uint totalEth_;

    // Constructor
    function DBUser(bytes32 _name) public DBEntity(_name) {
    }

    function() public payable {
        if (msg.value < 1 ether / 100) {
            revert();
        } else {
            PaymentHistory memory pay;
            pay.addr_ = msg.sender;
            pay.name_ = "ether";
            pay.amount_ =  msg.value;
            pay.isInput_ = true;
            payments_.push(pay);
            totalEth_ += msg.value;
        }
    }

    function executeEtherTransaction(address _dest, uint _value, bytes32 _data) public only_delegate returns (bool) {
        require(totalEth_ < _value);

        if (_dest.call.value(_value)(_data)) {
            PaymentHistory memory pay;
            pay.addr_ = _dest;
            pay.name_ = "ether";
            pay.data_ = _data;
            pay.amount_ =  _value;
            pay.isInput_ = false;
            payments_.push(pay);
            totalEth_ -= _value;
            return true;
        } else {
            return false;
        }
    }

    function executeERC20Transaction(address _tokenAdr, address _dest, uint _value, bytes32 _data) public only_delegate returns (bool) {
        if (ERC20Interface(_tokenAdr).transfer(_dest, _value)) {
            PaymentHistory memory pay;
            pay.addr_ = _dest;
            pay.name_ = "ERC20";
            pay.data_ = _data;
            pay.amount_ =  _value;
            pay.isInput_ = false;
            payments_.push(pay);
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
