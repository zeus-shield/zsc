/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";

contract DBTemplate is DBEntity {
    mapping(address => bool) private userExist_;
    address[] private users_;
    
    function DBTemplate(bytes32 _name) public DBEntity(_name) {
        setEntityType("template");
    }

    function initParameters() internal {
        addParameter("Automatic");
        addParameter("Duration");
        addParameter("Price (TestETH)");
        addParameter("Price (TestZSC)");
        addParameter("RefundPercentage");
    }
}
