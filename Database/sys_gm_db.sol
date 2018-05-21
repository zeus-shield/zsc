/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_group.sol";

contract SysGmDb is SysComGroup {
    constructor(bytes32 _name) public SysComGroup(_name) {
    }

    /*
      public functions
    */
    function removeAdr(bytes32 _dbName) public returns (bool) {
        checkDelegate(msg.sender, 1); 

        address dbAdr = getAdr(_dbName);
        Object(dbAdr).kill();

        return super.removeAdr(_dbName);
    }
}

