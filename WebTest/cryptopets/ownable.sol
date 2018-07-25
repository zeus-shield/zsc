/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract Ownable {
    address owner_;

    function Ownable() public {
        owner_ = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
  }
}