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
    function balanceOf(address _owner) public constant returns (uint256 balance);
}

contract Owned {
    address owner;
    modifier only_owner {require(msg.sender == owner); _;}
    function Owned() public {owner = msg.sender;}
    function transferOwnership(address newOwner) public only_owner {owner = newOwner;}       
}

contract Delegated is Owned{
    mapping (address => bool) public delegates_;

    modifier only_delegate {require(delegates_[msg.sender] || msg.sender == owner || this == msg.sender); _; }

    function Delegated() public {
        delegates_[msg.sender] = true;
    }

    function kill() public only_delegate {selfdestruct(owner); }

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

contract Recorder is Delegated {
    function addLog(string _log, bool _newLine) only_delegate public;
}

contract Object is Delegated {
    bytes32 private name_ ;
    address internal logRecorder_ = 0;

    // Constructor
    function Object(bytes32 _name) public { name_ = _name;}

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable { revert(); }

    function name() public only_delegate constant returns (bytes32) { return name_;}


    function setLogRecorder(address _adr) public only_delegate {logRecorder_ = _adr;}

    function addLog(string _log, bool _newLine) public only_delegate {
        Recorder(logRecorder_).addLog(_log, _newLine);
    }

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public only_delegate returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }    
}
