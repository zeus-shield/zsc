/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../common/hashmap.sol";

contract InsuranceTemplate {
    function getByName(bytes32 _name) external view returns (int, string);
}

contract InsuranceUser is Ownable {

    using LibString for *;

    address private userMgr_;
    address private templateAddr_;
    string[] private params_;

    modifier _checkTemplateAddr() {
        require(0 != templateAddr_);
        _;
    }

    constructor() public {
        userMgr_ = new Hashmap();
    }

    /** [desc] Kill the contract.
      * [param] none.
      * [return] none.
      */
    function kill() external _onlyOwner {
        Hashmap(userMgr_).kill();
        selfdestruct(owner_);   
    }

    /** [desc] Setup.
      * [param] _templateAddr: template contract address.
      * [return] none.
      */
    function setup(address _templateAddr) external _onlyOwner {
        // check template address
        require(0 != _templateAddr);
        templateAddr_ = _templateAddr;
    }

    /** [desc] This unnamed function is called whenever someone tries to send ether to it.
      * [param] none.
      * [return] none.
      */
    function() external payable { revert(); }

    /** [desc] User sign up.
      * [param] _data: json data.
      * [return] none.
      */
    function signUp(string _data) external _onlyOwner _checkTemplateAddr {
        // check param
        require(0 != bytes(_data).length);

        string memory template = "";
        int error = 0;
        (error, template) = InsuranceTemplate(templateAddr_).getByName("[DB]User");
        require(0 == error);
        template.split("#", params_);

        bytes32 userId = bytes32(0);
        address user = new Hashmap();

        for (uint i=0; i<params_.length; i++) { 
            if (_data.keyExists(params_[i])) {
                bytes32 param = params_[i].toBytes32();
                string memory value = _data.getStringValueByKey(params_[i]);
                Hashmap(user).set(param, bytes32(0), value, address(0));

                if (params_[i].equals("UserId")) {
                    userId = value.toBytes32();
                }
            }
        }

        Hashmap(userMgr_).set(userId, bytes32(0), "", user);
    }

    /** [desc] Get size of users.
      * [param] none.
      * [return] size of users.
      */
    function size() external view returns (uint) {
        return Hashmap(userMgr_).size();
    }

    /** [desc] Get user info.
      * [param] _userId: user id.
      * [return] error code and user info for json data.
      *           0: success
      *          -1: params error
      *          -2: no data
      *          -3: inner error   
      */
    function get(string _userId) external view _checkTemplateAddr returns (int, string) {
        int error = 0;
        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);
        bytes32 userId = _userId.toBytes32();

        (error, data0, data1, data2) = Hashmap(userMgr_).get(userId);
        if (0 != error) {
            return (error, "{}");
        }

        address user = data2;
        string memory str = "{";

        // string memory template = InsuranceTemplate(templateAddr_).get("[DB]User");
        // template.split("#", params_);
        // for (uint i=0; i<params_.length; i++) {
        //     (data0, data1, data2) = Hashmap(user).get(params_[i].toBytes32());
        //     if ((params_.length -1) == i) {
        //         str = str.concat(data1.toKeyValue(params_[i]));
        //     } else {
        //         str = str.concat(data1.toKeyValue(params_[i]), ",");
        //     }
        // }
        uint len = Hashmap(user).size();
        for (uint i=0; i<len; i++) {
            bytes32 param = bytes32(0);
            (error, param, data0, data1, data2) = Hashmap(user).get(i);
            if (0 == error) {
                if ((len -1) == i) {
                    str = str.concat(data1.toKeyValue(param.bytes32ToString()));
                } else {
                    str = str.concat(data1.toKeyValue(param.bytes32ToString()), ",");
                }
            }
        }       

        str = str.concat("}");

        return (0, str);
    }

    function getTemplateAddr() external view _onlyOwner returns (address) {
        return templateAddr_;
    }
}
