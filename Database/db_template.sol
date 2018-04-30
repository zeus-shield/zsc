/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBTemplate is DBEntity {
    bool private addedProvider_;
    
    constructor(bytes32 _name) public DBEntity(_name) {
        setNodeType("template");
        addedProvider_ = false;
    }

    function initParameters() internal {
        addFundamentalParameter("automatic");
        addFundamentalParameter("duration");
        addFundamentalParameter("walletSymbol");
        addFundamentalParameter("price");
        addFundamentalParameter("refund (%)");
        addFundamentalParameter("duration");
        addFundamentalParameter("provider");
        addFundamentalParameter("lockedAmount") = true;
    }

    function setParameter(bytes32 _parameter, string _value) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (numChildren() > 0) return false; 

        if (addedProvider_ == false) {
            addedProvider_ = true;
            return super.setParameter("provider", name());
        }

        if (_parameter == "provider") return false;

        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (numChildren() > 0) return false; 
        return super.addParameter(_parameter);
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (numChildren() > 0) {
            return false; 
        }

        return super.removeParameter(_parameter);
    }
}
