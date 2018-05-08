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

contract Delegated is Owned {
    uint delegateNos_;
    mapping (uint => address) public adrs_;
    mapping (uint => uint) public priorities_;
    mapping (address => uint) public indice_;
    mapping (address => bool) public exists_;

    constructor() public {
        addDelegate(msg.sender, 1);
    }

    function kill() public {
        checkDelegate(msg.sender, 1);
        selfdestruct(owner); 
    }

    function addDelegate(address _adr, uint _priority) private {
        uint index;
        if (exists_[_adr]) {
            index = indice_[_adr];
            adrs_[index] = _adr;
            priorities_[index] = _priority;
        } else {
            index = delegateNos_;
            exists_[_adr] = true;
            indice_[_adr] = index;
            adrs_[index] = _adr;
            priorities_[index] = _priority;
            delegateNos_++;
        }
    }

    function numDelegates() internal constant returns (uint) {
        return delegateNos_;
    }

    function getDelegateInfoByIndex(uint _index) internal constant returns (address, uint) {
        require(_index < delegateNos_);
        return (adrs_[_index], priorities_[_index]);
    }

    function checkDelegate(address _adr, uint _priority) internal constant {
        require(isDelegate(_adr, _priority));
    }

    function setDelegate(address _adr, uint _priority) public {
        checkDelegate(msg.sender, 1);
        if (_adr != address(this) {
            addDelegate(_adr, _priority);
        }
    }

    function isDelegate(address _adr, uint _priority) public constant returns (bool)  {
        if (_adr == address(this)) return true;
        if (!exists_[_adr]) return false;

        uint index = indice_[_adr];
        return (priorities_[index] != 0 && priorities_[index] <= _priority);
    }
}
