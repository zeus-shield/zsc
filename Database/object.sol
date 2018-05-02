/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./plat_math.sol";

// ----------------------------------------------------------------------------
// ERC Token Standard #20 Interface
// https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20-token-standard.md
// ----------------------------------------------------------------------------
contract ERC20Interface {
    function transfer(address to, uint tokens) public returns (bool success);
    function balanceOf(address _owner) public constant returns (uint256 balance);
}

contract Recorder {
    function addLog(string _log, bool _newLine) public;
}

contract Owned {
    address owner;

    constructor() public {owner = msg.sender;}
    
    function transferOwnership(address newOwner) public {
        checkOwner(msg.sender);
        owner = newOwner;
    }       

    function checkOwner(address _account) internal constant { 
        require(_account == owner); 
    }
}

contract Delegated is Owned{
    mapping (address => uint) public delegates_;

    constructor() public {
        delegates_[msg.sender] = 1;
    }

    function kill() public {
        checkDelegate(msg.sender, 1);
        selfdestruct(owner); 
    }

    function setDelegate(address _address, uint _priority) public {
        if (isDelegate(msg.sender, _priority) == false) revert();
        if (_address == 0) revert();
        if (_priority > 0) { 
            delegates_[_address] = _priority;
        } else {
            delete delegates_[_address];
        }
    }

    function isDelegate(address _account, uint _priority) public constant returns (bool)  {
        if (address(this) == _account) return true;
        if (delegates_[_account] == 0) return false;
        if (delegates_[_account] <= _priority ) return true;
        return false;
    }

    function checkDelegate(address _address, uint _priority) internal constant {
        require(isDelegate(_address, _priority));
    }
}

contract Object is Delegated {
    using SafeMath for uint;

    bytes32 private name_ = "null";
    address internal logRecorder_ = 0;

    // Constructor
    constructor(bytes32 _name) public { name_ = _name;}

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable { revert(); }

    function name() public constant returns (bytes32) { 
        checkDelegate(msg.sender, 1);
        return name_;
    }

    function setLogRecorder(address _adr) public {
        checkDelegate(msg.sender, 1);
        logRecorder_ = _adr;
    }

    function addLog(string _log, bool _newLine) public {
        checkDelegate(msg.sender, 1);
        if (logRecorder_ != 0) {
            Recorder(logRecorder_).addLog(_log, _newLine);
        }
    }

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public returns (bool success) {
        checkOwner(msg.sender);
        return ERC20Interface(tokenAddress).transfer(msg.sender, tokens);
    }    
}
