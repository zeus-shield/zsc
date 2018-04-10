/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

contract DBTemplate is DBEntity {
    mapping(address => bool) private userExist_;
    address[] private users_;
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
        setNodeType("template");
    }

    function initParameters() internal {
        addParameter("Automatic");
        addParameter("Duration");
        addParameter("Price (TestETH)");
        addParameter("Price (TestZSC)");
        addParameter("RefundPercentage");
    }

    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (numChildren() > 0) return false; 
        return super.setParameter(_parameter, _value);
    }

    function addParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool) {
        if (numChildren() > 0) return false; 
        return super.addParameter(_parameter, _value);
    }

    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool) {
        if (numChildren() > 0) return false; 
        return super.removeParameter(_parameter);
    }
}
