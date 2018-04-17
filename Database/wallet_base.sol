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
    
    struct LockInfo {
        bool locked_;
        uint amount_;
        uint time_;
        uint duration_;
        address agreementAdr_;
    }

    struct LockHistory {
        uint nos_;
        mapping(uint => LockInfo) locks_;
    }

    PaymentHistory private inputHistory_;
    PaymentHistory private outHistory_;
    
    uint private lockedNos_;
    uint private lockedValue_;
    mapping(uint => LockInfo) privatelockHistory_;
    mapping(address => uint) private lockIndice_;

    bool private isEthAccount_;
    uint private totalValue_;

    // Constructor
    function WalletBase(bytes32 _name) public DBNode(_name) {
        isEthAccount_ = false;
        totalValue_ = 0;
        lockedValue_ = 0;
        lockedNos_ = 0;
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

    function lockValue(uint _amount, uint _duration, address _agreementAdr) private returns (bool) {
        if (totalValue_ - lockedValue_ < _amount) {
            return false;
        }

        uint index = lockedNos_;
        lockedNos__++;
        lockHistory_[index] = LockInfo(true, _amount, now, _duration, _agreementAdr);
        lockIndice_[_agreementAdr] = index;
        lockedValue_ += _amount;
        return true;
    }

    function unlockValue(address _agreementAdr) private returns (bool) {
        uint index = lockIndice_[_agreementAdr];
        require(lockedValue_ >= lockHistory_[index].amount_);
        lockedValue_ -= lockHistory_[index].amount_;
        lockHistory_[index].locked_ = false;
        return true;
    }

    function setLockValue(bool _tag, uint _amount, uint _duration, address _agreementAdr) public only_delegate(1) returns (bool) {
        if (_tag) {
            return lockValue(_amount, _duration, _agreementAdr);
        } esle {
            return unlockValue( _agreementAdr);
        }
    }

    function getBlance(bool _locked) public only_delegate(1) constant returns (uint256) {
        if (_locked) return lockedValue_;
        else return totalValue_;
    }

    function getLockBalanceInfoByIndex(uint _index) public only_delegate(1) constant returns (uint, uint, uint, address) {
        require(_index < lockHistory_.nos_)
        return (lockHistory_.locks_[index].amount_, 
                lockHistory_.locks_[index].time_, 
                lockHistory_.locks_[index].duration_, 
                lockHistory_.locks_[index].agreementAdr_);
    }

    function doesBalanceLocked(address _agreementAdr) public only_delegate(1) constant returns (bool) {
        return lockHistory_.locks_[lockIndice_(_agreementAdr)].locked;
    } 

    function getLockBalanceInfoByAgreement(address _agreementAdr) public only_delegate(1) constant returns (uint, uint, uint, address) {
        uint i = lockIndice_(_agreementAdr);
        return getLockBalanceInfoByIndex(i);
    }
}
