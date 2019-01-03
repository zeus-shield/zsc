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

contract InsuranceUser {
    function setPolicy(string _key, string _policyKey, address _policy) external;
    function getByKey(uint8 _type, string _key) external view returns (int, string);
}

contract InsurancePolicy is Ownable {

    using LibString for *;
    using LibInt for *;

    address private policyMgr_;
    address private templateAddr_;
    address private userAddr_;
    string[] private keys_;

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    modifier _checkUserAddr() {
        require(0 != userAddr_);
        _;
    }

    constructor() public {
        policyMgr_ = new Hashmap();
        templateAddr_ = address(0);
        userAddr_ = address(0);
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
      * [param] _addr: info address.
      * [return] error code and info for json data.
      */
    function _getDetailInfo(address _addr) private view returns (int, string) {
        string memory str = "{";

        uint len = Hashmap(_addr).size();
        str = str.concat(len.toKeyValue("Size"), ",");
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

    /** [desc] Get policy brief info.
      * [param] _key: policy key.
      * [param] _addr: info address.
      * [return] error code policy info for json data.
      */
    function _getBriefInfo(string _key, address _addr) private pure returns (int, string) {
        string memory str = "{";
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
      * [param] _userAddr: user contract address.
      * [return] none.
      */
    function setup(address _templateAddr, address _userAddr) external _onlyOwner {
        // check params
        require(0 != _templateAddr);
        require(0 != _userAddr);

        templateAddr_ = _templateAddr;
        userAddr_ = _userAddr;
    }

    /** [desc] Policy submit.
      * [param] _templateKey: template key.
      * [param] _data: json data.
      * [return] none.
      */
    // function submit(string _templateKey, string _data) external _onlyOwner _checkTemplateAddr _checkUserAddr {
    function submit(string _userKey, string _templateKey, string _data) external _checkTemplateAddr _checkUserAddr {
        // check param
        require(0 != bytes(_userKey).length);
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
                Hashmap(policy).set(keys_[i], 0, value, address(0), uint(0));
                
                if (keys_[i].equals("Key")) {
                    key = value;
                }

                valid = true;
            }
        }

        require(valid);

        Hashmap(policyMgr_).set(key, 1, "", policy, uint(0));

        InsuranceUser(userAddr_).setPolicy(_userKey, key, policy);
    }

    /** [desc] remove policy.
      * [param] _key: key of user.
      * [return] none.
      */
    // function remove(string _key) external _onlyOwner {
    function remove(string _key) external {
        // check param
        require(0 != bytes(_key).length);
        Hashmap(policyMgr_).remove(_key);
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
        uint8 position = 0;
        string memory data0 = "";
        address policy = address(0);
        uint data2 = uint(0);
        (error, position, data0, policy, data2) = Hashmap(policyMgr_).get(_key);
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
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
        address policy = address(0);
        uint data2 = uint(0);
        (error, key, position, data0, policy, data2) = Hashmap(policyMgr_).get(_id);
        if (0 != error) {
            return (error, "{}");
        }
        if (1 != position) {
            return (-2, "{}");
        }

        if (0 == _type) {
            return _getDetailInfo(policy);
        } else {
            return _getBriefInfo(key, policy);
        }
    }

    function getAddr() external view _onlyOwner returns (address, address) {
        return (templateAddr_, userAddr_);
    }
}
