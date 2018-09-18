/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract ControlApis {
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address);
    function setUserStatus(address _user, bool _tagg) public returns (bool);
    function getModuleAdress(bytes32 _name) public view returns (address);
}

contract AdmBase is Object {
    address public controlApisAdr_;
    string public controlApisFullAib_;

    function AdmBase(bytes32 _name) public Object(_name) {
    }

    function activeByUser(string _type) public;

    function initAdm(address _controlApisAdr) public { 
        checkDelegate(msg.sender, 1);
        controlApisAdr_ = _controlApisAdr;
    }

    function setControlApisFullAbi(string _fullAbi) public { 
        checkDelegate(msg.sender, 1);
        controlApisFullAib_ = _fullAbi; 
    }

    function getControlApisFullAbi() public view returns (string) {
        return controlApisFullAib_;
    }

    function getControlApisAdrs() public view returns (string) {
        address Erc721Adr = ControlApis(controlApisAdr_).getModuleAdress("gm-pos");
        string memory str ="info?";
        str = PlatString.append(str, "sysAdr=",    PlatString.addressToString(controlApisAdr_),  "&");
        str = PlatString.append(str, "erc721Adr=", PlatString.addressToString(Erc721Adr),        "&");
        str = PlatString.append(str, "end");
        return str;
    }
}
