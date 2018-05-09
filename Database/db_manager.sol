/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./adr_manager.sol";

contract DBDatabase {
    function kill() public;
}

contract DBManager is AdrManager {
    constructor(bytes32 _name) public AdrManager(_name) {
    }

    function initDBManager(address _systemGM) public {
        checkDelegate(msg.sender, 1);
        initAdrManager(_systemGM);
    }

    function addAdr(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        require(systemGM_ != address(0));
        
        return super.addAdr(_name, _adr);
    }

    function removeAdr(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1); 
        DBDatabase(adr).kill();

        return super.removeAdr(_name);
    }

    function delegateObject(bytes32 _databaseName, address _objectAdr, uint _priority) public {
        checkDelegate(msg.sender, 1); 

        address dbAdr = getAdr(_databaseName);
        object(dbAdr).setDelegate(_objectAdr, _priority);
    }
}
