/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_node.sol";

contract WalletBase is DBNode {
    struct Payment {
        uint time_;
        bytes32 txhash_;
        address sender_;
        address receiver_;
        uint256 amount_;
        bytes data_;
    }

    struct PaymentHistory {
        uint nos_;
        uint256 total_;
        mapping(uint => Payment) payments_;
    }
    
    PaymentHistory private inputHistory_;
    PaymentHistory private outHistory_;

    bool private isEthAccount_;

    // Constructor
    function WalletBase(bytes32 _name) public DBNode(_name) {
        isEthAccount_ = false;
    }

    function executeTransaction(address _dest, uint256 _amount, bytes _data) public only_delegate(1) returns (bool);

    function setAsEthAccount() internal {
        isEthAccount_ = true;
    }

    function checkBeforeSent(address _dst, uint _amount) internal returns (bool) {
        if (inputHistory_.total_ >= _amount && _dst != address(this)) {
            return true;
        } else {
            return false;
        }
    }

    function recordInput(address _sender, bytes32 _tx, uint _amount, bytes _data) internal {
        uint index = inputHistory_.nos_;
        inputHistory_.nos_++;
        inputHistory_.total_ += _amount;
        paymentHistory_.payments_[index] = Payment(now, _tx, _sender, this, _amount, _data);
    }

    function recordOut(address _sender, bytes32 _tx, uint _amount, bytes _data) internal {
        require(inputHistory_.total_ >= _amount);
        uint index = outHistory_.nos_;
        inputHistory_.total_ -= _amount;
        outHistory_.nos_++;
        outHistory_.total_ += _amount;
        outHistory_.payments_[index] = Payment(now, _tx, _sender, this, _amount, _data);
    }
}
