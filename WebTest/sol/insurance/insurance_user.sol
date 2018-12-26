/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

pragma solidity ^0.4.25;
// pragma experimental ABIEncoderV2;

import "../utillib/LibString.sol";
import "../common/hashmap.sol";

contract InsuranceTemplate {
    function getByName(bytes32 _name) external view returns (string);
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

        bytes32 userId = bytes32(0);
        bytes32 param = bytes32(0);
        string memory value = "";

        address user = new Hashmap();

        string memory template = InsuranceTemplate(templateAddr_).getByName("[DB]User");
        template.split("#", params_);
        for (uint i=0; i<params_.length; i++) { 
            if (_data.keyExists(params_[i])) {
                param = params_[i].toBytes32();
                value = _data.getStringValueByKey(params_[i]);
                Hashmap(user).set(param, bytes32(0), value, address(0));

                if (params_[i].equals("UserId")) {
                    userId = value.toBytes32();
                }
            }
        }

        Hashmap(userMgr_).set(userId, bytes32(0), "", user);
        log2(userId, bytes32(user), bytes32(0));

        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);
        bytes32 key = bytes32(0);

        (key, data0, data1, data2) = Hashmap(userMgr_).get(uint(0));
        log2(key, bytes32(data2), data0);

    }

    /** [desc] Get user info.
      * [param] _userId: user id.
      * [return] user info for json data.
      */
    function get(bytes32 _userId) external _checkTemplateAddr returns (string) {
        // check param
        require(bytes32(0) != _userId);

        string memory str = "{";

        bytes32 data0 = bytes32(0);
        string memory data1 = "";
        address data2 = address(0);
        bytes32 key = bytes32(0);
        
        (data0, data1, data2) = Hashmap(userMgr_).get(_userId);

        address user = data2;
 
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
        uint size = Hashmap(user).size();
        for (uint i=0; i<size; i++) {
            bytes32 param = bytes32(0);
            (param, data0, data1, data2) = Hashmap(user).get(i);
            if ((size -1) == i) {
                str = str.concat(data1.toKeyValue(param.bytes32ToString()));
            } else {
                str = str.concat(data1.toKeyValue(param.bytes32ToString()), ",");
            }
        }       

        str = str.concat("}");

        return str;
    }

    function getTemplateAddr() external view _onlyOwner returns (address) {
        return templateAddr_;
    }
}
