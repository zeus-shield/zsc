/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

contract DBTemplate is DBEntity {
    mapping(address => bool) private fundamentalParas_;
    bool private addedProvider_;
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
        setNodeType("template");
        addedProvider_ = false;
    }

    function initParameters() internal {
        addParameter("automatic");
        addParameter("duration");
        addParameter("walletSymbol");
        addParameter("price");
        addParameter("fefund (%)");
        addParameter("duration");
        addParameter("provider");

        fundamentalParas_["automatic"]    = true;
        fundamentalParas_["duration"]     = true;
        fundamentalParas_["walletSymbol"] = true;
        fundamentalParas_["price"]        = true;
        fundamentalParas_["fefund (%)"]   = true;
        fundamentalParas_["duration"]     = true;
        fundamentalParas_["provider"]     = true;
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (numChildren() > 0) return false; 

        if (addedProvider_ == false) {
            addedProvider_ = true;
            return super.setParameter("provider", name());
        }

        if (_parameter == "provider") return false;

        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (numChildren() > 0) return false; 
        return super.addParameter(_parameter, _value);
    }

    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        if (numChildren() > 0) return false; 
        if (fundamentalParass_[_parameter]) return false;

        return super.removeParameter(_parameter);
    }
}
