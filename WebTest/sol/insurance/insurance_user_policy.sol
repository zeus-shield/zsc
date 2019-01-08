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

contract InsurancePolicy {
  function remove(string _key, bool _removeUserPolicy) external;
}

contract InsuranceUserPolicy is Delegate {

    using LibString for *;
    using LibInt for *;

    address private userPolicyMgr_;
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
        userPolicyMgr_ = new Hashmap();
        policyAddr_ = address(0);
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() public _onlyOwner {
        Hashmap(userPolicyMgr_).kill();
        userPolicyMgr_ = address(0);
        super.kill();
    }

    /** [desc] Get detail info.
      * [param] _addr: info address.
      * [return] error code and info for json data.
      */
    function _getDetailInfo(address _addr) private view returns (int, string) {
        string memory str = "{";

        uint len = Hashmap(_addr).size();
        if (0 < len) {
            str = str.concat(len.toKeyValue("Size"), ",");
        } else {
            return (-2, "{}");
        }
        for (uint i=0; i<len; i++) {
            int error = 0;
            string memory key = "";
            uint8 position = 0;
            string memory data0 = "";
            address data1 = address(0);
            uint data2 = uint(0);
            (error, key, position, data0, data1, data2) = Hashmap(_addr).get(i);
            if (0 != error) {
                return (error, "{}");
            }

            if (0 == position) {
                str = str.concat(data0.toKeyValue(key));
            } else if (1 == position) {
                string memory data = "0x";
                data = data.concat(data1.addrToAsciiString());
                str = str.concat(data.toKeyValue(key));
            } else if (2 == position) {
                str = str.concat(data2.toKeyValue(key));
            } else {
                return (-2, "{}");
            }

            if ((len -1) > i) {
                str = str.concat(",");
            }
        }

        str = str.concat("}");

        return (0, str);
    }

    /** [desc] Setup.
      * [param] _policyAddr: policy contract address.
      * [return] none.
      */
    function setup(address _policyAddr) external _onlyOwner {
        // check params
        require(address(0) != _policyAddr);
        policyAddr_ = _policyAddr;
    }

    /** [desc] Add policy (only called by 'submit function in insurance_policy.sol' now).
      * [param] _userKey: key of user.
      * [param] _policyKey: key of policy.
      * [param] _policy: address of policy.
      * [return] none.
      */
    function addPolicy(string _userKey, string _policyKey, address _policy) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_userKey).length);
        require(0 != bytes(_policyKey).length);
        require(address(0) != _policy);

        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address policies = address(0);
        uint data2 = uint(0);
        (error, position, data0, policies, data2) = Hashmap(userPolicyMgr_).get(_userKey);
        if (address(0) == policies) {
            policies = new Hashmap();
            Hashmap(userPolicyMgr_).set(_userKey, 1, "", policies, uint(0));
        }

        Hashmap(policies).set(_policyKey, 1, "", _policy, uint(0));
    }

    /** [desc] Remove policy (only called by 'remove function in insurance_policy.sol' now).
      * [param] _userKey: key of user.
      * [param] _policyKey: key of policy.
      * [return] none.
      */
    function removePolicy(string _userKey, string _policyKey) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_userKey).length);
        require(0 != bytes(_policyKey).length);
 
        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address policies = address(0);
        uint data2 = uint(0);
        (error, position, data0, policies, data2) = Hashmap(userPolicyMgr_).get(_userKey);
        require(0 == error);
        require(1 == position);
        require(address(0) != policies);

        Hashmap(policies).remove(_policyKey);
        if (0 == Hashmap(policies).size()) {
            Hashmap(userPolicyMgr_).remove(_userKey);
        }
    }

    /** [desc] Remove policies (only called by 'remove function in insurance_user.sol' now).
      * [param] _userKey: key of user.
      * [param] _removePolicies: the flag that remove policies.
      * [return] none.
      */
    function removePolicies(string _userKey, bool _removePolicies) external _onlyAdminOrHigher _checkPolicyAddr {
        // check param
        require(0 != bytes(_userKey).length);
 
        if (_removePolicies) {
            int error = 0;
            uint position = 0;
            string memory data0 = "";
            address policies = address(0);
            uint data2 = uint(0);
            (error, position, data0, policies, data2) = Hashmap(userPolicyMgr_).get(_userKey);
            require(0 == error);
            require(1 == position);
            require(address(0) != policies);

            uint size = Hashmap(policies).size();
            for (uint i=0; i<size; i++) {
                string memory policyKey = "";
                address policy = address(0);
                // (error, policyKey, position, data0, policy, data2) = Hashmap(policies).get(i);
                // require(0 == error);
                // require(1 == position);
                // // remove policy
                // InsurancePolicy(policyAddr_).remove(policyKey, false);

                (error, policyKey, position, data0, policy, data2) = Hashmap(policies).get(0);
                require(0 == error);
                require(1 == position);

                // remove user policy and policy
                InsurancePolicy(policyAddr_).remove(policyKey, true);
            }
        }

        // if size is 0, remove can be called in function 'removePolicy'
        // Hashmap(userPolicyMgr_).remove(_userKey);
    }

    /** [desc] Get size of users.
      * [param] none.
      * [return] size of users.
      */
    function size() external view returns (uint) {
        return Hashmap(userPolicyMgr_).size();
    }

    /** [desc] Get user policies info by key.
      * [param] _userKey: user key.
      * [return] error code and user policies info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function getPolicies(string _userKey) external view returns (int, string) {
        // check param
        if (0 == bytes(_userKey).length) {
            return (-1, "{}");
        }

        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address policies = address(0);
        uint data2 = uint(0);
        (error, position, data0, policies, data2) = Hashmap(userPolicyMgr_).get(_userKey);
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
        }

        return _getDetailInfo(policies);
    }

    function getAddr() external view _onlyOwner returns (address) {
        return (policyAddr_);
    }
}
