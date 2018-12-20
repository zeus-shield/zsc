/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

contract Container {

    struct Data {
        uint8 type_;
        bytes32 dataBytes32_;
        string dataString_;
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
    }

    function get(uint _id) external view returns (bytes32, bytes32, string) {
        require(_id < sum_);
        require(exists_[keys_[_id]]);
        require(ids_[keys_[_id]] == _id);
        return (keys_[_id], datas_[keys_[_id]].data0_, datas_[keys_[_id]].data1_);
    }
}
