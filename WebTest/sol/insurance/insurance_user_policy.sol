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

contract InsuranceUser {
    function remove(string _key) external;
}

contract InsurancePolicy {
    function submit(string _userKey, string _templateKey, string _policyKey, string _data) external;
    function remove(string _key) external;
    function getPolicyAddr(string _key) external view returns (int, address);
}

contract InsuranceUserPolicy is Delegate {

    using LibString for *;
    using LibInt for *;

    address private userPolicyMgr_;
    address private userAddr_;
    address private policyAddr_;
    string[] private keys_;

    /** @desc string(original policy key) => uint(sum)
        @eg ddroyce@163.com_PingAn_Life => 9
      */
    mapping(string => uint) private sums_;

    modifier _checkUserAddr() {
        require(0 != userAddr_);
        _;
    }

    modifier _checkPolicyAddr() {
        require(0 != policyAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        // require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        userPolicyMgr_ = new Hashmap();
        userAddr_ = address(0);
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

    /** [desc] Add policy.
      * [param] _userKey: key of user.
      * [param] _policyKey: key of policy.
      * [param] _policy: address of policy.
      * [return] none.
      */
    function _addPolicy(string _userKey, string _policyKey, address _policy) private {
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

    /** [desc] Remove policy.
      * [param] _policyKey: key of policy.
      * [return] none.
      */
    function _removePolicy(string _policyKey) private {
        _policyKey.split("_", keys_);

        string memory userKey = keys_[0];

        // 1. remove policy for insurance.sol
        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address policies = address(0);
        uint data2 = uint(0);
        (error, position, data0, policies, data2) = Hashmap(userPolicyMgr_).get(userKey);
        require(0 == error);
        require(1 == position);
        require(address(0) != policies);

        Hashmap(policies).remove(_policyKey);
        if (0 == Hashmap(policies).size()) {
            Hashmap(userPolicyMgr_).remove(userKey);
        }

        string memory key = userKey;
        key = key.concat("_", keys_[1]);
        key = key.concat("_", keys_[2]);
        if (sums_[key] > 0) {
            sums_[key] --;
        }

        // 2. remove policy for insurance_policy.sol
        InsurancePolicy(policyAddr_).remove(_policyKey);
    }

    /** [desc] Remove policies
      * [param] _userKey: key of user.
      * [return] none.
      */
    function _removePolicies(string _userKey) private {
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

            (error, policyKey, position, data0, policy, data2) = Hashmap(policies).get(0);
            require(0 == error);
            require(1 == position);

            _removePolicy(policyKey);
        }
    }

    /** [desc] Setup.
      * [param] _userAddr: user contract address.
      * [param] _policyAddr: policy contract address.
      * [return] none.
      */
    function setup(address _userAddr, address _policyAddr) external _onlyOwner {
        // check params
        require(address(0) != _userAddr);
        require(address(0) != _policyAddr);
        userAddr_ = _userAddr;
        policyAddr_ = _policyAddr;
    }

    /** [desc] Policy submit.
      * [param] _userKey: user key.
      * [param] _templateKey: policy template key.
      * [param] _policyKey: policy key.
      * [param] _data: json data.
      * [return] none.
      */
    function submit(string _userKey, string _templateKey, string _policyKey, string _data) external _onlyAdminOrHigher _checkPolicyAddr {
        // check param
        require(0 != bytes(_userKey).length);
        require(0 != bytes(_templateKey).length);
        require(0 != bytes(_policyKey).length);
        require(0 != bytes(_data).length);

        string memory policyKey = _policyKey.concat("_", sums_[_policyKey].toString());
        InsurancePolicy(policyAddr_).submit(_userKey, _templateKey, policyKey, _data);
        
        int error = 0;
        address policy = address(0);
        (error, policy) = InsurancePolicy(policyAddr_).getPolicyAddr(policyKey);
        require(0 == error);
        require(address(0) != policy);

        _addPolicy(_userKey, policyKey, policy);

        sums_[_policyKey] ++;
    }

    /** [desc] remove user or policy.
      * [param] _type: type of module(0: user, 1: policy).
      * [param] _key: key of user or policy.
      * [return] none.
      */
    function remove(uint8 _type, string _key) external _onlyAdminOrHigher _checkUserAddr _checkPolicyAddr {
        // check param
        require(0 != bytes(_key).length);

        if (0 == _type) {
            if (0 < Hashmap(userPolicyMgr_).size()) {
                _removePolicies(_key);
            }
            InsuranceUser(userAddr_).remove(_key);
        } else if (1 == _type) {
            _removePolicy(_key);
        } else {
            require(false);
        }
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

    /** [desc] Get contract related address.
      * [return] contract addresses.
      */
    function getAddr() external view _onlyOwner returns (address, address) {
        return (userAddr_, policyAddr_);
    }
}
