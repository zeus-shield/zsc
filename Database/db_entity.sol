/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-11: v0.01
*/

pragma solidity ^0.4.17;
import "./plat_math.sol";
import "./plat_string.sol";
import "./db_node.sol";

contract DBEntity is DBNode {
    uint    id_ ;
    bool    activated_;
    bytes32 entityType_ = "entity";

    bytes32 temp_;

    mapping(bytes32 => uint) currencies_;
    mapping(bytes32 => uint) currencyStatus_; // 0: not-exist; 1: ok; 2: suspended

    bytes32[] parameterNames_;
    mapping(bytes32 => bytes32) parameters_;
    mapping(bytes32 => bool)   parameterExist_;

    // Constructor
    function DBEntity(bytes32 _name) public DBNode(_name) {
        initParameters();
    }

    function setEntityType(bytes32 _type) internal only_delegate {
        entityType_ = _type;
    }

    function getEntityType() public only_delegate constant returns (bytes32) {
        return entityType_;
    }

    function initParameters() internal {
        addParameter("test");
    }

    //////////////////////////////////
    function setID(uint _id) public only_delegate {
        id_ = _id;
    }

    function setActivated(bool _activated) public only_delegate {
        activated_ = _activated;
    }

    //////////////////////////////////
    function getID() public only_delegate constant returns (uint) {
        return id_;
    }

    function getActivated() public only_delegate constant returns (bool) {
        return activated_;
    }

    //////////////////////////////////
    function addCurrency(bytes32 _currency) public only_delegate returns (bool) {
        if (currencyStatus_[_currency] != 0) {
           return false;
        }
        currencies_[_currency] = 0;
        currencyStatus_[_currency] = 1;
        return true;
    }

    function increaseCurrency(bytes32 _currency, uint _value) public only_delegate returns (bool) {
        if (currencyStatus_[_currency] != 1) {
            return false;
        }

        uint val = currencies_[_currency];
        currencies_[_currency] = PlatMath.add(val, _value);
        return true;
    }

    function decreaseCurrency(bytes32 _currency, uint _value) public only_delegate returns (bool) {
        if (currencyStatus_[_currency] != 1) {
            return false;
        }
        
        uint val = currencies_[_currency];
        if (PlatMath.less(val, _value)) {
            return false;
        }
        currencies_[_currency] = PlatMath.sub(val, _value);
        return true;
    }

    function getCurrency(bytes32 _currency) public only_delegate constant returns (uint) {
        if (currencyStatus_[_currency] == 0) {
            return 0;
        }
        
        return currencies_[_currency];
    }

    //////////////////////////////////
    function addParameter(bytes32 _parameter) public only_delegate returns (bool) {
        if (parameterExist_[_parameter] == true) {
            return false;
        }
        parameterNames_.push(_parameter);
        parameterExist_[_parameter] = true;
        return true;
    }

    function removeParameter(bytes32 _parameter) public only_delegate returns (bool) {
        if (parameterExist_[_parameter] == false) {
            return false;
        }

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
        if (parameterExist_[_parameter] == false) {
            return false;
        }
        parameters_[_parameter] = "null";
        recordParameterValue(_parameter, _value);
        return true;
    }

    function getParameter(bytes32 _parameter) public only_delegate constant returns (bytes32) {
        require (parameterExist_[_parameter] == true);
        return parameters_[_parameter];
    }

    function numParameters() public only_delegate constant returns (uint) {
        return parameterNames_.length;
    }

    function getParameterNameByIndex(uint _index) public only_delegate constant returns (bytes32) {
        require(_index < parameterNames_.length);
        return parameterNames_[_index];
    }
    
    function recordParameterValue(bytes32 _parameter, string _value) public only_delegate {
        temp_ = _parameter;
        _value = "null";
    }
}
