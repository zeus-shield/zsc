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
    
    function createReceiver(bytes32 _name) public only_delegate returns (bool) {
        if (getNode(_name) != 0) {
            return false;
        }

        DBProvider nd = new DBProvider(_name);
        DBNode(rootNode_.getChild("receiver")).addChild(address(nd));
        return true;
    }

    function createProvider(bytes32 _name) public only_delegate returns (bool) {
        if (getNode(_name) != 0) {
            return false;
        }

        DBProvider nd = new DBProvider(_name);
        DBNode(rootNode_.getChild("provider")).addChild(address(nd));
        return true;
    }

    function createTemplate(bytes32 _providerName, bytes32 _templateName) public only_delegate returns (bool) {
        if (getNode(_templateName) != 0 && getNode(_providerName) == 0) {
            return false;
        }

        DBTemplate nd = new DBTemplate(_templateName);
        DBNode(rootNode_.getChild(_providerName)).addChild(address(nd));
        return true;
    }

    function createItem(bytes32 _templateName, bytes32 _itemName) public only_delegate returns (bool) {
        if (getNode(_itemName) != 0 && getNode(_templateName) == 0) {
            return false;
        }

        DBTemplate nd = new DBTemplate(_itemName);
        DBNode(rootNode_.getChild(_templateName)).addChild(address(nd));
        return true;
    }

    function setNodeParameterValue(bytes32 _nodeName, bytes32 _parameter, string _value) public only_delegate returns (bool) {
        address nd = getNode(_nodeName);

        if (nd == 0) {
            return false;
        }

        return DBEntity(nd).setParameter(_parameter, _value);

    } 
}
