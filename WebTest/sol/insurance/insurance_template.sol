/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../common/hashmap.sol";

contract InsuranceTemplate is Ownable {

    address private tempMgr_;

    constructor() public {
        tempMgr_ = new Hashmap();
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(tempMgr_).kill();
        selfdestruct(owner_);   
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] update template.
      * [param] _key: key of template.
      * [param] _data: data of template.
      * [return] none.
      */
    function update(string _key, string _data) external _onlyOwner {
        // check param
        require(0 != bytes(_key).length);
        Hashmap(tempMgr_).set(_key, bytes32(0), _data, address(0), uint(0));
    }

    /** [desc] Get size of templates.
      * [param] none.
      * [return] size of templates.
      */
    function size() external view returns (uint) {
        return Hashmap(tempMgr_).size();
    }

    /** [desc] Get template by id.
      * [param] _id: _id of template.
      * [return] error code and template key/data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error
      */
    function getById(uint _id) external view returns (int, string, string) {
        // check param
        if (Hashmap(tempMgr_).size() <= _id) {
            return (-1, "", "");
        }

        int error = 0;
        string memory key = "";
        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);
        uint data3 = uint(0);

        (error, key, data0, data1, data2, data3) = Hashmap(tempMgr_).get(_id);
        
        return (error, key, data1);
    }

    /** [desc] Get template by key.
      * [param] _key: key of template.
      * [return] error code and template data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error
      */
    function getByKey(string _key) external view returns (int, string) {
        int error = 0;
        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);
        uint data3 = uint(0);

        (error, data0, data1, data2, data3) = Hashmap(tempMgr_).get(_key);
        
        return (error, data1);
    }
}
