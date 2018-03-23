/*
Copyright (c) 2018, ZSC Dev Team, Eric Yao
2018-02-10: v0.01
*/

pragma solidity ^0.4.18;
import "./db_entity.sol";
//import "./db_item.sol";

contract DBTemplate is DBEntity {
    address private provider_ = 0;
    
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

    function bindProvider(address _adr) public only_delegate {
        if (templates_ == 0) {
            templates_ =  _adr;
        } 
    }

    function getBindedProvider() public only_delegate constant returns (address) {
        return provider_;
    }
}
