/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./adr_manager.sol";

contract FactoryBase {
	function setDatabase(address _adr) public;
    function getDatabase() public constant returns (address);
}

contract FactoryManager is AdrManager {
    constructor(bytes32 _name) public AdrManager(_name) {
    }

    function initFactoryManager(address _systemGM) public {
        checkDelegate(msg.sender, 1);
        initAdrManager(_systemGM);
    }

    function addAdr(bytes32 _name, address _database) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        require(systemGM_ != address(0));
        
        return super.addAdr(_name, _database);
    }

    function removeAdr(bytes32 _name) public returns (bool) {
        checkDelegate(msg.sender, 1); 

        address factoryAdr = getAdr(_name);
        return super.removeAdr(_name);
    }

    function setFactoryDatabase(bytes32 _factoryName, address _databaseAdr) public {
        checkDelegate(msg.sender, 1); 

        address factoryAdr = getAdr(_name);
        FactoryBase(factoryAdr).setDatabase(_databaseAdr);
    }
}
