/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_json.sol";
import "./object.sol";
import "./db_apis.sol";


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

    function setNodeParameter(bytes32 _nodeName, bytes32 _parameter, string _value) public only_delegate returns (bool) {
        if (apiController_.setNodeParameterValue(_nodeName, _parameter, "temp")) {
            nodeParameters_[_nodeName].values_[_parameter] = _value;
            return true;
        }
        return false;
    } 

    function getNodeParameter(bytes32 _nodeName, bytes32 _parameter) public only_delegate constant returns (string) {
        return nodeParameters_[_nodeName].values_[_parameter];
    } 

    function psushRequestInfo(string _info) public only_delegate {
    	requestInfo_ = _info;
    }
    
    function parserElements(string info, uint maxNos, uint index) internal only_delegate {
        string memory json = info; //'{"texture":"value", "id":"sss"}, {"texture":"aaa", "id":"ddd"}'
        PlatJson.Token[] memory temp;

        uint returnValue;
        uint actualNum;

        (returnValue, temp, actualNum) = PlatJson.parse(json, maxNos);

        PlatJson.Token memory t = temp[index];
        testResult = PlatJson.getBytes(json, t.start, t.end);
    }

}
