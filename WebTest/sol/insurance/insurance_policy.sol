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

contract InsuranceTemplate {
    function getByKey(string _key) external view returns (int, string);
}

contract InsurancePolicy is Delegate {

    using LibString for *;
    using LibInt for *;

    address private policyMgr_;
    address private templateAddr_;
    string[] private keys_;

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        policyMgr_ = new Hashmap();
        templateAddr_ = address(0);
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() public _onlyOwner {
        Hashmap(policyMgr_).kill();
        policyMgr_ = address(0);
        super.kill();
    }

    /** [desc] Get policy detail info.
      * [param] _addr: info address.
      * [return] error code and info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function _getDetailInfo(address _addr) private view returns (int, string) {
        uint len = Hashmap(_addr).size(true);
        if (0 == len) {
            return (-2, "");
        }

        string memory str = "{";
        str = str.concat(len.toKeyValue("Size"), ",");
        for (uint i=0; i<len; i++) {
            int error = 0;
            string memory key = "";
            uint8 position = 0;
            string memory data0 = "";
            address data1 = address(0);
            uint data2 = uint(0);
            (error, key, position, data0, data1, data2) = Hashmap(_addr).get(i, true);
            if (0 != error) {
                return (error, "");
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
                return (-9, "");
            }

            if ((len -1) > i) {
                str = str.concat(",");
            }
        }

        str = str.concat("}");

        return (0, str);
    }

    /** [desc] Get policy brief info.
      * [param] _key: policy key.
      * [param] _addr: info address.
      * [return] error code and info for json data.
      *           0: success
      */
    function _getBriefInfo(string _key, address _addr) private pure returns (int, string) {
        string memory str = "{\"Size\":2,";
        string memory policy = "0x";

        policy = policy.concat(_addr.addrToAsciiString());

        str = str.concat(_key.toKeyValue("Key"), ",");
        str = str.concat(policy.toKeyValue("Address"), "}");

        return (0, str);
    }

    /** [desc] Setup.
      * [param] _templateAddr: template contract address.
      * [return] none.
      */
    function setup(address _templateAddr) external _onlyOwner {
        // check params
        require(0 != _templateAddr);
        templateAddr_ = _templateAddr;
    }

    /** [desc] Policy submit.
      * [param] _userKey: user key.
      * [param] _templateKey: policy template key.
      * [param] _policyKey: policy key.
      * [param] _data: json data.
      * [return] none.
      */
    function submit(string _userKey, string _templateKey, string _policyKey, string _data) external _onlyAdminOrHigher _checkTemplateAddr {
        // check param
        require(0 != bytes(_userKey).length);
        require(0 != bytes(_templateKey).length);
        require(0 != bytes(_policyKey).length);
        require(0 != bytes(_data).length);

        string memory template = "";
        int error = 0;
        (error, template) = InsuranceTemplate(templateAddr_).getByKey(_templateKey);
        require(0 == error);
        template.split("#", keys_);

        bool valid = false;
        address policy = new Hashmap();

        for (uint i=0; i<keys_.length; i++) { 
            if (_data.keyExists(keys_[i])) {
                if (keys_[i].equals("Key")) {
                    Hashmap(policy).set(keys_[i], 0, _policyKey, address(0), uint(0));
                } else {
                    string memory value = _data.getStringValueByKey(keys_[i]);
                    Hashmap(policy).set(keys_[i], 0, value, address(0), uint(0));
                }

                valid = true;
            }
        }

        require(valid);

        Hashmap(policyMgr_).set(_policyKey, 1, "", policy, uint(0));
    }

    /** [desc] Add policy's element.
      * [param] _key: policy key.
      * [param] _elementKey: policy's element key.
      * [param] _data: policy's element data.
      * [return] none.
      */
    function addElement(string _key, string _elementKey, string _data) external _onlyAdminOrHigher {
        require(0 != bytes(_key).length);
        require(0 != bytes(_elementKey).length);
        require(0 != bytes(_data).length);

        int error = 0;
        uint8 position = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        (error, position, data0, policy, data2) = Hashmap(policyMgr_).get(_key, true);
        require(0 == error);
        require(1 == position);
        require(0 != policy);

        Hashmap(policy).set(_elementKey, 0, _data, address(0), uint(0));
    }

    /** [desc] remove policy.
      * [param] _key: key of policy.
      * [return] none.
      */
    function remove(string _key) external _onlyAdminOrHigher {
        // check param
        require(0 != bytes(_key).length);
        Hashmap(policyMgr_).remove(_key);
    }

    /** [desc] Get size of users.
      * [param] none.
      * [return] size of users.
      */
    function size() external view returns (uint) {
        return Hashmap(policyMgr_).size(true);
    }

    /** [desc] Get policy manager address.
      * [param] _key: none.
      * [return] error code and policy manager address.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error    
      */
    function getPolicyMgr() external view returns (int, address) {
        // check authority
        if (!checkDelegate(msg.sender, 2)) {
            return (-3, address(0));
        }

        return (0, policyMgr_);
    }

    /** [desc] Get policy info by key.
      * [param] _type: info type (0: detail, 1: brief).
      * [param] _key: policy key.
      * [return] error code and policy info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error
      */
    function getByKey(uint8 _type, string _key) external view returns (int, string) {
        // check param
        if ((1 < _type) || (0 == bytes(_key).length)) {
            return (-1, "");
        }

        int error = 0;
        uint8 position = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        (error, position, data0, policy, data2) = Hashmap(policyMgr_).get(_key, true);
        if (0 != error) {
            return (error, "");
        }
        if (1 != position) {
            return (-9, "");
        }

        if (0 == _type) {
            return _getDetailInfo(policy);
        } else {
            return _getBriefInfo(_key, policy);
        }
    }

    /** [desc] Get policy info by id.
      * [param] _type: info type (0: detail, 1: brief).
      * [param] _id: policy id.
      * [return] error code and policy info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: no authority
      *          -9: inner error 
      */
    function getById(uint8 _type, uint _id) external view returns (int, string) {
        // check param
        if ((1 < _type) || (this.size() <= _id)) {
            return (-1, "");
        }

        int error = 0;
        string memory key = "";
        uint position = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        (error, key, position, data0, policy, data2) = Hashmap(policyMgr_).get(_id, true);
        if (0 != error) {
            return (error, "");
        }
        if (1 != position) {
            return (-9, "");
        }

        if (0 == _type) {
            return _getDetailInfo(policy);
        } else {
            return _getBriefInfo(key, policy);
        }
    }

    /** [desc] Get contract related address.
      * [return] contract related address.
      */
    function getAddr() external view _onlyOwner returns (address) {
        return templateAddr_;
    }
}
