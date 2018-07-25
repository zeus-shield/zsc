/*
 Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

contract Ownable {
    
    address owner_;

    modifier onlyOwner() {
        require(msg.sender == owner_);
        _;
    }

    function Ownable() public {
        owner_ = msg.sender;
    }

    function transferOwnership(address _newOwner) public onlyOwner {
        if (address(0) != _newOwner) {
          owner = _newOwner;
        }
    }
}