/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.18;

import "./object.sol";
import "./db_node.sol";
import "./db_receiver.sol";
import "./db_provider.sol";
import "./db_idmanager.sol";


contract DBDatabase is Object {
    DBNode[] nodes_;
    mapping(bytes32 => DBNode) nodeMap_;

    DBReceiver[] receivers_;
    DBProvider[] providers_;

    mapping(bytes32 => uint) receiver_exist_;
    mapping(bytes32 => uint) provider_exist_;

    function DBDatabase(bytes32 _name) public Object(_name) {
    }


    function _addNode(DBNode _node) public only_delegate returns (bool) {
        bytes32 str = _node.name();
        if (nodeMap_[str] != DBNode(0)) {
            return false;
        } 

        nodes_.push(_node);
        nodeMap_[str] = _node;
        return true;
    }

    function insertReceiver(bytes32 _name) public only_delegate {
        if (receiver_exist_[_name] == 0) revert();
        uint id = receivers_.length;
        receiver_exist_[_name] = id;

        DBReceiver en = new DBReceiver(_name);
        en.setID(id);
        receivers_.push(en);
    }

    function insertProvider(bytes32 _name) public only_delegate {
        if (provider_exist_[_name] == 0) revert();
        uint id = providers_.length;
        provider_exist_[_name] = id;

        DBProvider en = new DBProvider(_name);
        en.setID(id);
        providers_.push(en);
    }
}
