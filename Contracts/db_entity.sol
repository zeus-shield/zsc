/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
2018-02-11: v0.01
*/

pragma solidity ^0.4.17;
import "./plat_math.sol";
import "./db_node.sol";

contract DBEntity is DBNode {
    uint    id_ ;
    bool    activated_;

    mapping(string => uint) currencies_;
    mapping(string => uint) currencyStatus_; // 0: not-exist; 1: ok; 2: suspended

    mapping(string => string) parameters_;
    mapping(string => uint)   parameterExist_;

    // Constructor
    function DBEntity(string _name) public DBNode(_name) {
        initParameters();
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
    function addCurrency(string _currency) public only_delegate returns (bool) {
        if (currencyStatus_[_currency] != 0) {
           return false;
        }
        currencies_[_currency] = 0;
        currencyStatus_[_currency] = 1;
        return true;
    }

    function increaseCurrency(string _currency, uint _value) public only_delegate returns (bool) {
        if (currencyStatus_[_currency] != 1) {
            return false;
        }

        uint val = currencies_[_currency];
        currencies_[_currency] = PlatMath.add(val, _value);
        return true;
    }

    function decreaseCurrency(string _currency, uint _value) public only_delegate returns (bool) {
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

    function getCurrency(string _currency) public only_delegate constant returns (uint) {
        if (currencyStatus_[_currency] == 0) {
            return 0;
        }
        
        return currencies_[_currency];
    }

    //////////////////////////////////
    function addParameter(string _parameter) public only_delegate returns (bool) {
        if (parameterExist_[_parameter] != 0) {
            return false;
        }
        parameterExist_[_parameter] = 1;
        return true;
    }

    function removeParameter(string _parameter) public only_delegate returns (bool) {
        if (parameterExist_[_parameter] == 0) {
            return false;
        }
        parameterExist_[_parameter] = 0;
        return true;
    }

    function setParameter(string _parameter, string _value) public only_delegate returns (bool) {
        if (parameterExist_[_parameter] == 0) {
            return false;
        }
        parameters_[_parameter] = _value;
        return true;
    }

    function getParameter(string _parameter) public only_delegate constant returns (string) {
        if (parameterExist_[_parameter] == 0) {
           revert();
        }
        return parameters_[_parameter];
    }



}
