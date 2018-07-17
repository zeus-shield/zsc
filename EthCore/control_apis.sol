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
        checkUserAllowed(msg.sender);

        return getDBFactory(_factoryType).numFactoryNodes(); 
    }

    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getFactoryElementNameByIndex(bytes32 _factoryType, uint _index) public view returns (bytes32) { 
        checkUserAllowed(msg.sender);

        return getDBFactory(_factoryType).getFactoryNodeNameByIndex(_index); 
    }

    /// @dev Check the element wheather or not existing
    /// @param _enName The name of the element to be checked
    function doesElementExist(bytes32 _enName) public view returns (bool) {
        checkRegistered(msg.sender, _enName);
        address adr = address(getDBNode(getCurrentDBName(), _enName));
        return (adr != address(0));
    }

    /// @dev Create an user
    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address) {
        checkDelegate(msg.sender, 1);       
        require(_factoryType == "staker" || _factoryType == "provider" || _factoryType == "receiver");
        require(address(getDBNode(getCurrentDBName(), _userName)) == 0);

        address ndAdr = createNodeForUser(_factoryType, _userName, _extraAdr);
        require(ndAdr != address(0));
        registerUserNode(_extraAdr, _userName, _factoryType);
        
        return ndAdr;
    }

    function createElementNode(bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo) public returns (address) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        
        require(_factoryType == "template" || _factoryType == "agreement");
        require(address(getDBNode(getCurrentDBName(), _enName)) == address(0));
        
        address ndAdr = createNodeForElement(_factoryType, userName, _enName, _extraInfo);
        require(ndAdr != address(0));
        registerEntityNode(msg.sender, _enName);
        
        return ndAdr;
    }

    /// @dev Get the type of an element
    /// @param _enName The name of the element belonging to the user
    function getElementType(bytes32 _enName) public view returns (bytes32) {
        checkRegistered(msg.sender, _enName);

        DBNode nd = getDBNode(getCurrentDBName(), _enName);
        require(address(nd) != address(0));
        return nd.getNodeType();
    }

    /// @dev Add a paramter to an element
    /// @param _enName The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(bytes32 _enName, bytes32 _parameter) public returns (bool) {
        checkRegistered(msg.sender, _enName);

        return getDBNode(getCurrentDBName(), _enName).addParameter(_parameter);
    }

    /// @dev Get the value of a paramter of an element
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _enName, bytes32 _parameter) public view returns (bytes32) {
        checkRegistered(msg.sender, _enName);

        bytes32 ndType = getDBNode(getCurrentDBName(), _enName).getNodeType();
        if (ndType != "agreement") {
            //checkMatched(_userName, _enName, msg.sender);
        }
        return getDBNode(getCurrentDBName(), _enName).getParameter(_parameter);
    }

    /// @dev Get the address of the element 
    /// @param _enName The name of the element
    function getElementAddress(bytes32 _enName) public view returns (address) {
        checkRegistered(msg.sender, _enName);

        return address(getDBNode(getCurrentDBName(), _enName));
    }

    function getUserName() public view returns (bytes32) {
        return getRegisteredUserName(msg.sender);
    } 

    /// @dev Get the number of paramters of an element
    /// @param _enName The name of the existing element
    function numElementParameters(bytes32 _enName) public view returns (uint) {
        checkUserAllowed(msg.sender);
        bytes32 enName = _enName;
        if (enName == "null") {
            enName = getRegisteredUserName(msg.sender);
        }

        bytes32 ndType = getDBNode(getCurrentDBName(), enName).getNodeType();
        if (ndType != "agreement") { 
            checkRegistered(msg.sender, enName);
        }

        return  getDBNode(getCurrentDBName(), enName).numParameters();
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
    function getElementParameterNameByIndex(bytes32 _enName, uint _index) public view returns (bytes32) {
        checkUserAllowed(msg.sender);
        bytes32 enName = _enName;
        if (enName == "null") {
            enName = getRegisteredUserName(msg.sender);
        }
        
        bytes32 ndType = getDBNode(getCurrentDBName(), enName).getNodeType();
        if (ndType != "agreement") {
            checkRegistered(msg.sender, enName);
        }

        return getDBNode(getCurrentDBName(), enName).getParameterNameByIndex(_index);
    }

    /// @dev Transfer a particular amount from a user wallet to the destination address
    /// @param _dest The destination address
    /// @param _amount The amount to be transferred
    function submitTransfer(bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint) {
        require(_amount > 0);
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        address walletAdr = getWalletAddress(userName);
        require(walletAdr != address(0));

        address tokenContractAdr = getDBModule("gm-token").getTokenAddress(_tokenSymbol);
        uint amount = DBNode(walletAdr).executeTransaction(tokenContractAdr, _dest, _amount);
        return amount;
    }

    function numElementChildren(bytes32 _enName) public view returns (uint) {
        checkRegistered(msg.sender, _enName);
        return  getDBNode(getCurrentDBName(), _enName).numChildren();
    }

    function getElementChildNameByIndex(bytes32 _enName, uint _index) public view returns (bytes32) {
        checkRegistered(msg.sender, _enName);
        address adr = getDBNode(getCurrentDBName(), _enName).getChildByIndex(_index);
        return Object(adr).name();
    }

    function numTemplates() public view returns (uint) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        return getDBNode(getCurrentDBName(), userName).numTemplates();
    }

    function getTemplateNameByIndex(uint _index) public view returns (bytes32) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        address adr = getDBNode(getCurrentDBName(), userName).getTemplateByIndex(_index);
        return Object(adr).name();
    }

    function numAgreements() public view returns (uint) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        return getDBNode(getCurrentDBName(), userName).numAgreements();
    }

    function getAgreementNameByIndex(uint _index) public view returns (bytes32) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        address adr = getDBNode(getCurrentDBName(), userName).getAgreementByIndex(_index);
        return Object(adr).name();
    }

    //------2018-07-06: new verstion: YYA------ 
    function enableUserWallet() public returns (address) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        address userAdr = address(getDBNode(getCurrentDBName(), userName));
        require(userAdr != 0);

        address walletAdr = enableWallet(userName, userAdr, msg.sender);
        require(walletAdr != 0);

        preallocateZSCToTester(walletAdr);

        return walletAdr;
    }

    function numOfTokens() public view returns (uint) {
        checkUserAllowed(msg.sender);
        return getDBModule("pos-token").numOfTokens();
    }

    function numUserTransactions() public view returns (uint) {
        checkUserAllowed(msg.sender);
        bytes32 userName = getRegisteredUserName(msg.sender);
        address walletAdr = getWalletAddress(userName);
        require(walletAdr != address(0));
        
        return DBNode(walletAdr).numTransactions();
    }
}
