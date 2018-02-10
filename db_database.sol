/*
Copyright (c) 2018 ZSC Dev Team
2017-12-18: v0.01
2018-02-07: v0.02
*/

pragma solidity ^0.4.18;
import "./db_receiver.sol";
import "./db_provider.sol";

contract DBDatabase {
    address public manager_;
    DBReceiver.Receiver[] receivers_;
    DBProvider.Provider[] providers_;

    mapping(string => uint) receiver_exist_;
    mapping(string => uint) provider_exist_;

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
        DBEntity.setName(en.entity_, _name);
        DBEntity.setID(en.entity_, id);
        DBReceiver.initReceiver(en);
        receivers_.push(en);
    }

    function insertProvider(string _name) public onlyManager {
        if (provider_exist_[_name] == 0) revert();
        uint id = providers_.length;
        provider_exist_[_name] = id;

        DBProvider.Provider storage en;
        DBEntity.setName(en.entity_, _name);
        DBEntity.setName(en.entity_, _name);
        DBEntity.setID(en.entity_, id);
        DBProvider.initOrigin(en);
        providers_.push(en);
    }
}
