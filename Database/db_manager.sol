/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./adr_manager.sol";

contract DBManager is AdrManager {
    constructor(bytes32 _name) public AdrManager(_name) {
    }
    
    function addAdr(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        require(systemGM_ != address(0));
        
        return super.addAdr(_name, _adr);
    }

    function removeAdr(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1); 
        Object(adr).kill();

        return super.removeAdr(_name);
    }
}
