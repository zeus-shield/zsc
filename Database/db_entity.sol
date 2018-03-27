/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-11: v0.01
*/

pragma solidity ^0.4.17;
import "./plat_string.sol";
import "./db_node.sol";

contract infoRecorder {
    function _recordString(bytes32 _nodeName, bytes32 _parameter, string _value) public;
}

contract CallbackDBIDManager is Object {
    function numIDs() public only_delegate constant returns (uint);
    function addID(address _id) public only_delegate returns (bool);
    function removeID(address _id) public only_delegate returns (bool);
    function getID(uint _index) public only_delegate constant returns (address);
}

contract DBEntity is DBNode {
    address test_;
    uint    id_ ;
    bool    activated_;
    bytes32 entityType_ = "entity";

    bytes32 temp_;

    bytes32[] parameterNames_;
    mapping(bytes32 => string) parameters_;
    mapping(bytes32 => bool) parameterExist_;

    address private idManager_;

    // Constructor
    function DBEntity(bytes32 _name) public DBNode(_name) {
        initParameters();
    }

    function initParameters() internal;
    
    function setEntityType(bytes32 _type) internal only_delegate {
        entityType_ = _type;
    }

    function getEntityType() public only_delegate constant returns (bytes32) {
        return entityType_;
    }

    function setActivated(bool _activated) public only_delegate {
        activated_ = _activated;
    }

    function getActivated() public only_delegate constant returns (bool) {
        return activated_;
    }

    function addParameter(bytes32 _parameter) public only_delegate returns (bool) {
        require(parameterExist_[_parameter] == false);

        parameterNames_.push(_parameter);
        parameterExist_[_parameter] = true;
        return true;
    }

    function removeParameter(bytes32 _parameter) public only_delegate returns (bool) {
        require(parameterExist_[_parameter] == true);

        for (uint i = 0; i < parameterNames_.length; ++i) {
            if (parameterNames_[i] == _parameter) {
                parameterNames_[i] = parameterNames_[parameterNames_.length - 1];
                break;
            }
        }

        delete parameterNames_[parameterNames_.length - 1];
        parameterNames_.length --;

        delete parameters_[_parameter];
        delete parameterExist_[_parameter];
        return true;
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool) {
        require(parameterExist_[_parameter] == true);

        parameters_[_parameter] = _value;
        infoRecorder(getController())._recordString(name(), _parameter, _value);
        return true;
    }

    function getParameter(bytes32 _parameter) public only_delegate constant returns (string) {
        return parameters_[_parameter];
    }

    function numParameters() public only_delegate constant returns (uint) {
        return parameterNames_.length;
    }

    function getParameterNameByIndex(uint _index) public only_delegate constant returns (bytes32) {
        require(_index < parameterNames_.length);
        return parameterNames_[_index];
    }

    function bindEntity(address _adr) public only_delegate {
        if (idManager_ == 0) {
            idManager_ =  CallbackDatabase(getDatabase())._createIDManager();
        }
        require(idManager_ != 0);
        CallbackDBIDManager(idManager_).addID(_adr);
    }

    function numBindedEntities(bytes32 _type) public only_delegate constant returns (uint) {
        uint totalNos = CallbackDBIDManager(idManager_).numIDs();
        uint typeNos = 0;
        address en = 0;
        for (uint i = 0; i < totalNos; ++i) {
            en = CallbackDBIDManager(idManager_).getID(i);
            if (DBEntity(en).getEntityType() == _type) {
                typeNos++;
            }
        }
        return typeNos;
    }
    
    function getBindedEntityNameByIndex(bytes32 _type, uint _index) public only_delegate constant returns (bytes32) {
        uint totalNos = CallbackDBIDManager(idManager_).numIDs();
        uint typeNos = 0;
        address en = 0;
        for (uint i = 0; i < totalNos; ++i) {
            en = CallbackDBIDManager(idManager_).getID(i);
            if (DBEntity(en).getEntityType() == _type) {
                if (typeNos == _index)
                   return DBEntity(en).name();
                typeNos++;
            }
        }
        return "null";
    }

}
