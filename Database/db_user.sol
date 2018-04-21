/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";

contract DBUser is DBEntity {
    mapping(bytes32 => address) private handlers_;

    // Constructor
    function DBUser(bytes32 _name) public DBEntity(_name) {
    } 

    function configureSingleHandle(bytes32 _nameSuffix) private returns (address) {
        string memory str = PlatString.append(name(), _nameSuffix);
        address nd = new DBNode(PlatString.tobytes32(str));
        require(nd != 0);

        DBNode(nd).setDelegate(address(this), 1);
        DBNode(nd).setId(getId());
        super.addChild(nd);

        return nd;
    }

    function configureHandlers() public only_delegate(1) returns (bool) {
        bytes32 nodeType = getNodeType();
        if (nodeType == "provider") {
            handlers_["wallet"] = configureSingleHandle("-wallet");
            handlers_["template"] = configureSingleHandle("-tmp");
            handlers_["agreement"] = configureSingleHandle("-agree");
        }
    }

    function getHandler(bytes32 _type) public only_delegate(1) constant returns (address) {
        return handlers_[_type];
    }
}

