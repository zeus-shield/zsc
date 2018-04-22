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
        bytes32 data_;
    }

    struct PaymentHistory {
        uint nos_;
        mapping(uint => Payment) payments_;
    }

    PaymentHistory private inputHistory_;
    PaymentHistory private outHistory_;
    
    bool private isEthAccount_;
    uint lokedValue_;
    uint256 totalValue_;

    // Constructor
    function WalletBase(bytes32 _name) public DBNode(_name) {
        isEthAccount_ = false;
        lokedValue_ = 0;
        unlockedValue_= 0;
    }

    function executeTransaction(address _dest, uint256 _amount, bytes _data) public only_delegate(1) returns (uint);

    function setAsEthAccount() internal {
        isEthAccount_ = true;
    }

    function changeValue(bool _doesIncrease, bool _isLocked, uint _amount) internal returns (bool) {
        if (_doesIncrease) {
            if (_isLocked) {
                lokedValue_ += _amount;
            } 
            totalValue_ += _amount;
        } else {
            if (_isLocked) {
                require(lokedValue_ >= _amount);
                lokedValue_ -= _amount;
            }
            require(totalValue_ >= _amount);
            totalValue_ -= _amount;
        }
    }

    function checkBeforeSent(address _dst, uint _amount) internal returns (bool) {
        if (totalValue_ >= _amount && _dst != address(this)) {
            return true;
        } else {
            return false;
        }
    }

    function recordInput(address _sender, bytes32 _tx, uint _amount, bytes32 _data) internal {
        uint index = inputHistory_.nos_;
        inputHistory_.nos_++;
        paymentHistory_.payments_[index] = Payment(now, _tx, _sender, address(this), _amount, _data);

        changeValue(true, _data == "locked", _amount);
    }

    function recordOut(address _sender, bytes32 _tx, uint _amount, bytes32 _data) internal {
        require(inputHistory_.total_ >= _amount);
        uint index = outHistory_.nos_;
        outHistory_.nos_++;
        outHistory_.payments_[index] = Payment(now, _tx, _sender, address(this), _amount, _data);

        changeValue(false, _data == "locked", _amount);
    }

    function getBlance(bool _locked) public only_delegate(1) constant returns (uint256) {
        if (_locked) return lockedValue_;
        else return totalValue_;
    }
}
