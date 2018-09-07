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
    function balanceOf(address _owner) public view returns (uint balance);
}

contract Owned {
    address owner;

    function Owned() public {owner = msg.sender;}
    
    function transferOwnership(address newOwner) public {
        checkOwner(msg.sender);
        owner = newOwner;
    }       

    function checkOwner(address _account) internal view { 
        require(_account == owner); 
    }
}

contract Delegated is Owned {
    using SafeMath for uint;

    uint delegateNos_;
    mapping (uint => address) public adrs_;
    mapping (uint => uint) public priorities_;
    mapping (address => uint) public indice_;
    mapping (address => bool) public exists_;

    function Delegated() public {
        exists_[msg.sender] = true;
        indice_[msg.sender] = 0;
        adrs_[0] = msg.sender;
        priorities_[0] = 1;
        delegateNos_ = 1;
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() public payable { revert(); }

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

    function numDelegates() internal view returns (uint) {
        return delegateNos_;
    }

    function getDelegateInfoByIndex(uint _index) internal view returns (address, uint) {
        require(_index < delegateNos_);
        return (adrs_[_index], priorities_[_index]);
    }

    function checkDelegate(address _adr, uint _priority) internal view {
        require(isDelegate(_adr, _priority));
    }

    function setDelegate(address _adr, uint _priority) public {
        checkDelegate(msg.sender, 1);
        if (_adr != address(this)) {
            addDelegate(_adr, _priority);
        }
    }
    
    function random(uint _min, uint _max) public view returns (uint) {
        require(_min < _max);
        uint c = uint(keccak256(block.blockhash(block.number-1), now ))%(_max - _min);
        return c.add(_min);
    }
    
    function isDelegate(address _adr, uint _priority) public view returns (bool)  {
        if (_adr == address(this)) return true;
        if (!exists_[_adr]) return false;

        uint index = indice_[_adr];
        return (priorities_[index] != 0 && priorities_[index] <= _priority);
    }

    // ------------------------------------------------------------------------
    // Owner can transfer out any accidentally sent ERC20 tokens
    // ------------------------------------------------------------------------
    function transferAnyERC20Token(address tokenAddress, uint tokens) public returns (bool success) {
        checkOwner(msg.sender);
        return ERC20Interface(tokenAddress).transfer(msg.sender, tokens);
    }  
}
