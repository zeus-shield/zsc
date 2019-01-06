/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../common/hashmap.sol";

contract InsuranceCompany is Ownable {

    address private companyMgr_;

    constructor() public {
        companyMgr_ = new Hashmap();
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(companyMgr_).kill();
        selfdestruct(owner_);   
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] update company.
      * [param] _key: key of company.
      * [param] _data: data of company.
      * [return] none.
      */
    // function update(string _key, string _data) external _onlyOwner {
    function update(string _key, string _data) external {
        // check param
        require(0 != bytes(_key).length);
        require(0 != bytes(_data).length);
        Hashmap(companyMgr_).set(_key, 0, _data, address(0), uint(0));
    }

    /** [desc] remove company.
      * [param] _key: key of company.
      * [return] none.
      */
    // function remove(string _key) external _onlyOwner {
    function remove(string _key) external {
    }

    /** [desc] Get size of companies.
      * [param] none.
      * [return] size of companies.
      */
    function size() external view returns (uint) {
    }

    /** [desc] Get company by id.
      * [param] _id: _id of company.
      * [return] error code and company key/data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error
      */
    function getById(uint _id) external view returns (int, string, string) {
    }

    /** [desc] Get company by key.
      * [param] _key: key of company.
      * [return] error code and company data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error
      */
    function getByKey(string _key) external view returns (int, string) {
    }
}
