/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "./ownable.sol";

contract Hashmap is Ownable {

    struct Data {
        uint8 position_;
        string data0_;
        address data1_;
        uint data2_;
    }

    uint private sum_;
    mapping (uint => string) private keys_;
    mapping (string => uint) private ids_;
    mapping (string => bool) private exists_;
    mapping (string => Data) private datas_;

    constructor() public {
        sum_ = 0;
    }

    /** [desc] Swap data.
      * [param] _key1: key using for mapping data.
      * [param] _key2: key using for mapping data.
      * [return] none.
      */
    function _swap(string _key1, string _key2) private {
        uint id1 = 0;
        uint id2 = 0;

        id1 = ids_[_key1];
        id2 = ids_[_key2];

        keys_[id1] = _key2;
        keys_[id2] = _key1;

        ids_[_key1] = id2;
        ids_[_key2] = id1;
    }

    /** [desc] Set data.
      * [param] _key: key using for mapping data.
      * [param] _data0: data for string.
      * [param] _data1: data for address.
      * [param] _data2: data for uint.
      * [return] none.
      */
    function set(string _key, uint8 _position, string _data0, address _data1, uint _data2) external _onlyOwner {
        if (exists_[_key]) {
            datas_[_key].position_ = _position;
            datas_[_key].data0_ = _data0;
            datas_[_key].data1_ = _data1;
            datas_[_key].data2_ = _data2;
        } else {
            keys_[sum_] = _key;
            ids_[_key] = sum_;
            exists_[_key] = true;
            sum_ ++;

            datas_[_key].position_ = _position;
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
    function swap(string _key1, string _key2) external _onlyOwner {
        require(exists_[_key1]);
        require(exists_[_key2]);
        _swap(_key1, _key2);
    }

    /** [desc] Remove data.
      * [param] _key: key using for mapping data.
      * [return] none.
      */
    function remove(string _key) external _onlyOwner {
        string memory key2 = keys_[sum_-1];

        require(exists_[_key]);
        require(exists_[key2]);

        _swap(_key, key2);

        delete keys_[sum_-1];
        delete ids_[_key];
        exists_[_key] = false;

        sum_ --;
    }

    /** [desc] Get size of data.
      * [param] onlyOwner: flag using for checking owner.
      * [return] size of data.
      */
    function size(bool onlyOwner) external view returns (uint) {
        if (onlyOwner) {
            if (msg.sender != owner_) {
                return 0;
            }
        }

        return sum_;
    }

    /** [desc] Get data by key.
      * [param] _key: key using for mapping data.
      * [param] onlyOwner: flag using for checking owner.
      * [return] error code and data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error   
      */
    function get(string _key, bool onlyOwner) external view returns (int, uint8, string, address, uint) {
        // check param
        if (0 == bytes(_key).length) {
            return (-1, 0, "", address(0), uint(0));
        }

        if (!exists_[_key]) {
            return (-2, 0, "", address(0), uint(0));
        }

        if (onlyOwner) {
            if (msg.sender != owner_) {
                return (-3, 0, "", address(0), uint(0));
            }
        }

        return (0, datas_[_key].position_, datas_[_key].data0_, datas_[_key].data1_, datas_[_key].data2_);
    }

    /** [desc] Get data by id.
      * [param] _id: id of data.
      * [param] onlyOwner: flag using for checking owner.
      * [return] error code and key/data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error   
      */
    function get(uint _id, bool onlyOwner) external view returns (int, string, uint8, string, address, uint) {
        // check param
        if (_id >= sum_) {
            return (-1, "", 0, "", address(0), uint(0));
        }

        if (!exists_[keys_[_id]]) {
            return (-2, "", 0, "", address(0), uint(0));
        }

        if (onlyOwner) {
            if (msg.sender != owner_) {
                return (-3, "", 0, "", address(0), uint(0));
            }
        }

        if (ids_[keys_[_id]] != _id) {
            return (-9, "", 0, "", address(0), uint(0));
        }

        return (0, keys_[_id], datas_[keys_[_id]].position_, datas_[keys_[_id]].data0_, datas_[keys_[_id]].data1_, datas_[keys_[_id]].data2_);
    }
}
