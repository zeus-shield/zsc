/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_json.sol";
import "./object.sol";
import "./db_apis.sol";
import "./plat_string.sol";

contract AppController is DBApis {

	string public testResult = "";
	string requestInfo_;

    mapping (string => string) requestInfos_;

    function AppController(bytes32 _name) public DBApis(_name) {
    }
    
    /* examples
    _info = "{<operation><create>} {<object><provider>} {<node><provi-x>} "
    _info = "{<operation><set>} {<object><provider>} {<node><provi-x>} {<parameter><username>} {<value><zsc>} {<extra> <vaaaa>} "
    */
    function pushRequestInfo(string _info) public only_delegate returns (bool) {
    	requestInfo_ = _info;
        
        bool ret1;
        bool ret2;
        uint start = 0;
        uint end;

        string memory infoType;
        string memory infoValue;
        bool ret;

        while(true) {
            (ret1, start) = PlatString.findbyte(_info, bytes1("{"), start);
            (ret2, end) = PlatString.findbyte(_info, bytes1("{"), start);
            if (ret1 == false || ret2 == false) {
                break;
            }
            string memory singelInfo = PlatString.substring(_info, start + 1, end - 1);
            (ret, infoType, infoValue) = parserSingleInfo(singelInfo);
            if (ret == false) {
                return false;
            }
            requestInfos_[infoType] = infoValue;
            start = end;
        }

        conductRequest();
        return true;
    }

    //////////////////////
    //////////////////////
    //////////////////////
    function parserSingleInfo(string _info) internal pure returns (bool, string, string) {
        bool ret1;
        bool ret2;
        uint start = 0;
        uint end;
        string[2] memory substr;
       
        for (uint i = 0; i < 2; ++i) {
            (ret1, start) = PlatString.findbyte(_info, bytes1("<"), start);
            (ret2, end) = PlatString.findbyte(_info, bytes1(">"), start);
            if (ret1 == false || ret2 == false) {
                return (false, "", "");
            }
            substr[i] = PlatString.substring(_info, start + 1, end - 1);
            start = end;
        }
        return (true, substr[0], substr[1]);
    }

    function conductRequest() internal returns (bool, string) {
        bool ret = false;
        string memory str = ""; 

        string memory operation = (requestInfos_["operation"]);
        string memory object    = (requestInfos_["object"]);
        string memory node      = (requestInfos_["node"]);
        string memory parameter = (requestInfos_["parameter"]);
        string memory value     = (requestInfos_["value"]);
        string memory extra     = (requestInfos_["extra"]);

        if (PlatString.equalto(operation, "set")) {
            ret = setNodeParameterValue(node, parameter, value);
        } else if (PlatString.equalto(operation, "get")) {
            str = getNodeParameterValue(node, parameter);  
        } else if (PlatString.equalto(operation, "add")) {
            ret = addComponetToAgreement(node, extra);          
        } else if (PlatString.equalto(operation, "create")) {
            ret = createNode(object, node, extra);            
        } else if (PlatString.equalto(operation, "remove")) {
            ret = deleteNode(object, node);
        } else {
        }

        return (ret, str);
    }

    function createNode(string _object, string _name, string _extra) internal only_delegate returns (bool) {
        if (PlatString.equalto(_object, "agreement")) {
            return createAgreement(_name);
        } else if (PlatString.equalto(_object, "provider")) {
            return createProvider(_name);
        } else if (PlatString.equalto(_object, "receiver")) {
            return createReceiver(_name);
        } else if (PlatString.equalto(_object, "template")) {
            createTemplate(_name, _extra);
        } else if (PlatString.equalto(_object, "item")) {
            createItem(_name, _extra);
        }
        return true;
    }

    function deleteNode(string _object, string _name) internal only_delegate returns (bool) {
        if (PlatString.equalto(_object, "agreement")) {
            return false;
        } else if (PlatString.equalto(_object, "provider")) {
            return false;
        } else if (PlatString.equalto(_object, "receiver")) {
            return false;
        } else {
            deleteEntireNode(_name);
        }
    }
}
