/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../common/hashmap.sol";
import "../common/delegate.sol";

contract InsurancePolicy {
    function size() external view returns (uint);
    function getPolicyMgr() external view returns (int, address);
}

contract InsuranceAnalytics is Delegate {

    using LibString for *;

    address private policyAddr_;

    modifier _checkPolicyAddr() {
        require(0 != policyAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        policyAddr_ = address(0);
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() public _onlyOwner {
        super.kill();
    }

    /** [desc] Get policy map from insurance_policy.sol.
      * [param] _id: policy id.
      * [return] error code and map info(key => policy address).
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function _getPolicyMap(uint _id) private view returns (int, string, address) {
        // check authority
        if (0 == policyAddr_) {
            return (-1, "", address(0));
        }

        int error = 0;
        address policyMgr = address(0);
        string memory key = "";
        uint8 position = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        
        (error, policyMgr) = InsurancePolicy(policyAddr_).getPolicyMgr();
        if ((0 != error) || (address(0) == policyMgr)) {
            return (error, "", address(0));
        }

        (error, key, position, data0, policy, data2) = Hashmap(policyMgr).get(_id, false);
        return (error, key, policy);
    }

    /** [desc] Setup.
      * [param] _policyAddr: policy contract address.
      * [return] none.
      */
    function setup(address _policyAddr) external _onlyOwner {
        // check params
        require(0 != _policyAddr);
        policyAddr_ = _policyAddr;
    }

    /** [desc] Get policy keys.
      * [param] _id: policy starting id.
      * [param] _count: wanted count(include starting id).
      * [return] error code and info.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function getKeys(uint _id, uint _count) external view returns (int, string) {
        uint count = 0;
        uint sum = InsurancePolicy(policyAddr_).size();

        // check param
        if ((sum <= _id) || (0 == _count)) {
            return (-1, "");
        }

        if (sum < _id + _count) {
            count = sum - _id;
        } else {
            count = _count;
        }

        int error = 0;
        string memory key = "";
        address policy = address(0);
        string memory keys = "";
        for (uint i=0; i<count; i++) {
            (error, key, policy) = _getPolicyMap(_id+i);
            if (0 != error) {
                return (error, "");
            }

            keys = keys.concat(key);
            if ((count -1) > i) {
                keys = keys.concat(",");
            }
        }

        return (0, keys);
    }

    /** [desc] Get contract related address.
      * [return] contract related address.
      */
    function getAddr() external view _onlyOwner returns (address) {
        return policyAddr_;
    }
}
