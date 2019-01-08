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

contract InsuranceUserPolicy {
  function size() external view returns (uint);
  function removePolicies(string _key, bool _removePolicy) external;
}

contract InsuranceUser is Delegate {

    using LibString for *;
    using LibInt for *;

    address private userMgr_;
    address private templateAddr_;
    address private userPolicyAddr_;
    string[] private keys_;

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    modifier _checkUserPolicyAddr() {
        require(0 != userPolicyAddr_);
        _;
    }

    modifier _onlyAdminOrHigher() {
        require(checkDelegate(msg.sender, 2));
        _;
    }

    constructor() public {
        userMgr_ = new Hashmap();
        templateAddr_ = address(0);
        userPolicyAddr_ = address(0);
    }

    /** [desc] Destroy the contract.
      * [param] none.
      * [return] none.
      */
    function destroy() public _onlyOwner {
        Hashmap(userMgr_).kill();
        userMgr_ = address(0);
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

    /** [desc] Setup.
      * [param] _templateAddr: template contract address.
      * [param] _userPolicyAddr: user policy relationship contract address.
      * [return] none.
      */
    function setup(address _templateAddr, address _userPolicyAddr) external _onlyOwner {
        // check params
        require(address(0) != _templateAddr);
        require(address(0) != _userPolicyAddr);
        templateAddr_ = _templateAddr;
        userPolicyAddr_ = _userPolicyAddr;
    }

    /** [desc] User sign up.
      * [param] _templateKey: user template key.
      * [param] _data: json data.
      * [return] none.
      */
    function signUp(string _templateKey, string _data) external _onlyAdminOrHigher _checkTemplateAddr {
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
      * [param] _removeUserPolicies: the flag that remove user policies.
      * [return] none.
      */
    function remove(string _key, bool _removeUserPolicies) external _onlyAdminOrHigher _checkUserPolicyAddr {
        // check param
        require(0 != bytes(_key).length);

        if ((0 < InsuranceUserPolicy(userPolicyAddr_).size()) &&_removeUserPolicies) {
            InsuranceUserPolicy(userPolicyAddr_).removePolicies(_key, true);
        }

        Hashmap(userMgr_).remove(_key);
    }

    /** [desc] Get size of users.
      * [param] none.
      * [return] size of users.
      */
    function size() external view returns (uint) {
        return Hashmap(userMgr_).size();
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

    function getAddr() external view _onlyOwner returns (address, address) {
        return (templateAddr_, userPolicyAddr_);
    }
}
