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

    function setUserStatus(bytes32 _user, bool _tag) public returns (bool);
    function getUserStatus(bytes32 _user) public constant returns (bool);

    function setPreallocateAmountToTester(uint _allocatedETH, uint _allocatedZSC) public { 
        checkDelegate(msg.sender, 1);
        allocatedETH_ = _allocatedETH.mul(1 ether);
        allocatedZSC_ = _allocatedZSC.mul(1 ether);
    }

    /// @dev Set the zsc adm address
    /// @param _adm The address of the zsc adm 
    function initControlApis(address _adm) public {
        checkDelegate(msg.sender, 1);
        initControlApisAdrs(_adm);
    }

    function addSystemComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        require(_adr != address(0));
        return addComponent(_type, _name, _adr);
    }
   
    /// @dev Get the number of elements of the database
    function numFactoryElements(bytes32 _userName, bytes32 _factoryType) public constant returns (uint) { 
        checkRegistered(_userName, msg.sender);

        return getDBFactory(_factoryType).numFactoryNodes(); 
    }

    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getFactoryElementNameByIndex(bytes32 _userName, bytes32 _factoryType, uint _index) public constant returns (bytes32) { 
        checkRegistered(_userName, msg.sender);

        return getDBFactory(_factoryType).getFactoryNodeNameByIndex(_index); 
    }

    /// @dev Check the element wheather or not existing
    /// @param _enName The name of the element to be checked
    function doesElementExist(bytes32 _userName, bytes32 _enName) public constant returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        address adr = address(getDBNode(getCurrentDBName(), _enName));
        return (adr != address(0));
    }

    /// @dev Creat an element
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address) {
        checkDelegate(msg.sender, 1);

        require(_factoryType == "staker" || _factoryType == "provider" || _factoryType == "receiver");
        require(address(getDBNode(getCurrentDBName(), _userName)) == 0);

        address ndAdr = createNodeForUser(_factoryType, _userName, _extraAdr);
        require(ndAdr != address(0));
        registerUserNode(_userName, ndAdr, _extraAdr);
        
        return ndAdr;
    }

    function createElementNode(bytes32 _factoryType, bytes32 _userName, bytes32 _enName, bytes32 _extraInfo) public returns (address) {
        checkRegistered(_userName, msg.sender);

        require(_factoryType == "template" || _factoryType == "agreement");
        require(address(getDBNode(getCurrentDBName(), _enName)) == address(0));
        
        address ndAdr = createNodeForElement(_factoryType, _userName, _enName, _extraInfo);
        require(ndAdr != address(0));
        registerEntityNode(_userName, _enName, ndAdr, msg.sender);
        
        return ndAdr;
    }

    function enableUserWallet(bytes32 _userName) public returns (address) {
        checkRegistered(_userName, msg.sender);

        require(address(getDBNode(getCurrentDBName(), _userName)) != 0);
        require(getWalletAddress(_userName, "ZSC") == address(0));

        address walletAdr = enableWallet(_userName, userAdr, userAdr);
        require(walletAdr != 0);
        preallocateZSCToTester(walletAdr);

        return walletAdr;
    }

    /// @dev Get the type of an element
    /// @param _enName The name of the element belonging to the user
    function getElementType(bytes32 _userName, bytes32 _enName) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        DBNode nd = getDBNode(getCurrentDBName(), _enName);
        require(address(nd) != address(0));
        return nd.getNodeType();
    }

    /// @dev Add a paramter to an element
    /// @param _enName The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return getDBNode(getCurrentDBName(), _enName).addParameter(_parameter);
    }

    /// @dev Get the value of a paramter of an element
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        bytes32 ndType = getDBNode(getCurrentDBName(), _enName).getNodeType();
        if (ndType != "agreement") {
            //checkMatched(_userName, _enName, msg.sender);
        }
        return getDBNode(getCurrentDBName(), _enName).getParameter(_parameter);
    }

    /// @dev Get the address of the element 
    /// @param _enName The name of the element
    function getElementAddress(bytes32 _userName, bytes32 _enName) public constant returns (address) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return address(getDBNode(getCurrentDBName(), _enName));
    }

    //Disabled during alpha-test
    /// @dev Get the eth balance of the element
    /// @param _enName The name of the element
    function getElementBalance(bytes32 _userName, bytes32 _enName, bytes32 _symbol) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        bytes32 ndType = getDBNode(getCurrentDBName(), _enName).getNodeType();
        if (ndType != "agreement") {
            checkMatched(_userName, _enName, msg.sender);
        }
        address walletAdr = getWalletAddress(_enName);

        return DBNode(walletAdr).getBlance().div(1 ether);
    }

    /// @dev Get the number of paramters of an element
    /// @param _enName The name of the existing element
    function numElementParameters(bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        bytes32 ndType = getDBNode(getCurrentDBName(), _enName).getNodeType();
        if (ndType != "agreement") {
            checkMatched(_userName, _enName, msg.sender);
        }

        return  getDBNode(getCurrentDBName(), _enName).numParameters();
    }

    /// @dev Get the number of paramters of an element
    /// @param _enName The name of the existing element
    /// @param _index The index of the parameter
    /* Example:
        var num = numNodeParameters("test");
        if (num > 0) {
            var para = getNodeParameterNameByIndex("test", 0);
        }
    */
    function getElementParameterNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        bytes32 ndType = getDBNode(getCurrentDBName(), _enName).getNodeType();
        if (ndType != "agreement") {
            checkMatched(_userName, _enName, msg.sender);
        }

        return getDBNode(getCurrentDBName(), _enName).getParameterNameByIndex(_index);
    }

    /// @dev Transfer a particular amount from a user wallet to the destination address
    /// @param _dest The destination address
    /// @param _amount The amount to be transferred
    function submitTransfer(bytes32 _userName, bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint) {
        require(_amount > 0);
        checkRegistered(_userName, msg.sender);

        bytes32 walletName = formatWalletName(_userName, _tokenSymbol);
        address walletAdr = address(getDBNode(getCurrentDBName(), walletName));

        require(walletAdr != address(0));

        uint amount = DBNode(walletAdr).executeTransaction(getZSCTokenAddress(), _dest, _amount);
        return amount;
    }

    /// @dev Announce an insurance agreement by a provider
    function publishAgreement(bytes32 _userName, bytes32 _agrName) public {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _agrName, msg.sender);

        publishZSCAgreement(_userName, _agrName, msg.sender);
    }

    function numElementChildren(bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);
        return  getDBNode(getCurrentDBName(), _enName).numChildren();
    }

    function getElementChildNameByIndex(bytes32 _userName, bytes32 _enName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);
        address adr = getDBNode(getCurrentDBName(), _enName).getChildByIndex(_index);
        return Object(adr).name();
    }

    function numTemplates(bytes32 _userName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        return getDBNode(getCurrentDBName(), _userName).numTemplates();
    }

    function getTemplateNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        address adr = getDBNode(getCurrentDBName(), _userName).getTemplateByIndex(_index);
        return Object(adr).name();
    }

    function numAgreements(bytes32 _userName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        return getDBNode(getCurrentDBName(), _userName).numAgreements();
    }

    function getAgreementNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        address adr = getDBNode(getCurrentDBName(), _userName).getAgreementByIndex(_index);
        return Object(adr).name();
    }

    //Disabled during alpha-test
    /*
    function deleteAgreementByIndex(bytes32 _userName, uint _index) public returns (bool) {
        checkRegistered(_userName, msg.sender);

        address adr = getDBNode(getCurrentDBName(), _userName).getAgreementByIndex(_index);
        return deleteAgreement( Object(adr).name());
    }
    */

    /// @dev Buy an insurance agreement from a provider
    function purchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        bytes32 userType = getDBNode(getCurrentDBName(), _userName).getNodeType();
        require(userType == "receiver");

        return conductPurchaseZSCAgreement(_userName, _agrName); 
    }

    function claimInsurance(bytes32 _userName, bytes32 _agrName) public returns (bool) {
        checkRegistered(_userName, msg.sender);

        return conductZSCClaimInsurance(_userName, _agrName);
    }

    function getTokenBalanceInfoByIndex(bytes32 _userName, uint _index) public constant returns (string) {
        checkRegistered(_userName, msg.sender);

        return prepareTokenBalanceInfoByIndex(_userName, _index);
    }

    /*------2018-07-06: new verstion: YYA------  */

    function enableUserWallet(bytes32 _userName) public returns (address) {
        checkRegistered(_userName, msg.sender);

        address userAdr = address(getDBNode(getCurrentDBName(), _userName));
        require(userAdr != 0);

        require(getWalletAddress(_userName, "wat") == address(0));

        address walletAdr = enableWallet(_userName, userAdr, userAdr);
        require(walletAdr != 0);

        return walletAdr;
    }

    function getTokenBalanceInfoBySymbol(bytes32 _userName, bytes32 _symbol) public constant returns (string) {
        checkRegistered(_userName, msg.sender);

        return prepareTokenBalanceInfoBySymbol(_userName, _symbol);
    }
    /*------2018-07-06: new verstion: END-----  */

    function numUserTransactions(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        bytes32 walletName = formatWalletName(_userName, _tokenSymbol);
        address walletAdr = address(getDBNode(getCurrentDBName(), walletName));

        require(walletAdr != address(0));
        
        return DBNode(walletAdr).numTransactions();
    }

    function getUserTransactionByIndex(bytes32 _userName, bytes32 _tokenSymbol, uint _index) public constant returns (string) {
        checkRegistered(_userName, msg.sender);

        bytes32 walletName = formatWalletName(_userName, _tokenSymbol);
        return prepareTransationfoByIndex(walletName, _index);
    }

    function getModuleAddresses() public constant returns (string) {
        return prepareModulesAddresses();
    }
   
    function createMinerRobot(bytes32 _userName) public {
        checkRegistered(_userName, msg.sender);
        
        address walletAdr = getWalletAddress(_userName);
        getDBModule("pos").createRobot(walletAdr, 0);
    }
    
    function activeMinerRobot(bytes32 _userName, uint _robotId, uint _rewardType) public {
        checkRegistered(_userName, msg.sender);
        
        address walletAdr = getWalletAddress(_userName);
        uint lockedAmount = getDBModule("pos").activeRobot(walletAdr, _robotId, _rewardType);
       
        DBNode(walletAdr).lockWallet(getDBModule("token").getTokenAddress("ZSC"), lockedAmount);
    }    
    
    function auctionMinerRobot(bytes32 _userName, uint _robotId, uint _price) public payable {
        checkRegistered(_userName, msg.sender);
        
        address walletBuyerAdr;
        address preWalletAdr;
        uint prePrice;
        uint newPrice;

        walletBuyerAdr  = getWalletAddress(_userName);
        (preWalletAdr, prePrice, newPricew) = getDBModule("pos").auctionRobot(walletBuyerAdr, _robotId, _price);

        if (prePrice != 0) {
            DBNode(preWalletAdr).unLockWallet(address(0), prePrice);
        }
        DBNode(walletBuyerAdr).lockWallet(address(0), _price);
    }

    function trytakeMinerRobot(bytes32 _userName, uint _robotId) public payable {
        checkRegistered(_userName, msg.sender);

        address walletBuyerAdr;
        address seller;
        address endBuyer;
        uint endPrice;
        
        walletBuyerAdr  = getWalletAddress(_userName);
        (seller, endBuyer, endPrice) = getDBModule("pos").tryTakeRobot(walletBuyerAdr, _robotId);
        if (endPrice != 0) {
            DBNode(endBuyer).executeTransaction(address(0), seller, endPrice);
        }
    }
    
    function publishMinerRobot(bytes32 _userName, uint _robotId, uint _price) public {
        checkRegistered(_userName, msg.sender);
        
        address walletAdr = getWalletAddress(_userName);
        getDBModule("pos").publishRobot(walletAdr, _robotId, _price);
    }
}
