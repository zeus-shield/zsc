/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../utillib/LibInt.sol";
import "../common/hashmap.sol";

contract InsuranceTemplate {
    function getByKey(string _key) external view returns (int, string);
}

contract InsuranceUser is Ownable {

    using LibString for *;
    using LibInt for *;

    address private userMgr_;
    address private templateAddr_;
    string[] private keys_;

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    constructor() public {
        userMgr_ = new Hashmap();
        templateAddr_ = address(0);
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(userMgr_).kill();
        selfdestruct(owner_);   
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

    /** [desc] Get user brief info.
      * [param] _key: user key.
      * [param] _addr: nfo address.
      * [return] error code and info for json data.
      */
    function _getBriefInfo(string _key, address _addr) private pure returns (int, string) {
        string memory str = "{\"Size\":2,";
        string memory user = "0x";

        user = user.concat(_addr.addrToAsciiString());

        str = str.concat(_key.toKeyValue("Key"), ",");
        str = str.concat(user.toKeyValue("Address"), "}");

        return (0, str);
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

    /** [desc] User sign up.
      * [param] _data: json data.
      * [return] none.
      */
    // function signUp(string _data) external _onlyOwner _checkTemplateAddr {
    function signUp(string _data) external _checkTemplateAddr {
        // check param
        require(0 != bytes(_data).length);

        string memory template = "";
        int error = 0;
        (error, template) = InsuranceTemplate(templateAddr_).getByKey("[DB][User]");
        require(0 == error);
        template.split("#", keys_);

        bool valid = false;
        string memory key = "";
        address user = new Hashmap();

        for (uint i=0; i<keys_.length; i++) { 
            if (_data.keyExists(keys_[i])) {
                string memory value = _data.getStringValueByKey(keys_[i]);
                Hashmap(user).set(keys_[i], 0, value, address(0), uint(0));
                
                if (keys_[i].equals("Key")) {
                    key = value;
                }

                valid = true;
            }
        }

        require(valid);

        Hashmap(userMgr_).set(key, 1, "", user, uint(0));
    }

    /** [desc] remove user.
      * [param] _key: key of user.
      * [return] none.
      */
    // function remove(string _key) external _onlyOwner {
    function remove(string _key) external {
        // check param
        require(0 != bytes(_key).length);
        Hashmap(userMgr_).remove(_key);
    }

    /** [desc] Get size of users.
      * [param] none.
      * [return] size of users.
      */
    function size() external view returns (uint) {
        return Hashmap(userMgr_).size();
    }

    /** [desc] Set policy (only called by 'submit function in insurance_policy.sol' now).
      * [param] _key: key of user.
      * [param] _policyKey: key of policy.
      * [param] _policy: address of policy.
      * [return] none.
      */
    // function setPolicy(string _key, string _policyKey, address _policy) external _onlyOwner {
    function setPolicy(string _key, string _policyKey, address _policy) external {
        // check param
        require(0 != bytes(_key).length);
        require(0 != bytes(_policyKey).length);
        require(address(0) != _policy);

        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, position, data0, user, data2) = Hashmap(userMgr_).get(_key);
        require(0 == error);
        require(1 == position);

        address policies = address(0);
        (error, position, data0, policies, data2) = Hashmap(user).get("Policies");
        if (address(0) == policies) {
            policies = new Hashmap();
            Hashmap(user).set("Policies", 1, "", policies, uint(0));
        }

        Hashmap(policies).set(_policyKey, 1, "", _policy, uint(0));
    }

    /** [desc] Remove policy (only called by 'remove function in insurance_policy.sol' now).
      * [param] _key: key of user.
      * [param] _key: key of policy.
      * [return] none.
      */
    // function removePolicy(string _key, string _policyKey) external _onlyOwner {
    function removePolicy(string _key, string _policyKey) external {
        // check param
        require(0 != bytes(_key).length);
        require(0 != bytes(_policyKey).length);
 
        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, position, data0, user, data2) = Hashmap(userMgr_).get(_key);
        require(0 == error);
        require(1 == position);

        address policies = address(0);
        (error, position, data0, policies, data2) = Hashmap(user).get("Policies");
        require(address(0) != policies);

        Hashmap(policies).remove(_policyKey);
    }

    /** [desc] Get user info by key.
      * [param] _type: info type (0: detail, 1: brief).
      * [param] _key: user key.
      * [return] error code and user info for json data.
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
        uint position = 0;
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, position, data0, user, data2) = Hashmap(userMgr_).get(_key);
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
        }

        if (0 == _type) {
            return _getDetailInfo(user);
        } else {
            return _getBriefInfo(_key, user);
        }
    }

    /** [desc] Get user info by id.
      * [param] _type: info type (0: detail, 1: brief).
      * [param] _id: user id.
      * [return] error code and user info for json data.
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
        uint position = 0;
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, key, position, data0, user, data2) = Hashmap(userMgr_).get(_id);
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
        }

        if (0 == _type) {
            return  _getDetailInfo(user);
        } else {
            return _getBriefInfo(key, user);
        }
    }

    /** [desc] Get user policies info by key.
      * [param] _key: user key.
      * [return] error code and user policies info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function getPolicies(string _key) external view returns (int, string) {
        // check param
        if (0 == bytes(_key).length) {
            return (-1, "{}");
        }

        int error = 0;
        uint position = 0;
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, position, data0, user, data2) = Hashmap(userMgr_).get(_key);
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
        }

        address policies = address(0);
        (error, position, data0, policies, data2) = Hashmap(user).get("Policies");
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
        }       

        return  _getDetailInfo(policies);
    }

    function getAddr() external view _onlyOwner returns (address) {
        return templateAddr_;
    }
}
