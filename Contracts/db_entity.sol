/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.17;
import "./plat_math.sol";

library DBEntity {
    struct Entity {
        string  name_ ;
        uint    id_ ;
        bool    activated_;

        mapping(string => uint) currencies_;
        mapping(string => uint) currencyStatus_; // 0: not-exist; 1: ok; 2: suspended

        mapping(string => string) parameters_;
        mapping(string => uint)   parameterExist_;
    }

    function setName(Entity storage _entity, string _name) public {
        _entity.name_ = _name;
    }

    function setID(Entity storage _entity, uint _id) public {
        _entity.id_ = _id;
    }

    function setActivated(Entity storage _entity, bool _activated) public {
        _entity.activated_ = _activated;
    }

    //////////////////////////////////
    function getName(Entity storage _entity) public constant returns (string) {
        return _entity.name_;
    }

    function getID(Entity storage _entity) public constant returns (uint) {
        return _entity.id_;
    }

    function getActivated(Entity storage _entity) public constant returns (bool) {
        return _entity.activated_;
    }

    //////////////////////////////////
    function insertCurrency(Entity storage _entity, string _currency) public returns (bool) {
        if (_entity.currencyStatus_[_currency] != 0) {
           return false;
        }
        _entity.currencies_[_currency] = 0;
        _entity.currencyStatus_[_currency] = 1;
        return true;
    }

    function increaseCurrency(Entity storage _entity, string _currency, uint _value) public returns (bool) {
        if (_entity.currencyStatus_[_currency] != 1) {
            return false;
        }

        uint val = _entity.currencies_[_currency];
        _entity.currencies_[_currency] = PlatMath.add(val, _value);
        return true;
    }

    function decreaseCurrency(Entity storage _entity, string _currency, uint _value) public returns (bool) {
        if (_entity.currencyStatus_[_currency] != 1) {
            return false;
        }
        
        uint val = _entity.currencies_[_currency];
        if (PlatMath.less(val, _value)) {
            return false;
        }
        _entity.currencies_[_currency] = PlatMath.sub(val, _value);
        return true;
    }

    function getCurrency(Entity storage _entity, string _currency) public constant returns (uint) {
        if (_entity.currencyStatus_[_currency] == 0) {
            return 0;
        }
        
        return _entity.currencies_[_currency];
    }

    //////////////////////////////////
    function insertParameter(Entity storage _entity, string _parameter) public returns (bool) {
        if (_entity.parameterExist_[_parameter] != 0) {
            return false;
        }
        _entity.parameterExist_[_parameter] = 1;
        return true;
    }

    function removeParameter(Entity storage _entity, string _parameter) public returns (bool) {
        if (_entity.parameterExist_[_parameter] == 0) {
            return false;
        }
        _entity.parameterExist_[_parameter] = 0;
        return true;
    }

    function setParameter(Entity storage _entity, string _parameter, string _value) public returns (bool) {
        if (_entity.parameterExist_[_parameter] == 0) {
            return false;
        }
        _entity.parameters_[_parameter] = _value;
        return true;
    }

    function getParameter(Entity storage _entity, string _parameter) public constant returns (string) {
        if (_entity.parameterExist_[_parameter] == 0) {
           revert();
        }
        return _entity.parameters_[_parameter];
    }
}
