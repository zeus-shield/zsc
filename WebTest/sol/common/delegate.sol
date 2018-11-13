/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "./ownable.sol";

contract Delegate is Ownable {
    uint delegateNos_;
    mapping (uint => address) public adrs_;
    /** @desc prioritie map.
      * 0: invalid
      * 1: ownable
      * 2 ~ uint: define by user
      */
    mapping (uint => uint) public priorities_;
    mapping (address => uint) public indice_;
    mapping (address => bool) public exists_;

    constructor() public {
        exists_[msg.sender] = true;
        indice_[msg.sender] = 0;
        adrs_[0] = msg.sender;
        priorities_[0] = 1;
        delegateNos_ = 1;
    }

    function check(address _adr, uint _priority) public view returns (bool)  {
        if (_adr == address(this)) return true;
        if (0 == _priority) return false;
        if (!exists_[_adr]) return false;

        uint index = indice_[_adr];
        return (priorities_[index] != 0 && priorities_[index] <= _priority);
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() external payable { revert(); }

    function kill() external _onlyOwner {
        require(check(msg.sender, 1));
        selfdestruct(owner_);   
    }

    function update(address _adr, uint _priority) external _onlyOwner {
        if (address(this) == _adr) return;

        // owner's priority can't be changed
        require(owner_ != _adr);

        require(1 < _priority);

        require(check(msg.sender, 1));

        uint index;
        if (exists_[_adr]) {
            index = indice_[_adr];
            // adrs_[index] = _adr;
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

    function remove(address _adr) external _onlyOwner {
        if (address(this) == _adr) return;
        if (0 == delegateNos_) return;

        // owner's priority can't be remove
        require(owner_ != _adr);

        require(check(msg.sender, 1));

        address lastAddr = 0;
        uint lastPriority = 0;
        uint currentIndex = 0;

        lastAddr = adrs_[delegateNos_-1];
        lastPriority = priorities_[delegateNos_-1];
        currentIndex = indice_[_adr];

        adrs_[currentIndex] = lastAddr;
        delete adrs_[delegateNos_-1];

        priorities_[currentIndex] = lastPriority;
        delete priorities_[delegateNos_-1];

        indice_[lastAddr] = currentIndex;
        delete indice_[_adr];

        delegateNos_ --;

        exists_[_adr] = false;
    }

    function number() external view returns (uint) {
        return delegateNos_;
    }

    function getInfoByIndex(uint _index) external view returns (address, uint) {
        require(_index < delegateNos_);
        require(exists_[adrs_[_index]]);
        require(indice_[adrs_[_index]] == _index);
        return (adrs_[_index], priorities_[_index]);
    }
}
