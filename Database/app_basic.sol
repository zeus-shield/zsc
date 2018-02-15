/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_receiver.sol";
import "./db_provider.sol";
import "./db_database.sol";


contract APPBasic is DBDatabase {
    function APPBasic(bytes32 _name) public DBDatabase(_name) {
    }
    
    function createReceiver(bytes32 _name) public only_delegate returns (address) {
        require(nodeAddress(_name) != 0); 
        DBProvider nd = new DBProvider(_name);
        DBNode(rootNode_.getChild("receiver")).addChild(address(nd));
    }

    function createProvider(bytes32 _name) public only_delegate returns (address) {
        require(nodeAddress(_name) != 0); 
        DBProvider nd = new DBProvider(_name);
        DBNode(rootNode_.getChild("provider")).addChild(address(nd));
        return address(nd);
    }
}
