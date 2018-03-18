/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";
import "./control_info.sol";

contract DBFactory is Object { 
    function getBindedDB() public only_delegate constant returns (address);
    function createNode(bytes32 _name) public returns (address);
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function addNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate returns (bool);
    function getNodeParameter(bytes32 _node, bytes32 _parameter) public only_delegate constant returns (string);
    function setNodeParameter(bytes32 _node, bytes32 _parameter, string _value, address _strRecorder) public only_delegate returns (bool);
    function numNodeParameters(bytes32 _node) public only_delegate constant returns (uint);
    function getNodeParameterNameByIndex(bytes32 _node, uint _index) public only_delegate constant returns (bytes32);
}

contract ControlBase is Object, ControlInfo {   
    mapping(uint => bytes32) private factoryTypes_;
    mapping(bytes32 => address) private factories_;

    modifier factroy_exist(bytes32 _name) {require(factories_[_name] != 0); _;}
    modifier factroy_notexist(bytes32 _name) {require(factories_[_name] == 0); _;}

    function ControlBase(bytes32 _name) public Object(_name) {
        factoryTypes_[1] = "provider";
        factoryTypes_[2] = "receiver";
        factoryTypes_[3] = "template";
        factoryTypes_[4] = "agreement";
    }

    function factoryType(uint _type) internal constant returns (bytes32) {
        return factoryTypes_[_type];
    }

    function addFactory(bytes32 _name, address _adr) internal factroy_notexist(_name) {
        require(_adr != 0);
        factories_[_name] = _adr;
        addLog("Added factory: ", 1, 0);
        addLog(PlatString.bytes32ToString(_name), 0, 1);
    }

    function getFactory(bytes32 _name) internal factroy_exist(_name) constant returns (DBFactory) {
        return DBFactory(factories_[_name]);
    }

    function getDatabase(bytes32 _factory) internal constant returns (address) {
        return getFactory(_factory).getBindedDB();
    }

    function createFactoryNode(bytes32 _factory, bytes32 _user, bytes32 _element) internal factroy_exist(_factory) returns (address) {
        address adr = 0;
        if (_factory == "provider" || _factory == "receiver") {
            adr = getFactory(_factory).createNode(_user);
        } else {
            if (_factory == "template") {
                adr = getFactory(_factory).createNode(_element);
                //address userNode = getFactory("factory").getNode(_user);
            }
        }

        if (adr != 0) {
            prepareNodeRecorder(_user, adr);
        }

        return adr;
    }

    function operateNodeParameter(bytes32 _factory, bytes32 _operation, bytes32 _node, bytes32 _parameter, string _value) internal returns (bool) {
        if (_operation == "add") {
            return getFactory(_factory).addNodeParameter(_node, _parameter);
        } else if (_operation == "set") {
            return getFactory(_factory).setNodeParameter(_node, _parameter, _value, this);
        }        
    }

    function duplicateNode(bytes32 _factorySrc, bytes32 _nodeSrc, bytes32 _factoryDst, bytes32 _nodeDst) internal factroy_exist(_factorySrc) factroy_exist(_factoryDst) returns (bool) {
        address nodeSrc = getFactory(_factorySrc).getNode(_nodeSrc);
        address nodeDst = getFactory(_factoryDst).getNode(_nodeDst);

        if (nodeSrc == address(0)) return false;
        if (nodeDst == address(0)) return false;
        
        bytes32 tempPara;
        string memory tempValue; 

        uint paraNos = getFactory(_factorySrc).numNodeParameters(_nodeSrc);
        for (uint i = 0; i < paraNos; ++i) {
            tempPara = getFactory(_factorySrc).getNodeParameterNameByIndex(_nodeSrc, i);
            tempValue = getControlBaseParameterValue(_nodeSrc, tempPara);

            getFactory(_factoryDst).addNodeParameter(_nodeDst, tempPara);
            getFactory(_factoryDst).setNodeParameter(_nodeDst, tempPara, tempValue, this);
        }
        return true;
    }
}
