/*
Copyright (c) 2018 ZSC Dev.
*/

pragma solidity ^0.4.18;

import "./db_entity.sol";

contract DBUser is DBEntity {
    address private walletHandle_ = 0;
    address private templateHandle_ = 0;
    address private agreementHandle_ = 0;

    // Constructor
    function DBUser(bytes32 _name) public DBEntity(_name) {
    } 

    function configureSingleHandle(bytes32 _nameSuffix) private returns (address) {
        string memory str = PlatString.append(name(), _nameSuffix);
        address nd = new DBNode(PlatString.tobytes32(str));
        require(nd != 0);

        DBNode(nd).setDelegate(address(this), 1);
        DBNode(nd).setId(getId());
        addChild(nd);

        return nd;
    }

    function configureHandles() public only_delegate(1) returns (bool) {
        require (walletHandle_ == 0 && templateHandle_ == 0 && agreementHandle_ == 0);
        walletHandle_ = configureSingleHandle("-wallet");
        templateHandle_ = configureSingleHandle("-tmp");
        agreementHandle_ = configureSingleHandle("-agree");
    }
}

