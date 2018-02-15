/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_item.sol";
import "./db_template.sol";
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

    function createTemplate(bytes32 _providerName, bytes32 _templateName) public only_delegate returns (address) {
        require(nodeAddress(_templateName) != 0);
        require(nodeAddress(_providerName) == 0); 

        DBTemplate nd = new DBTemplate(_templateName);
        DBNode(rootNode_.getChild(_providerName)).addChild(address(nd));
        return address(nd);
    }

    function createItem(bytes32 _templateName, bytes32 _itemName) public only_delegate returns (address) {
        require(nodeAddress(_itemName) != 0);
        require(nodeAddress(_templateName) == 0); 

        DBTemplate nd = new DBTemplate(_itemName);
        DBNode(rootNode_.getChild(_templateName)).addChild(address(nd));
        return address(nd);
    }
}
