/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db/EthCore/db_entity.sol";

contract WalletBase is DBNode {
    struct Payment {
        uint time_;
        uint isInput_;
        uint amount_;
        address sender_;
        address receiver_;
    }
    uint private constant MIN_VALUE = (1 ether) / 100;
    uint private nos_;
    mapping(uint => Payment) private payments_;

    // Constructor
    function WalletBase(bytes32 _name) public DBNode(_name) {
    }

    function checkBeforeSent(address _dst, uint _amount) internal view {
        require(getBlance() >= _amount && _dst != address(this));
    }

    function recordInput(address _sender, uint _amount) internal {
        payments_[nos_] = Payment(now, 1, _amount, _sender, address(this));
        nos_++;
    }

    function recordOut(address _receiver, uint _amount) internal {
        payments_[nos_] = Payment(now, 0, _amount, address(this), _receiver);
        nos_++;
    }

    function safeTransferToken(address _tokenAdr, address _dest, uint _amount) internal;

    ////////// public functions /////////////
    function getBlance() public view returns (uint);
    function executeTransaction(address _dest, uint256 _amount) public returns (uint);
    function burnFrozenToken(address _tokenAdr, address _dest) public;
        
    function numTransactions() public view returns (uint) {
        checkDelegate(msg.sender, 1);
        return nos_;
    }

    function getTransactionInfoByIndex(uint _index) public view returns (uint, uint, bytes32, uint, address, address) {
        require(_index < nos_);
        
        return (payments_[_index].time_,
                payments_[_index].isInput_,
                payments_[_index].amount_,
                payments_[_index].sender_, 
                payments_[_index].receiver_);
    }
}
