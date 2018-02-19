/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./db_item.sol";
import "./db_template.sol";
import "./db_receiver.sol";
import "./db_provider.sol";
import "./db_agreement.sol";
import "./db_database.sol";


contract DBApis is DBDatabase {
    function DBApis(bytes32 _name) public DBDatabase(_name) {
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

    function createAgreement(bytes32 _name) public only_delegate returns (bool) {
        if (getNode(_name) != 0) {
            return false;
        }

        DBAgreement nd = new DBAgreement(_name);
        DBNode(rootNode_.getChild("agreement")).addChild(address(nd));
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

    function setNodeParameterValue(bytes32 _nodeName, bytes32 _parameter, bytes32 _value) public only_delegate returns (bool) {
        address nd = getNode(_nodeName);

        if (nd == 0) {
            return false;
        }
        return DBEntity(nd).setParameter(_parameter, _value);
    } 

    function getNodeParameterValue(bytes32 _nodeName, bytes32 _parameter) public only_delegate constant returns (bytes32) {
        address nd = getNode(_nodeName);
        require(nd != 0);
        return DBEntity(nd).getParameter(_parameter);
    } 
    
    function deleteEntireNode(bytes32 _nodeName) public only_delegate returns (bool) {
        if (getNode(_nodeName) == 0) {
            return false;
        }

        destroyNode(getNode(_nodeName));
        return true;
    }
}
