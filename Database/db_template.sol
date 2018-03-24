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

    function bindUser(address _adr) public only_delegate {
        userExist_[_adr] = true;
        users_.push(_adr);
    }

    function numBindedUsers() public only_delegate constant returns (uint) {
        return users_.length;
    }

    function getBindedUserByIndex(uint _index) public only_delegate return (address) {
        return users_[_index];
    }
}
