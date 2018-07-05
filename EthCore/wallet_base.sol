/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract WalletBase is Delegated {
    struct Payment {
        uint time_;
        bool isInput_;
        bytes32 tx_;
        address sender_;
        address receiver_;
        uint256 amount_;
    }
    uint private nos_;
    mapping(uint => Payment) private payments_;

    // Constructor
    function WalletBase() public Delegated() {
    }

    function checkBeforeSent(address _dst, uint _amount) internal constant {
        require(getBlance() >= _amount && _dst != address(this));
    }

    function recordInput(address _sender, uint _amount) internal {
        payments_[nos_++] = Payment(now, false, 0x0, _sender, address(this), _amount);
    }

    function recordOut(address _receiver, uint _amount) internal {
        payments_[nos_++] = Payment(now, true, 0x0, address(this), _receiver, _amount);
    }

    ////////// public functions /////////////
    function getBlance() public constant returns (uint);
    function executeTransaction(address _dest, uint256 _amount) public returns (uint);

    function numTransactions() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return nos_;
    }

    function getTransactionInfoByIndex(uint _index) public constant returns (uint, bool, bytes32, uint, address, address) {
        checkDelegate(msg.sender, 1);
        
        require(_index < nos_);
        
        return (payments_[_index].time_,
                payments_[_index].isInput_,
                payments_[_index].tx_,
                payments_[_index].amount_,
                payments_[_index].sender_, 
                payments_[_index].receiver_);
    }
}
