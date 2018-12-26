/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "./ownable.sol";

contract Hashmap is Ownable {

    struct Data {
        bytes32 data0_;
        string data1_;
        address data2_;
    }

    uint private sum_;
    mapping (uint => bytes32) private keys_;
    mapping (bytes32 => uint) private ids_;
    mapping (bytes32 => bool) private exists_;
    mapping (bytes32 => Data) private datas_;

    constructor() public {
        sum_ = 0;
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        selfdestruct(owner_);   
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] Set data.
      * [param] _key: key using for mapping data.
      * [param] _data0: data for bytes32.
      * [param] _data1: data for string.
      * [param] _data2: data for address.
      * [return] none.
      */
    function set(bytes32 _key, bytes32 _data0, string _data1, address _data2) external _onlyOwner {
        if (exists_[_key]) {
            datas_[_key].data0_ = _data0;
            datas_[_key].data1_ = _data1;
            datas_[_key].data2_ = _data2;
        } else {
            keys_[sum_] = _key;
            ids_[_key] = sum_;
            exists_[_key] = true;
            sum_ ++;

            datas_[_key].data0_ = _data0;
            datas_[_key].data1_ = _data1;
            datas_[_key].data2_ = _data2;
        }
    }

    /** [desc] Swap data.
      * [param] _key1: key using for mapping data.
      * [param] _key2: key using for mapping data.
      * [return] none.
      */
    function swap(bytes32 _key1, bytes32 _key2) external _onlyOwner {
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

    /** [desc] Remove data.
      * [param] _key: key using for mapping data.
      * [return] none.
      */
    function remove(bytes32 _key) external _onlyOwner {
        bytes32 key2 = bytes32(0);

        require(exists_[_key]);

        key2 = keys_[sum_-1];

        this.swap(_key, key2);

        delete keys_[sum_-1];
        delete ids_[_key];
        exists_[_key] = false;

        sum_ --;
    }

    /** [desc] Get size of data.
      * [param] none.
      * [return] size of data.
      */
    function size() external view _onlyOwner returns (uint) {
        return sum_;
    }

    /** [desc] Get data by key.
      * [param] _key: key using for mapping data.
      * [return] error code and data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function get(bytes32 _key) external view _onlyOwner returns (int, bytes32, string, address) {
        if (!exists_[_key]) {
            return (-2, bytes32(0), "", address(0));
        }
        return (0, datas_[_key].data0_, datas_[_key].data1_, datas_[_key].data2_);
    }

    /** [desc] Get data by id.
      * [param] _id: id of data.
      * [return] error code and key/data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function get(uint _id) external view _onlyOwner returns (int, bytes32, bytes32, string, address) {
        if (_id >= sum_) {
            return (-1, bytes32(0), bytes32(0), "", address(0));
        }

        if (!exists_[keys_[_id]]) {
            return (-2, bytes32(0), bytes32(0), "", address(0));
        }

        if (ids_[keys_[_id]] != _id) {
            return (-3, bytes32(0), bytes32(0), "", address(0));
        }

        return (0, keys_[_id], datas_[keys_[_id]].data0_, datas_[keys_[_id]].data1_, datas_[keys_[_id]].data2_);
    }
}
