/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBTemplate is DBEntity {
    bool private addedProvider_;
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
        nodeType_ = "template";
        addedProvider_ = false;
    }

    function initParameters() internal {
        addFundamentalParameter("provider");
        addFundamentalParameter("info");
        //addFundamentalParameter("automatic");
        addFundamentalParameter("duration");
        //addFundamentalParameter("walletSymbol");
        addFundamentalParameter("price");
        addFundamentalParameter("insurance");
        //addFundamentalParameter("copies");
        //addFundamentalParameter("lockedAmount");
    }

    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1);
        if (numChildren() > 0) return false; 

        if (_parameter == "provider") {
            if (addedProvider_ == false) {
                addedProvider_ = true;
                super.setParameter("provider", _value);
                return true;
            } else {
                return true;
            }
        }

        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (numChildren() > 0) return false; 
        return super.addParameter(_parameter);
    }

    /*
    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);

        if (numChildren() > 0) return false; 
        return super.removeParameter(_parameter);
    }
    */
}
