/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AdmBase is Object {
    address public controlApisAdr_;
    string public controlApisFullAib_;

    function AdmBase(bytes32 _name) public Object(_name) {
    }

    function activeByUser(bytes32 _type) public;

    function initAdm(address _zscTokenAdr, address _controlApisAdr) public { 
        checkDelegate(msg.sender, 1);
        controlApisAdr_ = _controlApisAdr;
        prepareRandomCharacters();
    }

    function setControlApisFullAbi(string _fullAbi) public { 
        checkDelegate(msg.sender, 1);
        controlApisFullAib_ = _fullAbi; 
    }

    function getControlApisFullAbi() public view returns (string) { 
        return controlApisFullAib_; 
    }

    function getControlApisAdr() public view returns (address) { 
        return controlApisAdr_; 
    }
}
