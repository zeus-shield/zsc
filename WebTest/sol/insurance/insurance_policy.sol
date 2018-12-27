/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../common/hashmap.sol";

contract InsuranceTemplate {
    function getByKey(string _key) external view returns (int, string);
}

contract InsurancePolicy is Ownable {

    using LibString for *;

    address private policyMgr_;
    address private templateAddr_;
    string[] private keys_;

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    constructor() public {
        policyMgr_ = new Hashmap();
        templateAddr_ = address(0);
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(policyMgr_).kill();
        selfdestruct(owner_);   
    }

    /** [desc] Get policy detail info.
      * [param] _policy: policy info address.
      * [return] policy info for json data.
      */
    function _getDetailInfo(address _policy) private view returns (string) {
        string memory str = "{";

        uint len = Hashmap(_policy).size();
        for (uint i=0; i<len; i++) {
            int error = 0;
            string memory key = "";
            string memory value = "";
            address data1 = address(0);
            uint data2 = uint(0);
            (error, key, value, data1, data2) = Hashmap(_policy).get(i);
            if (0 == error) {
                if ((len -1) == i) {
                    str = str.concat(value.toKeyValue(key));
                } else {
                    str = str.concat(value.toKeyValue(key), ",");
                }
            }
        }

        str = str.concat("}");

        return str;
    }

    /** [desc] Get policy brief info.
      * [param] _key: policy key.
      * [param] _policy: policy info address.
      * [return] policy info for json data.
      */
    function _getBriefInfo(string _key, address _policy) private pure returns (string) {
        string memory str = "{";
        string memory user = "0x";

        user = user.concat(_policy.addrToAsciiString());

        str = str.concat(_key.toKeyValue("Key"), ",");
        str = str.concat(user.toKeyValue("Address"), "}");

        return str;
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] Setup.
      * [param] _templateAddr: template contract address.
      * [return] none.
      */
    function setup(address _templateAddr) external _onlyOwner {
        // check template address
        require(0 != _templateAddr);
        templateAddr_ = _templateAddr;
    }

    /** [desc] Policy submit.
      * [param] _templateKey: template key.
      * [param] _data: json data.
      * [return] none.
      */
    // function submit(string _templateKey, string _data) external _onlyOwner _checkTemplateAddr {
    function submit(string _templateKey, string _data) external _checkTemplateAddr {
        // check param
        require(0 != bytes(_templateKey).length);
        require(0 != bytes(_data).length);

        string memory template = "";
        int error = 0;
        (error, template) = InsuranceTemplate(templateAddr_).getByKey(_templateKey);
        require(0 == error);
        template.split("#", keys_);

        bool valid = false;
        string memory key = "";
        address policy = new Hashmap();

        for (uint i=0; i<keys_.length; i++) { 
            if (_data.keyExists(keys_[i])) {
                string memory value = _data.getStringValueByKey(keys_[i]);
                Hashmap(policy).set(keys_[i], value, address(0), uint(0));
                
                if (keys_[i].equals("Key")) {
                    key = value;
                }

                valid = true;
            }
        }

        require(valid);

        Hashmap(policyMgr_).set(key, "", policy, uint(0));
    }

    /** [desc] Get size of users.
      * [param] none.
      * [return] size of users.
      */
    function size() external view returns (uint) {
        return Hashmap(policyMgr_).size();
    }

    /** [desc] Get policy info by key.
      * [param] _type: info type (0: detail, 1: brief).
      * [param] _key: policy key.
      * [return] error code and policy info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function getByKey(uint8 _type, string _key) external view returns (int, string) {
        // check param
        if ((1 < _type) || (0 == bytes(_key).length)) {
            return (-1, "{}");
        }

        int error = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        (error, data0, policy, data2) = Hashmap(policyMgr_).get(_key);
        if (0 != error) {
            return (error, "{}");
        }

        string memory str = "";
        if (0 == _type) {
            str = _getDetailInfo(policy);
        } else {
            str = _getBriefInfo(_key, policy);
        }

        return (0, str);
    }

    /** [desc] Get policy info by id.
      * [param] _type: info type (0: detail, 1: brief).
      * [param] _id: policy id.
      * [return] error code and policy info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function getById(uint8 _type, uint _id) external view returns (int, string) {
        // check param
        if ((1 < _type) || (this.size() <= _id)) {
            return (-1, "{}");
        }

        int error = 0;
        string memory key = "";
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        (error, key, data0, policy, data2) = Hashmap(policyMgr_).get(_id);
        if (0 != error) {
            return (error, "{}");
        }

        string memory str = "";

        if (0 == _type) {
            str = _getDetailInfo(policy);
        } else {
            str = _getBriefInfo(key, policy);
        }

        return (0, str);
    }

    function getTemplateAddr() external view _onlyOwner returns (address) {
        return templateAddr_;
    }
}
