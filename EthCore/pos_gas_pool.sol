/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./delegate.sol";

contract PosGasPool is Delegated {
    uint minedGasUsage_;
    uint remaingGasUsage_;
    
    ////////////////
    address private posGm_;

    // Constructor
    function PosGasPool() public {
    } 

    function initPosGasPool(address _posGmAdr) public {
        checkDelegate(msg.sender, 1);
        require(_posGmAdr != address(0));
        posGm_ = _posGmAdr;
        setDelegate(posGm_, 1);
    }

    function registerGasUsage(uint _gasUsage) public {
        checkDelegate(msg.sender, 1);
        remaingGasUsage_ = remaingGasUsage_.add(_gasUsage);
    }   
}
