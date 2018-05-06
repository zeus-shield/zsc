/*
Copyright (c) 2018, ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./plat_string.sol";
import "./db_user.sol";
//import "./db_item.sol";
//import "./db_template.sol";

contract DBProvider is DBUser {
    address private templates_ = 0;

    // Constructor
    constructor(bytes32 _name) public DBUser(_name) {
        setNodeType("proiver"); 
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
    }

    function numTemplateChildren(uint _tmpIndex) internal constant returns (uint) {
        address tmpNode = DBNode(getHandler("template")).getChildByIndex(_tmpIndex);
        return DBNode(tmpNode).numChildren();
    }

    function getTemplateChildByIndex(uint _tmpIndex, uint _childIndex) internal constant returns (address) {
        address tmpNode = DBNode(getHandler("template")).getChildByIndex(_tmpIndex);
        return DBNode(tmpNode).getChildByIndex(_childIndex);
    }
    
    function addParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.addParameter(_parameter);
    }

    function removeParameter(bytes32 _parameter) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return false;
        return super.removeParameter(_parameter);
    }
    
    function numAgreements() public constant returns (uint) {
        checkDelegate(msg.sender, 1);

        uint agrNos = 0;
        address agrParentNode = getHandler("provider");
        uint tmpNos = DBNode(agrParentNode).numChildren();

        for (uint i = 0; i < tmpNos; ++i) {
            agrNos = agrNos.add(numTemplateChildren(i));
        }
        return agrNos;
    }

    function getAgreementByIndex(uint _index) public constant returns (address) {
        checkDelegate(msg.sender, 1);

        uint agrNos = 0;
        address agrParentNode = getHandler("provider");
        uint tmpNos = DBNode(agrParentNode).numChildren();
        address child;
        uint pos = 0;

        for (uint i = 0; i < tmpNos; ++i) {
            child = DBNode(agrParentNode).getChildByIndex(i);
            agrNos = DBNode(child).numChildren();
            for (uint j = 0; j < agrNos; ++j) {
                if (_index == pos) {
                    return getTemplateChildByIndex(i, j);
                } else {
                    pos++;
                }
            }
        }

        revert();
    }
}
