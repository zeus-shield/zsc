/*
Copyright (c) 2018, ZSC Dev Team
2018-02-12: v0.01
*/

pragma solidity ^0.4.18;
import "./db_user.sol";

contract DBStaker is DBUser {
    address private templates_ = 0;

    // Constructor
    function DBStaker(bytes32 _name) public DBUser(_name) {
        setNodeType("staker"); 
    }

    function initParameters() internal {
    }
}

