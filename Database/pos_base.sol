/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_node.sol";

contract PosBase is DBNode {
    enum TransactionStatus {NULL, PENDING, FAILED, SUCCEED}
    
    struct Transaction {
        TransactionStatus status_;
        uint createdTime_;
        uint finishedTime_;
        uint excutionSize_;
        bytes32 txhash_;
        address sender_;
        address receiver_;
        uint256 amount_;
        bytes data_;
    }

    struct TransactionHistory {
        uint nos_;
        uint256 total_;
        mapping(uint => Transaction) transactions_;
    }
    
    TransactionHistory private transactionHistory_;

    // Constructor
    function PosBase(bytes32 _name) public DBNode(_name) {
    } 

    function registerTransaction() public only_delegate {
        
    }
}
