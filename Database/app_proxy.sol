/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract AppProxy is Object {
    string private controlApisAbi_;
    address private controlApisAdr_;

    constructor() Object("null") {
    }
    
    function setControlApisAbi(string _abi) public only_owner {
        controlApisAbi_ = _abi;
    }

    function setControlApisAdr(address _adr) public only_owner {
        controlApisAdr_ = _adr;
    }

    function getControlApisAbi() public constant returns (string) {
        return controlApisAbi_;
    }

    function getControlApisAdr() public constant returns (string) {
        return controlApisAdr_;
    }


}
