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

contract InsuranceUser is Ownable {

    using LibString for *;

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

    /** [desc] Get user detail info.
      * [param] _user: user info address.
      * [return] user info for json data.
      */
    function _getUserDetailInfo(address _user) private view returns (string) {
        string memory str = "{";

        uint len = Hashmap(_user).size();
        for (uint i=0; i<len; i++) {
            int error = 0;
            string memory key = "";
            string memory value = "";
            address data1 = address(0);
            uint data2 = uint(0);
            (error, key, value, data1, data2) = Hashmap(_user).get(i);
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

    /** [desc] Get user brief info.
      * [param] _key: user key.
      * [param] _user: user info address.
      * [return] user info for json data.
      */
    function _getUserBriefInfo(string _key, address _user) private pure returns (string) {
        string memory str = "{";
        string memory user = "0x";

        user = user.concat(_user.addrToAsciiString());

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
        (error, template) = InsuranceTemplate(templateAddr_).getByKey("[DB]User");
        require(0 == error);
        template.split("#", keys_);

        bool valid = false;
        string memory key = "";
        address user = new Hashmap();

        for (uint i=0; i<keys_.length; i++) { 
            if (_data.keyExists(keys_[i])) {
                string memory value = _data.getStringValueByKey(keys_[i]);
                Hashmap(user).set(keys_[i], value, address(0), uint(0));
                
                if (keys_[i].equals("Key")) {
                    key = value;
                }

                valid = true;
            }
        }

        require(valid);

        Hashmap(userMgr_).set(key, "", user, uint(0));
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
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, data0, user, data2) = Hashmap(userMgr_).get(_key);
        if (0 != error) {
            return (error, "{}");
        }

        string memory str = "";
        if (0 == _type) {
            str = _getUserDetailInfo(user);
        } else {
            str = _getUserBriefInfo(_key, user);
        }

        return (0, str);
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
        string memory data0 = "";
        address user = address(0);
        uint data2 = uint(0);
        (error, key, data0, user, data2) = Hashmap(userMgr_).get(_id);
        if (0 != error) {
            return (error, "{}");
        }

        string memory str = "";

        if (0 == _type) {
            str = _getUserDetailInfo(user);
        } else {
            str = _getUserBriefInfo(key, user);
        }

        return (0, str);
    }

    function getTemplateAddr() external view _onlyOwner returns (address) {
        return templateAddr_;
    }
}
