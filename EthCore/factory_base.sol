/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract FactoryBase is Object {
	address bindedDB_;
	address controlApi_;

    uint private factoryNodeNos_ = 0;
    mapping(uint => bytes32) private factoryNodes_;
    mapping(bytes32 => address) private nodeAdrs_;

    function FactoryBase(bytes32 _name) public Object(_name) {
    }

    function addFactoryNode(bytes32 _nodeName, address _adr) internal {
        factoryNodes_[factoryNodeNos_] = _nodeName;
        nodeAdrs_[_nodeName] = _adr;
        factoryNodeNos_++;
    }

    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);

    function deleteFactoryNode(bytes32 _nodeName) public {
        checkDelegate(msg.sender, 1);
        uint index = 0;

        for (uint i = 0; i < factoryNodeNos_; ++i) {
            if (factoryNodes_[i] == _nodeName) {
                index = i;
                break;
            }
        }

        factoryNodes_[index] = factoryNodes_[factoryNodeNos_ - 1];
        delete factoryNodes_[factoryNodeNos_ - 1];
        factoryNodeNos_--;
    }

    function numFactoryNodes() public constant returns (uint) {
        checkDelegate(msg.sender, 1);
        return factoryNodeNos_;
    }

    function getFactoryNodeNameByIndex(uint _index) public constant returns (bytes32) {
        checkDelegate(msg.sender, 1);
        require(_index < factoryNodeNos_);
        return factoryNodes_[_index];
    }

    function setDatabase(address _adr) public {        
        checkDelegate(msg.sender, 1);

        require(bindedDB_ == address(0));
        bindedDB_ = _adr;
    } 

    function getDatabase() public constant returns (address) { 
        checkDelegate(msg.sender, 1);

        require(bindedDB_ != address(0));
        return bindedDB_;
    }

    function initFactory(address _controlApi) public {
        checkDelegate(msg.sender, 1);
        require(_controlApi != 0);

        addLog("initFactory", true);

        if (controlApi_ != _controlApi) {
            if (controlApi_ == 0) {
                setDelegate(controlApi_, 0);
            }
            setDelegate(_controlApi, 1);
            controlApi_ = _controlApi;
        }
    }
}


