/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract Container {

    struct Data {
        bytes32 data0_;
        string data1_;
    }

    uint sum_;
    mapping (uint => bytes32) private keys_;
    mapping (bytes32 => uint) private ids_;
    mapping (bytes32 => bool) private exists_;
    mapping (bytes32 => Data) private datas_;

    constructor() public {
        sum_ = 0;
    }

    function update(bytes32 _key, bytes32 _data) external {
    }

    function update(bytes32 _key, string _data) external {
    }

    function swap(bytes32 _key1, bytes32 _key2) external {
        uint id1 = 0;
        uint id2 = 0;

        require(exists_[_key1]);
        require(exists_[_key2]);

        id1 = ids_[_key1];
        id2 = ids_[_key2];

        keys_[id1] = _key2;
        keys_[id2] = _key1;

        ids_[_key1] = id2;
        ids_[_key2] = id1;
    }

    function remove(bytes32 _key) external {
        bytes32 key2 = bytes32(0);

        require(exists_[_key]);

        key2 = keys_[sum_-1];

        this.swap(_key, key2);

        delete keys_[sum_-1];
        delete ids_[_key];
        exists_[_key] = false;

        sum_ --;
    }

    function number() external view returns (uint) {
        return sum_;
    }

    function get(bytes32 _key) external view returns (bytes32, string) {
        require(exists_[_key]);
        return (datas_[_key].data0_, datas_[_key].data1_);
    }

    function get(uint _id) external view returns (bytes32, bytes32, string) {
        require(_id < sum_);
        require(exists_[keys_[_id]]);
        require(ids_[keys_[_id]] == _id);
        return (keys_[_id], datas_[keys_[_id]].data0_, datas_[keys_[_id]].data1_);
    }
}
