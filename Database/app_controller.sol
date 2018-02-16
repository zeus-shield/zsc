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

    function AppController(bytes32 _name) public Object(_name) {
        apiController_ = new DBApis("zsc_db");
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
