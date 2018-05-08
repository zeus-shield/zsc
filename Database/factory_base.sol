/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract FactoryBase is Object {
    address private database_;
    address private factoryGM_;

    constructor(bytes32 _name) public Object(_name) {
    }

    function setupFactoryRoot() internal;

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);

    function numFactoryElements() public constant returns (uint);

    function getFactoryElementByIndex(uint _index) public constant returns (address);

    function setDatabase(address _adr) public {
        require(database_ == address(0));
        
        checkDelegate(msg.sender, 1);
        database_ = _adr;
    } 

    function getBindedDatabase() internal constant returns (address) { 
        return database_;
    }

    function initFactory(address _factoryGM) public {
        checkDelegate(msg.sender, 1);
        
        require(_factoryGM != 0);

        if (factoryGM_ != _factoryGM) {
            setDelegate(factoryGM_, 0);
            setDelegate(_factoryGM, 1);
            factoryGM_ = _factoryGM;
        }
        setupFactoryRoot();
    }

}
