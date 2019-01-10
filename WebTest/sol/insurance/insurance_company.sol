/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../utillib/LibInt.sol";
import "../common/hashmap.sol";
import "../common/delegate.sol";

contract InsuranceCompany is Delegate {

    using LibString for *;
    using LibInt for *;

    address private companyMgr_;

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        companyMgr_ = new Hashmap();
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() public _onlyOwner {
        Hashmap(companyMgr_).kill();
        companyMgr_ = address(0);
        super.kill();
    }

    /** [desc] update company.
      * [param] _key: key of company.
      * [param] _data: data of company.
      * [return] none.
      */
    function update(string _key, string _data) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_key).length);
        require(0 != bytes(_data).length);
        Hashmap(companyMgr_).set(_key, 0, _data, address(0), uint(0));
    }

    /** [desc] remove company.
      * [param] _key: key of company.
      * [return] none.
      */
    function remove(string _key) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_key).length);
        Hashmap(companyMgr_).remove(_key);
    }

    /** [desc] Get size of companies.
      * [param] none.
      * [return] size of companies.
      */
    function size() external view returns (uint) {
        return Hashmap(companyMgr_).size();
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
        // check param
        if (Hashmap(companyMgr_).size() <= _id) {
            return (-1, "", "");
        }

        int error = 0;
        string memory key = "";
        uint8 positon = 0;
        string memory value = "";
        address data1 = address(0);
        uint data2 = uint(0);

        (error, key, positon, value, data1, data2) = Hashmap(companyMgr_).get(_id);
        if (0 != positon) {
            return (-2, "{}", "{}");
        }
        
        return (error, key, value);
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
        int error = 0;
        uint8 positon = 0;
        string memory value = "";
        address data1 = address(0);
        uint data2 = uint(0);

        (error, positon, value, data1, data2) = Hashmap(companyMgr_).get(_key);
        if (0 != positon) {
            return (-2, "{}");
        }
        
        return (error, value);
    }

    /** [desc] Get all companies' info.
      * [return] error code and all companies' data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error
      */
    function getAll() external view returns (int, string) {
        string memory str = "{";
        uint len = Hashmap(companyMgr_).size();
        if (0 < len) {
            str = str.concat(len.toKeyValue("Size"), ",");
        } else {
            return (-2, "{}");
        }

        int error = 0;
        string memory key = "";
        string memory data = "";

        for (uint i=0; i<len; i++) {
            (error, key, data) = this.getById(i);
            if (0 != error) {
                return (error, "{}");
            }

            str = str.concat(data.toKeyValue(key));

            if ((len -1) > i) {
                str = str.concat(",");
            }
        }

        str = str.concat("}");

        return (error, str);
    }
}
