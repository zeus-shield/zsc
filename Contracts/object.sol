/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.18;

contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) revert();
        _;
    }

    function transferOwnership(address newOwner) public onlyOwner {
        owner = newOwner;
    }
}

contract Object is Owned {
    string  name_ ;

    // Constructor
    function Object(string _name) public {
        name_ = _name;
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable {
        revert();
    }

    function name() public  onlyOwner constant returns (string) {
        return name_;
    }
}
