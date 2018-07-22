/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./control_base.sol";

contract ControlInsura is ControlBase {
    /// @dev Constructor
    /// @param _name The name of the controller
    function ControlInsura(bytes32 _name) public ControlBase(_name) {
    }

    function getBindedWalletAddress(bytes32 _enName) internal view returns (address) {
        bytes32 walletName;
        
        walletName = formatWalletName(_enName);
        return address(getDBNode(dbName_, walletName)); 
    }

    function createNodeForElement(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra) internal returns (address) {
        address ndAdr;
        address parentAdr;

        if (_type == "template") {
            parentAdr = address(getDBNode(dbName_, _userName));
        } else if (_type == "agreement") {
            parentAdr = address(getDBNode(dbName_, _extra));
        }

        ndAdr = getDBFactory(_type).createNode(_nodeName, parentAdr, 0x0);
        require(ndAdr != 0);

        if (_type == "template") {
            DBNode(ndAdr).setParameter("provider", _userName);
        } else if (_type == "agreement") {
            duplicateNode(getDBNode(dbName_, _extra),  ndAdr);
             uint lockedAmount;
             uint price;
             uint duration;
     
             lockedAmount = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(ndAdr).getParameter("insurance")));
             price        = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(ndAdr).getParameter("price")));
             duration     = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(ndAdr).getParameter("duration")));

             require(lockedAmount > 0 && price > 0 && duration >= 60);
        }
        return ndAdr;
    }

    /////////////////////////////
    
    function createElementNode(bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo) public returns (address) {
        bytes32 userName = checkAllowed(msg.sender, _enName);
        
        require(_factoryType == "template" || _factoryType == "agreement");
        require(address(getDBNode(dbName_, _enName)) == address(0));
        
        address ndAdr = createNodeForElement(_factoryType, userName, _enName, _extraInfo);
        require(ndAdr != address(0));
        registerEntityNode(msg.sender, _enName);
        
        return ndAdr;
    }

    //------2018-07-06: new verstion: YYA------ 
    function enableUserWallet() public returns (address) {
        bytes32 userName = checkAllowed(msg.sender, "null");
        address userAdr = address(getDBNode(dbName_, userName));
        require(userAdr != 0);

        bytes32 walletName = formatWalletName(userName);
        address walletAdr  = enableWallet(walletName, userAdr, msg.sender);
        require(walletAdr != 0);

        preallocateZSCToTester(walletAdr);

        return walletAdr;
    }

    /// @dev Create an user
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address) {
        checkDelegate(msg.sender, 1);     

        require(_factoryType == "staker" || _factoryType == "provider" || _factoryType == "receiver");
        require(address(getDBNode(dbName_, _userName)) == 0);

        address creator = _extraAdr;
        address parentAdr = getDBDatabase(dbName_).getRootNode();
        address ndAdr = getDBFactory(_factoryType).createNode(_userName, parentAdr, creator); 
        require(ndAdr != address(0));
        registerUserNode(creator, _userName, _factoryType);
        
        return ndAdr;
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

        bytes32 agrWalletName    = formatWalletName(_agrName);
        address agrWalletAdr     = enableWallet(agrWalletName, agrAdr, _creator);
        address userWallet       = getBindedWalletAddress(userName);
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

        address recWallet   = getBindedWalletAddress(userName); 
        address agrWallet   = getBindedWalletAddress(_agrName);
        address tokenContractAdr = getDBModule("gm-token").getTokenAddress("ZSC");

        uint ret = DBNode(recWallet).executeTransaction(tokenContractAdr, agrWallet, price);

        getDBNode(dbName_, _agrName).setAgreementStatus("PAID", userName);
        getDBNode(dbName_, userName).bindAgreement(agrAdr);

        bytes32 provider = DBNode(agrAdr).getParameter("provider");
        address proWallet = getBindedWalletAddress(provider);
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

        address proWallet = getBindedWalletAddress(provider);
        address recWallet = getBindedWalletAddress(receiver);
        address agrWallet = getBindedWalletAddress(receiver);
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
        address walletAdr = getBindedWalletAddress(userName);
        require(walletAdr != address(0));
        
        return DBNode(walletAdr).numTransactions();
    }
}
