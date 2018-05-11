/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./adr_manager.sol";

contract DBManager is AdrManager {
    constructor(bytes32 _name) public AdrManager(_name) {
    }
    
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

    function operateNodeParameter(bytes32 _operation, bytes32 _userName, bytes32 _node, bytes32 _parameter, string _value) internal returns (bool) {
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
}
