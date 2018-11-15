/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract Delegate {
    uint delegateNos_;
    mapping (uint => address) public adrs_;
    /** @desc prioritie map.
      * == 0: invalid
      * == 1: ownable
      * >= 2: define by user
      */
    mapping (uint => uint) public priorities_;
    mapping (address => uint) public indice_;
    mapping (address => bool) public exists_;

    constructor() public {
        adrs_[0] = msg.sender;
        priorities_[0] = 1;
        indice_[msg.sender] = 0;
        exists_[msg.sender] = true;
        delegateNos_ = 1;
    }

    modifier _onlyOwner() {
        require(exists_[msg.sender]);
        require(0 == indice_[msg.sender]);
        require(adrs_[0] == msg.sender);
        require(1 == priorities_[0]);
        _;
    }

    function _update(address _adr, uint _priority) private {
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

    function _swap(address _lAdr, uint _rNos) private {
        uint lPriority = 0;
        uint lNos = 0;
        address rAddr = 0;
        uint rPriority = 0;

        rAddr = adrs_[_rNos];
        rPriority = priorities_[_rNos];
        // _rNos;

        // _lAdr
        lNos = indice_[_lAdr];
        lPriority = priorities_[lNos];

        adrs_[lNos] = rAddr;
        priorities_[lNos] = rPriority;
        indice_[rAddr] = lNos;

        adrs_[_rNos] = _lAdr;
        priorities_[_rNos] = lPriority;
        indice_[_lAdr] = _rNos;
    }

    function checkDelegate(address _adr, uint _priority) public view returns (bool)  {
        if (_adr == address(this)) return true;
        if (0 == _priority) return false;
        if (!exists_[_adr]) return false;

        uint index = indice_[_adr];
        return (priorities_[index] != 0 && priorities_[index] <= _priority);
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() external payable { revert(); }

    function kill() external _onlyOwner {
        selfdestruct(adrs_[0]);   
    }

    function transferOwnersihp(address _newOwner) external _onlyOwner {
        if (0 != _newOwner) {
            address owner = adrs_[0];

            // upgrade new owner
            _update(_newOwner, 1);
            uint newOwnerNos = indice_[_newOwner];

            // _swap old owner and new owner
            _swap(_newOwner, 0);
            require(0 == indice_[_newOwner]);
            require(newOwnerNos == indice_[owner]);

            // downgrade old owner
            priorities_[indice_[owner]] = 2;
        }
    }

    function updateDelegate(address _adr, uint _priority) public _onlyOwner {
        if (address(this) == _adr) return;

        // owner's priority can't be changed
        require(adrs_[0] != _adr);

        // invalid priority and owner's priority can't be set
        require(1 < _priority);

        _update(_adr, _priority);
    }

    function removeDelegate(address _adr) public _onlyOwner {
        if (address(this) == _adr) return;

        // owner's priority can't be remove
        require(adrs_[0] != _adr);

        require(0 < delegateNos_);
        require(exists_[_adr]);

        _swap(_adr, delegateNos_-1);
        require((delegateNos_-1) == indice_[_adr]);

        delete adrs_[delegateNos_-1];
        delete priorities_[delegateNos_-1];
        delete indice_[_adr];

        delegateNos_ --;

        exists_[_adr] = false;
    }

    function numberOfDelegates() external view returns (uint) {
        return delegateNos_;
    }

    function getDelegateByIndex(uint _index) external view returns (address, uint) {
        require(_index < delegateNos_);
        require(exists_[adrs_[_index]]);
        require(indice_[adrs_[_index]] == _index);
        return (adrs_[_index], priorities_[_index]);
    }
}
