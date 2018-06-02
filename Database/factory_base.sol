/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract FactoryBase is Object {
	address bindedDB_;
	address controlApi_;

    function FactoryBase(bytes32 _name) public Object(_name) {
    }

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);

    function setDatabase(address _adr) public {        
        checkDelegate(msg.sender, 1);

        require(bindedDB_ == address(0));
        bindedDB_ = _adr;
    } 

    function getDatabase() public constant returns (address) { 
        checkDelegate(msg.sender, 1);

        require(bindedDB_ != address(0));
        return bindedDB_;
    }

    function initFactory(address _controlApi) public {
        checkDelegate(msg.sender, 1);
        require(_controlApi != 0);

        addLog("-0-", true);

        if (controlApi_ != _controlApi) {
            if (controlApi_ == 0) {
                setDelegate(controlApi_, 0);
            }
            setDelegate(_controlApi, 1);
            controlApi_ = _controlApi;
        }
    }
}


