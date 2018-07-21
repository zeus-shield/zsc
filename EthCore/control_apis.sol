/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./control_base.sol";

contract ControlApis is ControlBase {
    /// @dev Constructor
    /// @param _name The name of the controller
    function ControlApis(bytes32 _name) public ControlBase(_name) {
    }
   
    /// @dev Get the number of elements of the database
    function numFactoryElements(bytes32 _factoryType) public view returns (uint) { 
        checkAllowed(msg.sender, "null");

        return getDBFactory(_factoryType).numFactoryNodes(); 
    }

    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getFactoryElementNameByIndex(bytes32 _factoryType, uint _index) public view returns (bytes32) { 
        checkAllowed(msg.sender, "null");

        return getDBFactory(_factoryType).getFactoryNodeNameByIndex(_index); 
    }

    /// @dev Check the element wheather or not existing
    /// @param _enName The name of the element to be checked
    function doesElementExist(bytes32 _enName) public view returns (bool) {
        bytes32 en = checkAllowed(msg.sender, _enName);
        address adr = address(getDBNode(dbName_, en));
        return (adr != address(0));
    }

    function createElementNode(bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo) public returns (address) {
        bytes32 userName = checkAllowed(msg.sender, _enName);
        
        require(_factoryType == "template" || _factoryType == "agreement");
        require(address(getDBNode(dbName_, _enName)) == address(0));
        
        address ndAdr = createNodeForElement(_factoryType, userName, _enName, _extraInfo);
        require(ndAdr != address(0));
        registerEntityNode(msg.sender, _enName);
        
        return ndAdr;
    }

    /// @dev Get the type of an element
    /// @param _enName The name of the element belonging to the user
    function getElementType(bytes32 _enName) public view returns (bytes32) {
        bytes32 en = checkAllowed(msg.sender, _enName);

        DBNode nd = getDBNode(dbName_, en);
        require(address(nd) != address(0));
        return nd.getNodeType();
    }


    /// @dev Get the address of the element 
    /// @param _enName The name of the element
    function getElementAddress(bytes32 _enName) public view returns (address) {
        bytes32 en = checkAllowed(msg.sender, _enName);

        return address(getDBNode(dbName_, en));
    }

    function getUserName() public view returns (bytes32) {
        return checkAllowed(msg.sender, "null");
    } 

    function numElementChildren(bytes32 _enName) public view returns (uint) {
        bytes32 en = checkAllowed(msg.sender, _enName);
        return  getDBNode(dbName_, en).numChildren();
    }

    function getElementChildNameByIndex(bytes32 _enName, uint _index) public view returns (bytes32) {
        bytes32 en = checkAllowed(msg.sender, _enName);
        address adr = getDBNode(dbName_, en).getChildByIndex(_index);
        return Object(adr).name();
    }

    function numTemplates() public view returns (uint) {
        bytes32 en = checkAllowed(msg.sender, "null");
        return getDBNode(dbName_, en).numTemplates();
    }

    function getTemplateNameByIndex(uint _index) public view returns (bytes32) {
        bytes32 en = checkAllowed(msg.sender, "null");
        address adr = getDBNode(dbName_, en).getTemplateByIndex(_index);
        return Object(adr).name();
    }

    function numAgreements() public view returns (uint) {
        bytes32 en = checkAllowed(msg.sender, "null");
        return getDBNode(dbName_, en).numAgreements();
    }

    function getAgreementNameByIndex(uint _index) public view returns (bytes32) {
        bytes32 en = checkAllowed(msg.sender, "null");
        address adr = getDBNode(dbName_, en).getAgreementByIndex(_index);
        return Object(adr).name();
    }


    function publishAgreement(bytes32 _agrName) public {
        bytes32 userName = checkAllowed(msg.sender, "null");

        address _creator = msg.sender;
        address agrAdr = address(getDBNode(dbName_, _agrName));
        require(agrAdr != 0);

        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "CREATED");

        address agrWalletAdr     = enableWallet(_agrName, agrAdr, _creator);
        address userWallet       = getWalletAddress(userName);
        address tokenContractAdr = getDBModule("gm-token").getTokenAddress("ZSC");

        uint lockedAmount = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("insurance")));

        DBNode(userWallet).executeTransaction(tokenContractAdr, agrWalletAdr, lockedAmount.mul(1 ether));

        DBNode(agrAdr).setAgreementStatus("PUBLISHED", "null");
    }

    function purchaseAgreement(bytes32 _agrName) public returns (uint) {
        bytes32 userName = checkAllowed(msg.sender, "null");

        bytes32 userType = getDBNode(dbName_, userName).getNodeType();
        require(userType == "receiver");

        address agrAdr = address(getDBNode(dbName_, _agrName));
        require(agrAdr != address(0));

        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "PUBLISHED");

        uint price     = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price")));
        require(price > 0);
        price = price.mul(1 ether);

        address recWallet   = getWalletAddress(userName); 
        address agrWallet   = getWalletAddress(_agrName);
        address tokenContractAdr = getDBModule("gm-token").getTokenAddress("ZSC");

        uint ret = DBNode(recWallet).executeTransaction(tokenContractAdr, agrWallet, price);

        getDBNode(dbName_, _agrName).setAgreementStatus("PAID", userName);
        getDBNode(dbName_, userName).bindAgreement(agrAdr);

        bytes32 provider = DBNode(agrAdr).getParameter("provider");
        address proWallet = getWalletAddress(provider);
        DBNode(recWallet).executeTransaction(tokenContractAdr, proWallet, price);
        
        return ret;
    }

    function claimInsurance(bytes32 _agrName) public returns (bool) {
        bytes32 userName = checkAllowed(msg.sender, "null");

        bytes32 agrName = _agrName;
        address agrAdr  = address(getDBNode(dbName_, agrName));
        bytes32 status  = DBNode(agrAdr).getParameter("status");
        require(status == "PAID");

        bytes32 provider = DBNode(agrAdr).getParameter("provider");
        bytes32 receiver = DBNode(agrAdr).getParameter("receiver");
        require(userName == provider || userName == receiver);

        address proWallet = getWalletAddress(provider);
        address recWallet = getWalletAddress(receiver);
        address agrWallet = getWalletAddress(receiver);
        address tokenContractAdr = getDBModule("gm-token").getTokenAddress("ZSC");

        uint lockedAmount;
        uint price;

        lockedAmount = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("insurance")));
        lockedAmount = lockedAmount.mul(1 ether);

        price = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price")));
        price = price.mul(1 ether);

        uint ret = DBNode(agrAdr).simulatePayforInsurance();

        if (ret == 0) {
            return false;
        } else if (ret == 1) {
            //Insurance to receiver
            DBNode(agrWallet).executeTransaction(tokenContractAdr, recWallet, lockedAmount);
        } else if (ret == 2) {
            //Paid to provider
            DBNode(agrWallet).executeTransaction(tokenContractAdr, proWallet, lockedAmount);
        }
        return true;
    }
    
    function numUserTransactions() public view returns (uint) {
        bytes32 userName = checkAllowed(msg.sender, "null");
        address walletAdr = getWalletAddress(userName);
        require(walletAdr != address(0));
        
        return DBNode(walletAdr).numTransactions();
    }
}
