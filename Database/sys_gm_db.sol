/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./sys_com_group.sol";

contract SysGmDB is SysComGroup {
    constructor(bytes32 _name) public SysComGroup(_name) {
    }

   /*
      internal functions
   */
    function operateNodeParameter(bytes32 _operation, bytes32 _nodeName, bytes32 _parameter, string _value) internal returns (bool) {
        string memory str = ""; 
        str = PlatString.append(str, PlatString.bytes32ToString(_nodeName), " : " );
        str = PlatString.append(str, PlatString.bytes32ToString(_parameter), " : " , _value);
        if (_operation == "add") {
            str = PlatString.append("addNodeParameter - ", str);
            ret = DBNode(ndAdr).addParameter(_parameter);
        } else if (_operation == "set") {
            str = PlatString.append("setNodeParameter - ", str);
            ret = DBNode(ndAdr).setParameter(_parameter, _value);
        }        
        addLog(str, true);
        return ret;
    }

   /*
      public functions
   */
    function addAdr(bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        require(systemGM_ != address(0));
        
        return super.addAdr(_name, _adr);
    }

    function removeAdr(bytes32 _name) public returns (address) {
        checkDelegate(msg.sender, 1); 
        Object(adr).kill();

        return super.removeAdr(_name);
    }

    function addNodeParameter(bytes32 _dbName, bytes32 _nodeName, bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1); 

        setDatabase(_dbName);

        address dbAdr = getDatabase();
        address ndAdr = DBDatabase(dbAdr).getNode(_nodeName);

        return operateNodeParameter("add", _nodeName, _parameter, "null"); 
    }

    function setNodeParameterValue(bytes32 _dbName, bytes32 _nodeName, bytes32 _parameter, bytes32 _value) public returns (bool) {
        checkDelegate(msg.sender, 1); 
        setDatabase(_dbName);

        address dbAdr = getDatabase();
        address ndAdr = DBDatabase(dbAdr).getNode(_nodeName);

        return operateNodeParameter("set", _nodeName, _parameter, _value); 
    }

    function getNodeParameterValue(bytes32 _dbName, bytes32 _nodeName, bytes32 _parameter) public constant returns (bytes32) {
        checkDelegate(msg.sender, 1); 
        setDatabase(_dbName);

        address dbAdr = getDatabase();
        address ndAdr = DBDatabase(dbAdr).getNode(_nodeName);

        return DBNode(ndAdr).getParameter(_parameter);
    }
}

