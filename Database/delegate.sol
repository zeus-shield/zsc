/*
Copyright (c) 2018, ZSC Dev Team
2017-12-18: v0.01
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./plat_math.sol";

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
