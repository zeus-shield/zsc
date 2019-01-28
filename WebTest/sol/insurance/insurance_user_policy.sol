/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../utillib/LibInt.sol";
import "../common/delegate.sol";

contract InsuranceUser {
    function remove(string _key) external;
}

contract InsurancePolicy {
    function submit(string _userKey, string _templateKey, string _policyKey, string _data) external;
    function remove(string _key) external;
}

contract InsuranceUserPolicy is Delegate {

    using LibString for *;
    using LibInt for *;

    struct strArray {
        // id start from '1', '0' means no exists
        mapping(string => uint) ids_;
        mapping(uint => string) strs_;
        uint sum_;
    }

    address private userAddr_;
    address private policyAddr_;
    string[] private keys_;

    /** @desc string(original policy key) => uint(sum)
        @eg ddroyce@163.com_PingAn_Life => 9
      */
    mapping(string => uint) private sums_;

    /** @desc string(user key) => strArray(policy keys) */
    mapping(string => strArray) private policyKeys_;

    modifier _checkUserAddr() {
        require(0 != userAddr_);
        _;
    }

    modifier _checkPolicyAddr() {
        require(0 != policyAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        userAddr_ = address(0);
        policyAddr_ = address(0);
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() public _onlyOwner {
        super.kill();
    }

    /** [desc] Add policy key.
      * [param] _userKey: key of user.
      * [param] _policyKey: key of policy.
      * [return] none.
      */
    function _addPolicyKey(string _userKey, string _policyKey) private {
        // check exists
        if (0 != policyKeys_[_userKey].ids_[_policyKey]) {
            return;
        }

        uint sum = ++policyKeys_[_userKey].sum_;
        policyKeys_[_userKey].ids_[_policyKey] = sum;
        policyKeys_[_userKey].strs_[sum] = _policyKey;
    }

    /** [desc] Remove policy key.
      * [param] _userKey: key of user.
      * [param] _policyKey: key of policy.
      * [return] none.
      */
    function _removePolicyKey(string _userKey, string _policyKey) private {
        uint sum = policyKeys_[_userKey].sum_;
        // check sum
        require(0 != sum);
        // check exists
        require(0 != policyKeys_[_userKey].ids_[_policyKey]);

        string memory key2 = policyKeys_[_userKey].strs_[sum];
        // check exists
        require(0 != policyKeys_[_userKey].ids_[key2]);

        // swap
        uint id1 = policyKeys_[_userKey].ids_[_policyKey];
        uint id2 = policyKeys_[_userKey].ids_[key2];

        policyKeys_[_userKey].strs_[id1] = key2;
        policyKeys_[_userKey].strs_[id2] = _policyKey;

        policyKeys_[_userKey].ids_[_policyKey] = id2;
        policyKeys_[_userKey].ids_[key2] = id1;

        delete policyKeys_[_userKey].strs_[sum];
        policyKeys_[_userKey].ids_[_policyKey] = 0;
        sum_ --;
    }

    /** [desc] Remove policy.
      * [param] _policyKey: key of policy.
      * [return] none.
      */
    function _removePolicy(string _policyKey) private {
        _policyKey.split("_", keys_);

        // 1. remove policy key for insurance_user_policy.sol
        _removePolicyKey(keys_[0], _policyKey);

        string memory key = keys_[0];
        key = key.concat("_", keys_[1]);
        key = key.concat("_", keys_[2]);
        if (sums_[key] > 0) {
            sums_[key] --;
        }

        // 2. remove policy for insurance_policy.sol
        InsurancePolicy(policyAddr_).remove(_policyKey);
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

        _addPolicyKey(_userKey, policyKey);

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
            // remove policies
            uint size = policyKeys_[_key].sum_;
            for (uint i=0; i<size; i++) {
                string memory policyKey = policyKeys_[_key].strs_[1];
                _removePolicy(policyKey);
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
      *          -3: no authority
      *          -9: inner error   
      */
    function getPolicies(string _userKey) external view returns (int, string) {
        // check param
        if (0 == bytes(_userKey).length) {
            return (-1, "");
        }
        
        uint sum = policyKeys_[_userKey].sum_;
        if (0 == sum) {
            return (-2, "");
        }

        string memory str = "";
        for (uint i=1; i<=sum; i++) {
            str = str.concat(policyKeys_[_userKey].strs_[i]);
            if (sum > i) {
                str = str.concat(",");
            }
        }

        return (0, str);
    }

    /** [desc] Get contract related address.
      * [return] contract addresses.
      */
    function getAddr() external view _onlyOwner returns (address, address) {
        return (userAddr_, policyAddr_);
    }
}
