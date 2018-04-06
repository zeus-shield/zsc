/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";
import "./control_info.sol";

contract DBFactory is Object { 
    function createNode(bytes32 _node) public returns (address);
}

contract DBDatabase is Object { 
    function getNode(bytes32 _name) public only_delegate constant returns (address);
    function checkeNodeByAddress(address _adr) public only_delegate constant returns (bool);
    function numNodes() public only_delegate constant returns (uint);
    function getNodeByIndex(uint _index) public only_delegate constant returns (address);
}

contract DBNode is Object {
    function getNodeType() public only_delegate constant returns (bytes32);
    function getBlance(bytes32 _name, address _adr) public only_delegate constant returns (uint256);

    function setActivated(bool _activated) only_delegate public;
    function getActivated() public only_delegate constant returns (bool);

    function addParameter(bytes32 _parameter) public only_delegate returns (bool);
    function removeParameter(bytes32 _parameter) public only_delegate returns (bool);
    function setParameter(bytes32 _parameter, string _value) public only_delegate returns (bool);
    function numParameters() public only_delegate constant returns (uint);
    function getParameterNameByIndex(uint _index) public only_delegate constant returns (bytes32);

    function executeEtherTransaction(address _dest, uint256 _value, bytes _data) public only_delegate returns (bool);
    function executeERC20Transaction(address _tokenAdr, address _dest, uint256 _value, bytes _data) public only_delegate returns (bool);

    function bindEntity(address _adr) only_delegate public;
    function numBindedEntities(bytes32 _type) public only_delegate constant returns (uint);
    function getBindedEntityNameByIndex(bytes32 _type, uint _index) public only_delegate constant returns (bytes32);

    function setAgreementStatus(bytes32 _tag) public only_delegate returns (bool);
}

contract ControlBase is Object, ControlInfo {   
    struct TokenAwarder {
        address adr_;
        bytes32 name_;
        bytes32 symbol_;
        uint decimals_;
    }
    mapping(bytes32 => TokenAwarder) private tokenAwarders_;
    mapping(uint => bytes32) private factoryTypes_;
    mapping(bytes32 => address) private factories_;
    address private bindedDB_;
    address private bindedAdm_;

    modifier factroy_exist(bytes32 _name) {require(factories_[_name] != 0); _;}
    modifier factroy_notexist(bytes32 _name) {require(factories_[_name] == 0); _;}

    function ControlBase(bytes32 _name) public Object(_name) {
        factoryTypes_[1] = "provider";
        factoryTypes_[2] = "receiver";
        factoryTypes_[3] = "template";
        factoryTypes_[4] = "agreement";
    }

    function mapType(uint _type) internal constant returns (bytes32) { return factoryTypes_[_type]; }

    function setAdmAdr(address _adm) internal {
        require (_adm != 0);      
        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, true);

        addLog("setAdmAdr: ", true);
        //addLog(PlatString.bytes32ToString(Object(_adm).name()), false);
    }

    function setDatabaseAdr(address _db) internal {
        bindedDB_ = _db;

        addLog("Added database: ", true);
        addLog(PlatString.bytes32ToString(Object(_db).name()), false);
    }

    function addFactoryAdr(bytes32 _name, address _adr) internal factroy_notexist(_name) {
        require(_adr != 0);
        factories_[_name] = _adr;

        addLog("Added factory: ", true);
        addLog(PlatString.bytes32ToString(_name), false);
    }

    function getDBFactory(bytes32 _name) internal factroy_exist(_name) constant returns (DBFactory) {
        return DBFactory(factories_[_name]);
    }

    function getDBDatabase() internal constant returns (DBDatabase) { 
        return DBDatabase(bindedDB_);
    }

    function getDBNode(bytes32 _node) internal constant returns (DBNode) {      
        return DBNode(getDBDatabase().getNode(_node));
    }

    function createFactoryNode(bytes32 _factory, bytes32 _nodeName, bytes32 extra, address _sender) internal returns (address) {
        if (_factory == "provider" || _factory == "receiver") {
            registerUser(_factory, _nodeName, _sender);
        } 

        bytes32 userName = getSenderNameByAddress(_sender);
        require(userName != 0x0);          
        
        address adr = getDBFactory(_factory).createNode(_nodeName);
        require(adr != 0);
        registerNode(_nodeName, adr, _sender);

        if (_factory == "template") {
            registerHolder(_nodeName, _sender);
            getDBNode(userName).bindEntity(adr);
        } else if (_factory == "agreement") {
            registerHolder(_nodeName, _sender);
            duplicateNode(extra,  _nodeName);
            getDBNode(extra).bindEntity(adr);
            DBNode(adr).setAgreementStatus("READY");
        }
        return adr;
    }

    function operateNodeParameter(bytes32 _operation, bytes32 _node, bytes32 _parameter, string _value) internal returns (bool) {
        bool ret;
        string memory str = ""; 
        str = PlatString.append(str, PlatString.bytes32ToString(_node), " : " );
        str = PlatString.append(str, PlatString.bytes32ToString(_parameter), " : " , _value);
        if (_operation == "add") {
            str = PlatString.append("addNodeParameter - ", str);
            ret = getDBNode(_node).addParameter(_parameter);
        } else if (_operation == "set") {
            str = PlatString.append("setNodeParameter - ", str);
            ret = getDBNode(_node).setParameter(_parameter, _value);
        }        
        addLog(str, true);
        return ret;
    }

    function duplicateNode(bytes32 _nodeSrc, bytes32 _nodeDst) internal returns (bool) {
        address nodeSrc = address(getDBNode( _nodeSrc));
        address nodeDst = address(getDBNode( _nodeDst));

        if (nodeSrc == address(0)) return false;
        if (nodeDst == address(0)) return false;
        
        bytes32 tempPara;
        string memory tempValue; 

        uint paraNos = DBNode(nodeSrc).numParameters();
        for (uint i = 0; i < paraNos; ++i) {
            tempPara = DBNode(nodeSrc).getParameterNameByIndex(i);
            tempValue = getControlInfoParameterValue(_nodeSrc, tempPara);

            DBNode(nodeDst).addParameter(tempPara);
            DBNode(nodeDst).setParameter(tempPara, tempValue);
        }
        return true;
    }

    function registerTokenAwarder(address _token, bytes32 _name, bytes32 _symbol, uint _decimals) public only_delegate returns (bool) {
        if (tokenAwarders_[_name].adr_ != 0) return false;
        
        tokenAwarders_[_name].adr_ = _token;
        tokenAwarders_[_name].name_ = _name;
        tokenAwarders_[_name].symbol_ = _symbol;
        tokenAwarders_[_name].decimals_ = _decimals;
        return true;
    }

}
