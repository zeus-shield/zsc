/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";

contract DBUser is DBEntity {
    mapping(bytes32 => address) private handlers_;

    // Constructor
    constructor(bytes32 _name) public DBEntity(_name) {
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

    function configureHandlers() public returns (bool) {
        checkDelegate(msg.sender, 1);
        
        bytes32 nodeType = getNodeType();
        handlers_["wallet"] = configureSingleHandle("-wallet");
    
        if (nodeType == "provider") {
            handlers_["template"] = configureSingleHandle("-tmp");
        }
    }

    function getHandler(bytes32 _type) public constant returns (address) {
        checkDelegate(msg.sender, 1);
        return handlers_[_type];
    }

    function numAgreements() public constant returns (uint);

    function getAgreementByIndex(uint _index) public constant returns (address);
}

