/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_group.sol";

contract FactoryBase {
	function setDatabase(address _adr) public;
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
}

contract SysGmFactory is SysComGroup {
    constructor(bytes32 _name) public SysComGroup(_name) {
    }

   /*
      internal functions
   */
    function duplicateNode(address _nodeSrcAdr, address _nodeDstAdr) internal returns (bool) {
        require(_nodeSrcAdr != address(0) && _nodeDstAdr != address(0));

        bytes32 tempPara;
        bytes32 tempValue; 

        uint paraNos = DBNode(nodeSrc).numParameters();
        for (uint i = 0; i < paraNos; ++i) {
            tempPara = DBNode(nodeSrc).getParameterNameByIndex(i);
            tempValue = DBNode(nodeSrc).getParameter(tempPara);

            DBNode(nodeDst).addParameter(tempPara);
            DBNode(nodeDst).setParameter(tempPara, tempValue);
        }
        return true;
    }

   /*
      public functions
   */
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

    function createFactoryNode(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) public returns (address) {
        checkDelegate(msg.sender, 1); 

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

        ndAdr = FactoryBase(getAdr(_type)).createNode(_nodeName, parentNode, _creator);
        require(ndAdr != 0);

        if (_type == "provider" || _type == "receiver" || _type == "staker") {
            DBNode(ndAdr).configureHandlers();
            DBNode(ndAdr).setId(_creator);
        } 

        /*if (_type == "staker") {
            PosManager(bindedPos_).registerStaker(adr);
        } else 
        */
        if (_type == "template") {
            DBNode(ndAdr).setParameter("provider", PlatString.bytes32ToString(_userName));
        } else if (_type == "agreement") {
            duplicateNode(DBDatabase(dbAdr).getNode(_extra),  ndAdr);
            DBNode(ndAdr).setAgreementStatus("READY", "null");
        }
        return adr;
    }
}
