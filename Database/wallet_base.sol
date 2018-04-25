/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_node.sol";
import "./plat_math.sol";

contract WalletBase is DBNode {
    struct Payment {
        uint time_;
        bool isInput_;
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

    PaymentHistory private paymentHistory_;
    
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
                lokedValue_ = SafeMath.add(lokedValue_, _amount);
            } 
            totalValue_ = SafeMath.add(totalValue_, _amount);
        } else {
            if (_isLocked) {
                require(lokedValue_ >= _amount);
                lokedValue_= SafeMath.sub(lokedValue_, _amount);
            }
            require(totalValue_ >= _amount);
            totalValue_ SafeMath.sub(totalValue_, _amount);
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
        uint index = paymentHistory_.nos_;
        paymentHistory_.nos_++;
        paymentHistory_.payments_[index] = Payment(now, true,  _tx, _sender, address(this), _amount, _data);

        changeValue(true, _data == "locked", _amount);
    }

    function recordOut(address _sender, bytes32 _tx, uint _amount, bytes32 _data) internal {
        require(totalValue_ >= _amount);
        uint index = paymentHistory_.nos_;
        paymentHistory_.nos_++;
        paymentHistory_.payments_[index] = Payment(now, false, _tx, _sender, address(this), _amount, _data);

        changeValue(false, _data == "locked", _amount);
    }

    function getBlance(bool _locked) public only_delegate(1) constant returns (uint256) {
        if (_locked) return lockedValue_;
        else return totalValue_;
    }

    function numTransactions() public only_delegate(1) constant returns (uint) {
        return paymentHistory_.nos_;
    }

    function getTransactionInfoByIndex(uint _index) public only_delegate(1) constant returns (uint, bool, bytes32, uint, address, address) {
        require(_index < paymentHistory_.nos_);
        
        return (paymentHistory_[_index].time_,
                paymentHistory_[_index].isInput_,
                paymentHistory_[_index].txhash_,
                paymentHistory_[_index].amount_,
                paymentHistory_[_index].sender_, 
                paymentHistory_[_index].receiver_);
    }
}
