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

    /** [desc] Setup.
      * [param] _policyAddr: policy contract address.
      * [return] none.
      */
    function setup(address _policyAddr) external _onlyOwner {
        // check params
        require(0 != _policyAddr);
        policyAddr_ = _policyAddr;
    }

    function getKeys(uint _id, uint _count) external view _checkPolicyAddr returns (int, string) {
        uint count = 0;
        uint sum = InsurancePolicy(policyAddr_).size();

        // check param
        require(sum > _id);
        require(0 < _count);

        if (sum_ < _id + _count) {
            count = sum_ - _id;
        } else {
            count = _count;
        }

        string memory key = "";
        string memory keys = "";
        for (uint i=0; i<count; i++) {
            key = _getPolicyKey(_id+i);
            keys = keys.concat(key);
            if ((count -1) > i) {
                keys = keys.concat("#");
            }
        }

        return (0, keys);
    }

    function _getPolicyKey(uint _id) private view returns (string) {
        int error = 0;
        address policyMgr = address(0);
        string memory key = "";
        uint8 position = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        
        (error, policyMgr) = InsurancePolicy(policyAddr_).getPolicyMgr();
        (error, key, position, data0, policy, data2) = Hashmap(policyMgr).get(_id, false);

        return key;
    }    

    /** [desc] Get contract related address.
      * [return] contract related address.
      */
    function getAddr() external view _onlyOwner returns (address) {
        return policyAddr_;
    }
}
