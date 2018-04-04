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
        bool isInput_;
        bytes data_;
    }

    struct PaymentHistory {
        uint nos_;
        uint256 total_;
        mapping(uint => Payment) payments_;
    }
    
    PaymentHistory private paymentHistory_;

    // Constructor
    function WalletBase(bytes32 _name) public DBNode(_name) {
    } 

}
