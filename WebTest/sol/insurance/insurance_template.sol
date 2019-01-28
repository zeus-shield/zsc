/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../common/hashmap.sol";
import "../common/delegate.sol";

contract InsuranceTemplate is Delegate {

    address private tempMgr_;

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        tempMgr_ = new Hashmap();
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() external _onlyOwner {
        Hashmap(tempMgr_).kill();
        tempMgr_ = address(0);
        super.kill();
    }

    /** [desc] update template.
      * [param] _key: key of template.
      * [param] _data: data of template.
      * [return] none.
      */
    function update(string _key, string _data) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_key).length);
        require(0 != bytes(_data).length);
        Hashmap(tempMgr_).set(_key, 0, _data, address(0), uint(0));
    }

    /** [desc] remove template.
      * [param] _key: key of template.
      * [return] none.
      */
    function remove(string _key) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_key).length);
        Hashmap(tempMgr_).remove(_key);
    }

    /** [desc] Get size of templates.
      * [param] none.
      * [return] size of templates.
      */
    function size() external view returns (uint) {
        return Hashmap(tempMgr_).size(true);
    }

    /** [desc] Get template by id.
      * [param] _id: _id of template.
      * [return] error code and template key/data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function getById(uint _id) external view returns (int, string, string) {
        // check param
        if (Hashmap(tempMgr_).size(true) <= _id) {
            return (-1, "", "");
        }

        int error = 0;
        string memory key = "";
        uint8 positon = 0;
        string memory value = "";
        address data1 = address(0);
        uint data2 = uint(0);

        (error, key, positon, value, data1, data2) = Hashmap(tempMgr_).get(_id, true);        
        return (error, key, value);
    }

    /** [desc] Get template by key.
      * [param] _key: key of template.
      * [return] error code and template data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function getByKey(string _key) external view returns (int, string) {
        // check param
        if (0 == bytes(_key).length) {
            return (-1, "");
        }

        int error = 0;
        uint8 positon = 0;
        string memory value = "";
        address data1 = address(0);
        uint data2 = uint(0);

        (error, positon, value, data1, data2) = Hashmap(tempMgr_).get(_key, true);        
        return (error, value);
    }
}
