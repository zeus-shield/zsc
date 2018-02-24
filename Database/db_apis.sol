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
        if (getNode(_providerName) == 0 || getNode(_templateName) != 0) {
            return false;
        }
        DBProvider(getNode(_providerName)).addTemplate_templateName);
        return true;
    }

    function createItem(bytes32 _templateName, bytes32 _itemName) public only_delegate returns (bool) {
        if (getNode(_templateName) == 0 || getNode(_itemName) != 0) {
            return false;
        }
        DBTemplate(getNode(_templateName)).addItem(_itemName);
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

        if (nd == 0) {
            return "temp";
        }

        return DBEntity(nd).getParameter(_parameter);
    } 

    function deleteEntireNode(bytes32 _nodeName) public only_delegate returns (bool) {
        if (getNode(_nodeName) == 0) {
            return false;
        }

        destroyNode(getNode(_nodeName));
        return true;
    }

    function getCompnentsNosFromAgreement(bytes32 _agreement) public only_delegate constant returns (uint, uint, uint) {
        if (getNode(_agreement) == 0) {
            return (0, 0, 0);
        }
        return (DBAgreement(getNode(_agreement)).numProviders(), 
                DBAgreement(getNode(_agreement)).numReceivers(),
                DBAgreement(getNode(_agreement)).numTemplates());
    }

    function addComponetToAgreement(bytes32 _template, bytes32 _user) public only_delegate returns (bool res) {
        address template = getNode(_template);
        address user = getNode(_user);

        if (template == address(0) || user == address(0)) {
            return false;
        }

        bytes32 entityType = DBEntity(user).getEntityType();
        if (PlatString.equalto(entityType, "provider")) {
            DBAgreement(template).setProvider(user, true);
        } else if (PlatString.equalto(entityType, "receiver")) {
            DBAgreement(template).setReceiver(user, true);
        } else if (PlatString.equalto(entityType, "template")) {
            DBAgreement(template).setReceiver(user, true);
        } else {
            return false;
        }
        return true;
    }
    
}
