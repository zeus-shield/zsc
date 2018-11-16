/**
 Copyright (c) 2018, deduotech.com
 2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract Delegate {
    uint sum_;
    mapping (uint => address) private addrs_;
    /** @desc prioritie map.
      * == 0: invalid
      * == 1: ownable
      * >= 2: define by user
      */
    mapping (uint => uint) private prios_;
    mapping (address => uint) private ids_;
    mapping (address => bool) private exists_;

    constructor() public {
        addrs_[0] = msg.sender;
        prios_[0] = 1;
        ids_[msg.sender] = 0;
        exists_[msg.sender] = true;
        sum_ = 1;
    }

    modifier _onlyOwner() {
        require(exists_[msg.sender]);
        require(0 == ids_[msg.sender]);
        require(addrs_[0] == msg.sender);
        require(1 == prios_[0]);
        _;
    }

    function _update(address _addr, uint _prio) private {
        uint id;
        if (exists_[_addr]) {
            id = ids_[_addr];
            // addrs_[id] = _addr;
            prios_[id] = _prio;
        } else {
            id = sum_;
            exists_[_addr] = true;
            ids_[_addr] = id;
            addrs_[id] = _addr;
            prios_[id] = _prio;
            sum_ ++;
        }
    }

    function _swap(address _addr1, uint _id2) private {
        uint prio1 = 0;
        uint id1 = 0;
        address addr2 = 0;
        uint prio2 = 0;

        addr2 = addrs_[_id2];
        prio2 = prios_[_id2];
        // _id2;

        // _addr1
        id1 = ids_[_addr1];
        prio1 = prios_[id1];

        addrs_[id1] = addr2;
        prios_[id1] = prio2;
        ids_[addr2] = id1;

        addrs_[_id2] = _addr1;
        prios_[_id2] = prio1;
        ids_[_addr1] = _id2;
    }

    function checkDelegate(address _addr, uint _prio) public view returns (bool)  {
        if (_addr == address(this)) return true;
        if (0 == _prio) return false;
        if (!exists_[_addr]) return false;

        uint id = ids_[_addr];
        return (prios_[id] != 0 && prios_[id] <= _prio);
    }

    // This unnamed function is called whenever someone tries to send ether to it
    function() external payable { revert(); }

    function kill() external _onlyOwner {
        selfdestruct(addrs_[0]);   
    }

    function transferOwnership(address _newOwner, uint _degradePrio) external _onlyOwner {
        require(0 != _newOwner);
        require(addrs_[0] != _newOwner);
        require(1 < _degradePrio);

        // upgrade new owner
        _update(_newOwner, 1);

        // _swap old owner and new owner
        uint newOwnerId = ids_[_newOwner];
        address owner = addrs_[0];
        _swap(_newOwner, 0);
        require(0 == ids_[_newOwner]);
        require(newOwnerId == ids_[owner]);

        // degrade old owner
        prios_[ids_[owner]] = _degradePrio;
    }

    function updateDelegate(address _addr, uint _prio) external _onlyOwner {
        if (address(this) == _addr) return;

        // owner's priority can't be changed
        require(addrs_[0] != _addr);

        // invalid priority and owner's priority can't be set
        require(1 < _prio);

        _update(_addr, _prio);
    }

    function removeDelegate(address _addr) external _onlyOwner {
        if (address(this) == _addr) return;

        // owner's priority can't be remove
        require(addrs_[0] != _addr);

        require(0 < sum_);
        require(exists_[_addr]);

        uint id1 = ids_[_addr];
        address addr2 = addrs_[sum_-1];
        _swap(_addr, sum_-1);
        require((sum_-1) == ids_[_addr]);
        require(id1 == ids_[addr2]);

        delete addrs_[sum_-1];
        delete prios_[sum_-1];
        delete ids_[_addr];

        sum_ --;

        exists_[_addr] = false;
    }

    function numberOfDelegates() external view returns (uint) {
        return sum_;
    }

    function getDelegateById(uint _id) external view returns (address, uint) {
        require(_id < sum_);
        require(exists_[addrs_[_id]]);
        require(ids_[addrs_[_id]] == _id);
        return (addrs_[_id], prios_[_id]);
    }
}
