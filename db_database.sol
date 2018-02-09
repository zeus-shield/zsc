/*
Copyright (c) 2018 ZSC Dev, Zeusshield Blockchain Technology Development Co., Ltd
2017-12-18: v0.01
2018-02-07: v0.02
*/

pragma solidity ^0.4.18;
import "./db_receiver.sol";

contract DBDatabase {
    address public manager_;
    DBReceiver.Receiver[] receivers_;
    
    mapping(string => uint) receiver_exist_;

    modifier onlyManager {
        if (msg.sender != manager_) revert();
        _;
    }

    function DBDatabase() public {
        if (msg.sender == address(0)) revert();
        manager_ = msg.sender;
    }

    function () public payable {
        revert(); // Prevents accidental sending of ether
    }

    function insertReceiver(string _name) public onlyManager {
        if (receiver_exist_[_name] == 0) revert();
        uint id = receivers_.length;
        receiver_exist_[_name] = id;

        DBReceiver.Receiver storage en;
        DBReceiver.setName(en, _name);
        DBReceiver.setID(en, id);
        receivers_.push(en);
    }

    

}

