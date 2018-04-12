/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./plat_string.sol";
import "./object.sol";
import "./control_info.sol";

contract DBFactory is Object { 
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
}

contract DBDatabase is Object { 
    function getNode(bytes32 _name) public only_delegate(1) constant returns (address);
    function checkeNodeByAddress(address _adr) public only_delegate(1) constant returns (bool);
    function numNodes() public only_delegate(1) constant returns (uint);
    function getNodeByIndex(uint _index) public only_delegate(1) constant returns (address);
}

contract DBNode is Object {
    function getId() public only_delegate(1) returns (address);
    function getNodeType() public only_delegate(1) constant returns (bytes32);
    function getBlance(bytes32 _name, address _adr) public only_delegate(1) constant returns (uint256);

    function setActivated(bool _activated) only_delegate(1) public;
    function getActivated() public only_delegate(1) constant returns (bool);

    function addParameter(bytes32 _parameter) public only_delegate(1) returns (bool);
    function removeParameter(bytes32 _parameter) public only_delegate(1) returns (bool);
    function setParameter(bytes32 _parameter, string _value) public only_delegate(1) returns (bool);
    function numParameters() public only_delegate(1) constant returns (uint);
    function getParameterNameByIndex(uint _index) public only_delegate(1) constant returns (bytes32);

    function executeEtherTransaction(address _dest, uint256 _value, bytes _data) public only_delegate(1) returns (bool);
    function executeERC20Transaction(address _tokenAdr, address _dest, uint256 _value, bytes _data) public only_delegate(1) returns (bool);
    function setERC20TokenAddress(address _tokenAdr) only_delegate(1) public;
    function getERC20TokenAddress() public only_delegate(1) constant returns (address);

    function bindEntity(address _adr) only_delegate(1) public;
    function numBindedEntities(bytes32 _type) public only_delegate(1) constant returns (uint);
    function getBindedEntityNameByIndex(bytes32 _type, uint _index) public only_delegate(1) constant returns (bytes32);

    function setAgreementStatus(bytes32 _tag) public only_delegate(1) returns (bool);
    function configureHandlers() public only_delegate(1) returns (bool);
    function getHandler(bytes32 _type) public only_delegate(1) returns (address);
}

contract PosManager is Object {
    function registerStaker(address _nodeAddress) only_delegate(1) public;
    function removeStaker(address _nodeAddress) only_delegate(1) public;
}

contract WalletManager is Object {
    function addErc20Token(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public only_delegate returns (bool);
    function removeErc20Token(bytes32 _symbol) public only_delegate returns (bool);
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
    address private bindedPos_;
    address private bindedWalletManager_;
    address private zscTokenAddress_;

    modifier factroy_exist(bytes32 _name) {require(factories_[_name] != 0); _;}
    modifier factroy_notexist(bytes32 _name) {require(factories_[_name] == 0); _;}

    function ControlBase(bytes32 _name) public Object(_name) {
        factoryTypes_[1] = "provider";
        factoryTypes_[2] = "receiver";
        factoryTypes_[3] = "template";
        factoryTypes_[4] = "agreement";
        factoryTypes_[5] = "wallet-eth";
        factoryTypes_[6] = "wallet-erc20";
    }

    function mapType(uint _type) internal constant returns (bytes32) { return factoryTypes_[_type]; }

    function setAdmAdr(address _adm) internal {
        require (_adm != 0);      
        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);

        addLog("setAdmAdr: ", true);
        //addLog(PlatString.bytes32ToString(Object(_adm).name()), false);
    }

    function setPosAdr(address _pos, address _zscToken) internal {
        require (_pos != 0);      
        bindedPos_ = _pos;
        zscTokenAddress_ = _zscToken;
        setDelegate(bindedPos_, 1);

        addLog("set Adm: ", true);
        //addLog(PlatString.bytes32ToString(Object(_adm).name()), false);
    }

    function setWalletMangerAdr(address _managerAdr) internal {
        require (_managerAdr != 0);      
        bindedWalletManager_ = _managerAdr;
        setDelegate(bindedWalletManager_, 1);

        addLog("set WalletManger: ", true);
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
    
    function enableWallet(bytes32 _type, bytes32 _user, bytes32 _tokeSymbol, address _creator) internal returns (address) {
        address adr;
        address parentNode = getDBNode(_user).getHandler("wallet");

        adr = getDBFactory(_type).createNode(_tokeSymbol, parentNode, _creator);
        require(adr != 0);
        registerNode(DBNode(adr).name(), adr, _creator);

        return adr;
    }

    function createFactoryNode(bytes32 _type, bytes32 _nodeName, bytes32 _extra, address _creator) internal returns (address) {
        address adr;
        address parentNode = address(0);

        if (_type == "template" || _type == "agreement") {
            parentNode = getDBNode(_extra).getHandler(_type);
        }

        adr = getDBFactory(_type).createNode(_nodeName, parentNode, _creator);
        require(adr != 0);
        registerNode(_nodeName, adr, _creator);

        if (_type == "provider" || _type == "receiver" || _type == "staker") {
            DBNode(adr).configureHandles();
        }

        if (_type == "staker") {
            DBNode(adr).setERC20TokenAddress(zscTokenAddress_);
            PosManager(bindedPos_).registerStaker(adr);
        } else if (_type == "agreement") {
            duplicateNode(_extra,  _nodeName);
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

    function registerTokenAwarder(address _token, bytes32 _name, bytes32 _symbol, uint _decimals) public only_delegate(1) returns (bool) {
        if (tokenAwarders_[_name].adr_ != 0) return false;
        
        tokenAwarders_[_name].adr_ = _token;
        tokenAwarders_[_name].name_ = _name;
        tokenAwarders_[_name].symbol_ = _symbol;
        tokenAwarders_[_name].decimals_ = _decimals;
        return true;
    }

    function manageErc20TokenContract(bool _doesAdd, bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) internal returns (bool) {
        if (_doesRegisterd) {
            return WalletManger(bindedWalletManager_).addErc20Token(_name, _symbol, _decimals, _tokenAdr);
        } else {
            return WalletManger(bindedWalletManager_).removeErc20Token(_symbol);
        }
    }
}
