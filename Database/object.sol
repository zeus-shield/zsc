/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./plat_externalcontracts.sol";

contract Owned {
    address public owner;

    function Owned() public {
        owner = msg.sender;
    }

    modifier only_owner {
        if (msg.sender != owner) revert();
        _;
    }

    function transferOwnership(address newOwner) public only_owner {
        owner = newOwner;
    }
}


/**
* The Delegated contract allows a set of delegate accounts
* to perform special tasks such as admin tasks to the contract
**/       
contract Delegated is Owned {
    mapping (address => bool) public delegates_;
    
    modifier only_delegate { 
        require (delegates_[msg.sender] || msg.sender == owner);
        _; 
    }

    event DelegateChanged(address _delegate, bool _state);

    // Constructor
    function Delegated() public {
        delegates_[msg.sender] = true;
        delegates_[this] = true;
    }
    
    function setDelegate(address _address, bool _state) public only_delegate { 
        if (_state) {
            delegates_[_address] = true;
        } else { 
            delete delegates_[_address];
        }
        DelegateChanged(_address, _state);
    }

    function isDelegate(address _account) public constant returns (bool)  {
        if (delegates_[_account] == true) {
            return true;
        } else {
            return false;
        }
    }
}

contract LogRecorder { 
                    function recordLog(bytes32 _log) public; 
                    function recordLog(string _log) public; }

contract Object is Delegated {
    address logFile_ = 0;
    bytes32  name_ ;

    // Constructor
    function Object(bytes32 _name) public {
        name_ = _name;
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable {
        revert();
    }

    function name() public only_delegate constant returns (bytes32) {
        return name_;
    }

    function setLogRecorder(address _adr) public only_owner {
        logFile_ = _adr;
    }

    function writeLog(bytes32 str) internal {
        if (logFile_ != 0) LogRecorder(logFile_).recordLog(str);
    }

    function writeLog(string str) internal {
        if (logFile_ != 0) LogRecorder(logFile_).recordLog(str);
    }

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public only_owner returns (bool success) {
        return ERC20Interface(tokenAddress).transfer(owner, tokens);
    }
}
