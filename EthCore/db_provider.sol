/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./db_entity.sol";
//import "./db_item.sol";
//import "./db_template.sol";

contract DBProvider is DBEntity {
    address private templates_ = 0;

    // Constructor
    function DBProvider(bytes32 _name) public DBEntity(_name) {
        nodeType_ = "provider";
    }

    function initParameters() internal {
        addFundamentalParameter("assurerType");
        addFundamentalParameter("assurerName");
        addFundamentalParameter("principalFirstName");
        addFundamentalParameter("principalLastName");
        addFundamentalParameter("principalIdentific");
        addFundamentalParameter("principalPhone");
        addFundamentalParameter("principalEmail");
        addFundamentalParameter("principalNationality");
        addFundamentalParameter("companyName");
        addFundamentalParameter("companyId");
        addFundamentalParameter("companyNationality");
        addFundamentalParameter("companyPhone");
        addFundamentalParameter("companyEmail");
        addFundamentalParameter("claimEmail");
        addFundamentalParameter("claimPhone");

        setParameter("assurerType", "provider");
    }

    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }

    /*
    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.removeParameter(_parameter);
    }
    */
    
    function numTemplates() public view returns (uint) {
        checkDelegate(msg.sender, 1);

        uint nos = 0;
        uint total = numChildren();
        address child;

        for (uint i = 0; i < total;  ++i) {
            child = getChildByIndex(i);
            if (DBNode(child).getNodeType() == "template") nos++;
        }
        return nos;
    }

    function getTemplateByIndex(uint _index) public view returns (address) {
        checkDelegate(msg.sender, 1);

        uint total = numChildren();
        require(_index < total);

        uint pos = 0;
        address child;

        for (uint i = 0; i < total; ++i) {
            child = getChildByIndex(i);
            if (DBNode(child).getNodeType() == "template") {
                if (pos == _index) return child;
                else pos++;
            }
        }
        return address(0);
    }

    function numAgreements() public view returns (uint) {
        checkDelegate(msg.sender, 1);
        return 0;
    }

    function getAgreementByIndex(uint _index) public view returns (address) {
        checkDelegate(msg.sender, 1);
        return address(_index - _index);
    }
}
