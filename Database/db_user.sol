/*
Copyright (c) 2018 ZSC Dev.
2018-02-07: v0.01
2018-02-09: v0.02
2018-02-10: v0.03
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
import "./db_item.sol";
import "./db_template.sol";
import "./db_idmanager.sol";


contract DBUser is DBEntity {
    struct PaymentHistory {
        address addr_;
        uint amount_;
        bool isInput_;
    }
    
    DBIDManager agreementIDs_;
    PaymentHistory[] payments_;
    uint totalEth_;

    // Constructor
    function DBUser(bytes32 _name) public DBEntity(_name) {
        setEntityType("user"); 
        initParameters();
    }

    function initParameters() internal {
    }

    function() public payable {
        if (msg.value < 1 ether / 100) {
            revert();
        } else {
            PaymentHistory memory pay;
            pay.addr_ = msg.sender;
            pay.amount_ =  msg.value;
            payments_.push(pay);
            totalEth_ += msg.value;
        }
    }
}
