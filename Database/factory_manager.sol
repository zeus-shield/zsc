/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./adr_manager.sol";

contract FactoryBase {
	function setDatabase(address _adr) public;
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
}

contract FactoryManager is AdrManager {
    constructor(bytes32 _name) public AdrManager(_name) {
    }

    function addAdr(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        require(systemGM_ != address(0));

        return super.addAdr(_name, _adr);
    }

    function removeAdr(bytes32 _name) public returns (bool) {
        checkDelegate(msg.sender, 1); 

        address factoryAdr = getAdr(_name);
        return super.removeAdr(_name);
    }

    function createFactoryNode(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) internal returns (address) {
        address dbAdr = getDatabase();
        address userAdr;
        address parentAdr;
        address ndAdr;

        if (_type == "template") {
            userAdr = DBDatabase(dbAdr).getNode(_userName);
            parentAdr = DBNode(userAdr).getHandler("template");
        } else if (_type == "agreement") {
            userAdr = DBDatabase(dbAdr).getNode(_userName);
            parentAdr = DBDatabase(dbAdr).getNode(_extra);
        }

        ndAdr = getAdr(_type).createNode(_nodeName, parentNode, _creator);
        require(adr != 0);

        if (_type == "provider" || _type == "receiver" || _type == "staker") {
            DBNode(adr).configureHandlers();
            DBNode(adr).setId(_creator);
            registerUserNode(_nodeName, adr, _creator);
        } else {
            registerEntityNode(_userName, _nodeName, adr, _creator);
        }

        /*if (_type == "staker") {
            PosManager(bindedPos_).registerStaker(adr);
        } else 
        */
        if (_type == "template") {
            DBNode(adr).setParameter("provider", PlatString.bytes32ToString(_userName));
        } else if (_type == "agreement") {
            duplicateNode(_userName, _extra,  _nodeName);
            DBNode(adr).setAgreementStatus("READY", "null");
        }
        return adr;
    }

}
