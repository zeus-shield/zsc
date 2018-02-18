/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_json.sol";
import "./object.sol";
import "./db_apis.sol";
import "./plat_string.sol";


contract AppController is Object {
	enum InfoType {UNDEFINED, INFO_INT, INFO_BYTE32, INFO_STRING}

	string public testResult = "";
	string requestInfo_;

    DBApis apiController_;

    struct ParameterValue {    
        mapping (bytes32 => string) values_;
    }
    
    mapping (bytes32 => ParameterValue) nodeParameters_;
    

    function AppController(bytes32 _name) public Object(_name) {
        apiController_ = new DBApis("zsc_db");
    }

    function setNodeParameter(bytes32 _nodeName, bytes32 _parameter, string _value) internal only_delegate returns (bool) {
        if (apiController_.setNodeParameterValue(_nodeName, _parameter, "temp")) {
            nodeParameters_[_nodeName].values_[_parameter] = _value;
            return true;
        }
        return false;
    } 

    function getNodeParameter(bytes32 _nodeName, bytes32 _parameter) internal only_delegate constant returns (string) {
        if (apiController_.getNodeParameterValue(_nodeName, _parameter) != "temp") {
            return "null";
        }
        return nodeParameters_[_nodeName].values_[_parameter];
    } 

    function psushRequestInfo(string _info) public only_delegate returns (bool) {
    	requestInfo_ = _info;
        
        bool ret1;
        bool ret2;
        uint start = 0;
        uint end;

        while(true) {
            (ret1, start) = PlatString.findbyte(_info, bytes1("{"), start);
            (ret2, end) = PlatString.findbyte(_info, bytes1("{"), start);
            if (ret1 == false || ret2 == false) {
                break;
            }
            string memory singelInfo = PlatString.substring(_info, start + 1, end - 1);

            if (parserSingleRequest(singelInfo) == false) {
                return false;
            }
            start = end;
        }
        return true;
    }

    function parserSingleRequest(string _info) internal returns (bool) {
        bool ret1;
        bool ret2;
        uint start = 0;
        uint end;
        string[3] memory substr;
       
        for (uint i = 0; i < 3; ++i) {
            (ret1, start) = PlatString.findbyte(_info, bytes1("<"), start);
            (ret2, end) = PlatString.findbyte(_info, bytes1(">"), start);
            if (ret1 == false || ret2 == false) {
                return false;
            }
            substr[i] = PlatString.substring(_info, start + 1, end - 1);
            start = end;
        }

        setNodeParameter(PlatString.toBytes32(substr[0], 0), PlatString.toBytes32(substr[1], 0), substr[2]);
        return true;
    }
}
