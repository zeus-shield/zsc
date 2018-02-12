/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";
import "./db_receiver.sol";
import "./db_provider.sol";
import "./db_idmanager.sol";


contract DBDatabase is Object {
    DBReceiver[] receivers_;
    DBProvider[] providers_;

    mapping(string => uint) receiver_exist_;
    mapping(string => uint) provider_exist_;

    function DBDatabase(string _name) public Object(_name) {
    }

    function insertReceiver(string _name) public only_delegate {
        if (receiver_exist_[_name] == 0) revert();
        uint id = receivers_.length;
        receiver_exist_[_name] = id;

        DBReceiver en = new DBReceiver(_name);
        en.setID(id);
        receivers_.push(en);
    }

    function insertProvider(string _name) public only_delegate {
        if (provider_exist_[_name] == 0) revert();
        uint id = providers_.length;
        provider_exist_[_name] = id;

        DBProvider en = new DBProvider(_name);
        en.setID(id);
        providers_.push(en);
    }
}
