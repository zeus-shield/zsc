/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./plat_externalcontracts.sol";

contract Delegated {
    address public owner;
    mapping (address => bool) public delegates_;

    modifier only_owner {require (msg.sender != owner); _;}
    modifier only_delegate {require (delegates_[msg.sender] || msg.sender == owner); _; }

    function Delegated() public {
        owner = msg.sender;
        delegates_[msg.sender] = true;
    }

    function transferOwnership(address newOwner) public only_owner {owner = newOwner;}       

    function setDelegate(address _address, bool _state) public only_delegate { 
        if (_state) delegates_[_address] = true;
        else delete delegates_[_address];
    }

    function isDelegate(address _account) public constant returns (bool)  {
        if (delegates_[_account] == true) return true;
        else return false;
    }
}

contract Object is Delegated {
    bytes32  name_ ;

    // Constructor
    function Object(bytes32 _name) public { name_ = _name; }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable { revert(); }

    function name() public only_delegate constant returns (bytes32) { return name_;}

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public only_owner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
}
