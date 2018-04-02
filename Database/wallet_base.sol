/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";

contract WalletBase is DBEntity {
    struct Transaction {
        uint time_;
        bytes32 txhash_;
        address sender_;
        address receiver_;
        uint256 amount_;
        bool isInput_;
        bytes data_;
    }

    struct TransactionHistory {
        uint nos_;
        uint256 total_;
        mapping(uint => Transaction) transactions_;
    }
    
    TransactionHistory private transactionHistory_;

    // Constructor
    function WalletBase(bytes32 _name) public DBEntity(_name) {
    } 

}
