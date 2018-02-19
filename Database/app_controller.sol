/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_json.sol";
import "./object.sol";
import "./db_apis.sol";
import "./plat_string.sol";

contract AppController is Object {

	string public testResult = "";
	string requestInfo_;

    DBApis apiController_;

    struct ParameterValue {mapping (bytes32 => string) values_; }
    mapping (bytes32 => ParameterValue) nodeParameters_;
    mapping (string => string) requestInfos_;

    function AppController(bytes32 _name) public Object(_name) {
        apiController_ = new DBApis("zsc_db");
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
            ret = setNodeParameter(node, parameter, value);
        } else if (PlatString.equalto(operation, "get")) {
            (ret, str) = getNodeParameter(node, parameter);            
        } else if (PlatString.equalto(operation, "create")) {
            ret = createNode(object, node, extra);            
        } else if (PlatString.equalto(operation, "remove")) {
            ret = deleteNode(object, node);
        } else {
        }

        return (ret, str);
    }

    //////////////////////
    //////////////////////
    //////////////////////
    function setNodeParameter(string _nodeName, string _parameter, string _value) internal only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_nodeName);
        bytes32 parameter = PlatString.tobytes32(_parameter);

        if (apiController_.setNodeParameterValue(name, parameter, "temp")) {
            nodeParameters_[name].values_[parameter] = _value;
            return true;
        }
        return false;
    } 

    function getNodeParameter(string _nodeName, string _parameter) internal only_delegate constant returns (bool, string) {
        bytes32 name = PlatString.tobytes32(_nodeName);
        bytes32 parameter = PlatString.tobytes32(_parameter);

        if (apiController_.getNodeParameterValue(name, parameter) != "temp") {
            return (false, "");
        }
        return (true, nodeParameters_[name].values_[parameter]);
    } 

    function createNode(string _object, string _name, string _extra) internal only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_name);
        bytes32 extra = PlatString.tobytes32(_extra);

        if (PlatString.equalto(_object, "agreement")) {
            return apiController_.createAgreement(name);
        } else if (PlatString.equalto(_object, "provider")) {
            return apiController_.createProvider(name);
        } else if (PlatString.equalto(_object, "receiver")) {
            return apiController_.createReceiver(name);
        } else if (PlatString.equalto(_object, "template")) {
            apiController_.createTemplate(name, extra);
        } else if (PlatString.equalto(_object, "item")) {
            apiController_.createItem(name, extra);
        }
        return true;
    }

    function deleteNode(string _object, string _name) internal only_delegate returns (bool) {
        bytes32 name = PlatString.tobytes32(_name);
        if (PlatString.equalto(_object, "agreement")) {
            return false;
        } else if (PlatString.equalto(_object, "provider")) {
            return false;
        } else if (PlatString.equalto(_object, "receiver")) {
            return false;
        } else {
            apiController_.deleteEntireNode(name);
        }
    }
}
