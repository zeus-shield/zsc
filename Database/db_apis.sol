/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./db_item.sol";
import "./db_template.sol";
import "./db_receiver.sol";
import "./db_provider.sol";
import "./db_agreement.sol";
import "./db_database.sol";


contract DBApis is DBDatabase {
    function DBApis(bytes32 _name) public DBDatabase(_name) {
    }

    function getProviderRoot() internal only_delegate constant returns (address) {
        return getNode("provider");
    }

    function getReceiverRoot() internal only_delegate constant returns (address) {
        return getNode("receiver");
    }

    function getAgreementRoot() internal only_delegate constant returns (address) {
        return getNode("agreement");
    }

    function createReceiver(bytes32 _name) public only_delegate returns (bool) {
        if (getNode(_name) != 0) {
            return false;
        }

        DBReceiver nd = new DBReceiver(_name);
        nd.setDelegate(getReceiverRoot(), true);
        DBNode(getReceiverRoot()).addChild(address(nd));
        return true;
    }

    function createReceiver(string _name) public only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_name);
        return createReceiver(name);
    }

    function createProvider(bytes32 _name) public only_delegate returns (bool) {
        if (getNode(_name) != 0) {
            return false;
        }

        DBProvider nd = new DBProvider(_name);
        //nd.setDelegate(getProviderRoot(), true);
        //DBNode(getProviderRoot()).addChild(address(nd));
        return (address(nd) == 0);
    }
/*
    function createProvider(string _name) public only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_name);
        return createProvider(name);
    }

    function createAgreement(bytes32 _name) public only_delegate returns (bool) {
        if (getNode(_name) != 0) {
            return false;
        }

        DBAgreement nd = new DBAgreement(_name);
        nd.setDelegate(getAgreementRoot(), true);
        DBNode(getAgreementRoot()).addChild(address(nd));
        return true;
    }

    function createAgreement(string _name) public only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_name);
        return createAgreement(name);
    }
*/


    function createTemplate(bytes32 _providerName, bytes32 _templateName) public only_delegate returns (bool) {
        if (getNode(_providerName) == 0 || getNode(_templateName) != 0) {
            return false;
        }
        DBProvider(getNode(_providerName)).addTemplate(_templateName);
        return true;
    }

    function createTemplate(string _providerName, string _templateName) public only_delegate returns (bool) {
        bytes32 proiver = PlatString.tobytes32(_providerName);
        bytes32 template = PlatString.tobytes32(_templateName);
        return createTemplate(proiver, template);
    }

    function createItem(bytes32 _templateName, bytes32 _itemName) public only_delegate returns (bool) {
        if (getNode(_templateName) == 0 || getNode(_itemName) != 0) {
            return false;
        }
        DBTemplate(getNode(_templateName)).addItem(_itemName);
        return true;
    }

    function createItem(string _templateName, string _itemName) public only_delegate returns (bool) {
        bytes32 template = PlatString.tobytes32(_templateName);
        bytes32 item = PlatString.tobytes32(_itemName);
        return createItem(template, item);
    }

    function setNodeParameterValue(bytes32 _nodeName, bytes32 _parameter, string _value) public only_delegate returns (bool) {
        address nd = getNode(_nodeName);

        if (nd == 0) {
            return false;
        }
        return DBEntity(nd).setParameter(_parameter, _value);
    } 

    function setNodeParameterValue(string _nodeName, string _parameter, string _value) public only_delegate returns (bool) {
        bytes32 node = PlatString.tobytes32(_nodeName);
        bytes32 parameter = PlatString.tobytes32(_parameter);
        return setNodeParameterValue(node, parameter, _value);
    } 

    function getNodeParameterValue(bytes32 _nodeName, bytes32 _parameter) public only_delegate constant returns (string) {
        return _getNodeParameterValue(_nodeName, _parameter);
    }

    function getNodeParameterValue(string _nodeName, string _parameter) public only_delegate constant returns (string) {
        bytes32 node = PlatString.tobytes32(_nodeName);
        bytes32 parameter = PlatString.tobytes32(_parameter);
        return getNodeParameterValue(node, parameter);
    } 

    function deleteEntireNode(bytes32 _nodeName) public only_delegate returns (bool) {
        if (getNode(_nodeName) == 0) {
            return false;
        }

        destroyNode(getNode(_nodeName));
        return true;
    }

    function deleteEntireNode(string _nodeName) public only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_nodeName);
        return deleteEntireNode(name);
    }

    function getCompnentsNosFromAgreement(bytes32 _agreement) public only_delegate constant returns (uint, uint, uint) {
        if (getNode(_agreement) == 0) {
            return (0, 0, 0);
        }
        return (DBAgreement(getNode(_agreement)).numProviders(), 
                DBAgreement(getNode(_agreement)).numReceivers(),
                DBAgreement(getNode(_agreement)).numTemplates());
    }

    function getCompnentsNosFromAgreement(string _agreement) public only_delegate constant returns (uint, uint, uint) {
        bytes32 agreement = PlatString.tobytes32(_agreement);
        return getCompnentsNosFromAgreement(agreement);
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

    function addComponetToAgreement(string _template, string _user) public only_delegate returns (bool res) {
        bytes32 template = PlatString.tobytes32(_template);
        bytes32 user = PlatString.tobytes32(_user);
        return addComponetToAgreement(template, user);
    }

}
