/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";

// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    function transfer(address to, uint tokens) public returns (bool success);
}

contract Delegated {
    address public owner;
    mapping (address => bool) public delegates_;

    modifier only_owner {require (msg.sender == owner); _;}
    modifier only_delegate {require (delegates_[msg.sender] || msg.sender == owner || this == msg.sender); _; }

    function Delegated() public {
        owner = msg.sender;
        delegates_[msg.sender] = true;
    }

    function transferOwnership(address newOwner) public only_owner {owner = newOwner;}       

    function setDelegate(address _address, bool _state) public only_delegate { 
        require(_address != 0);
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
    string public print_log_;

    // Constructor
    function Object(bytes32 _name) public { name_ = _name; }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable { revert(); }

    function name() public only_delegate constant returns (bytes32) { return name_;}

    function kill() public only_delegate { name_ = "" ;}

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public only_delegate returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }

    function addLog(string _log) public only_delegate {
        print_log_ = PlatString.append(print_log_, _log);
    } 
}
