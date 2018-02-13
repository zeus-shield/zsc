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
    mapping(bytes32 => address) nodeMap_;

    DBReceiver[] receivers_;
    DBProvider[] providers_;

    mapping(bytes32 => uint) receiver_exist_;
    mapping(bytes32 => uint) provider_exist_;

    function DBDatabase(bytes32 _name) public Object(_name) {
    }

    function _addNode(DBDatabase _database, DBNode _node) public returns (bool) {
        require(_database == this);
        require(nodeMap_[_node.getParent().name()] == msg.sender);

        bytes32 str = _node.name();
        address adr = address(_node);
        if (nodeMap_[str] != 0) {
            return false;
        } 

        nodes_.push(_node);
        nodeMap_[str] = adr;
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
