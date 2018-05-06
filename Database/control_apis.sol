/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./control_base.sol";

contract ControlApis is ControlBase {
    /// @dev Constructor
    /// @param _name The name of the controller
    constructor(bytes32 _name) public ControlBase(_name) {
    }

    function setUserActiveStatus(bytes32 _user, bool _tag) public returns (bool);

    /// @dev Set the zsc adm address
    /// @param _adm The address of the zsc adm 
    /// @param _db The address of the database 
    function setSystemModules(address _adm, address _db, address _walletGM, address _simulatorGM, address _pos, address _factoryGM, address _zscToken) public {
        checkDelegate(msg.sender, 1);
        setSystemModuleAdrs(_adm, _db, _walletGM, _simulatorGM, _pos, _factoryGM, _zscToken);
    }

    function registerErc20Token(bytes32 _symbol, bytes32 _name, uint _decimals, address _tokenAdr) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return manageErc20TokenContract(true, _name, _symbol, _decimals, _tokenAdr);
    }

    function removeErc20Token(bytes32 _symbol) public returns (bool) {
        checkDelegate(msg.sender, 1);
        return manageErc20TokenContract(false, 0, _symbol, 0, 0);
    }

    function runSimulationTest(uint _steps) public {
        checkDelegate(msg.sender, 1);
        getSimulatorManager().runSimulation(_steps);
    }

    function getTokenContractInfoByIndex(uint _index) public constant returns (string) {
        checkDelegate(msg.sender, 1);
        return prepareTokenContractInfoByIndex(_index);
    }

    /// @dev Get the number of elements of the database
    function numFactoryElements(bytes32 _userName, bytes32 _factoryType) public constant returns (uint) { 
        if (_factoryType == "agreement") {
            checkRegistered(_userName, msg.sender);
        } else {
            checkDelegate(msg.sender, 1);
        }

        return getDBFactory(_factoryType).numFactoryElements(); 
    }
    
    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getFactoryElementNameByIndex(bytes32 _userName, bytes32 _factoryType, uint _index) public constant returns (bytes32) { 
        if (_factoryType == "agreement") {
            checkRegistered(_userName, msg.sender);
        } else {
            checkDelegate(msg.sender, 1);
        }

        address nd = getDBFactory(_factoryType).getFactoryElementByIndex(_index);
        require(nd != address(0));
        return Object(nd).name();
    }

    /// @dev Check the element wheather or not existing
    /// @param _enName The name of the element to be checked
    function doesElementExist(bytes32 _userName, bytes32 _enName) public constant returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return (getDBNode(_enName) != DBNode(0));
    }

    /// @dev Creat an element
    /// @param _factoryType The type of the factory for creating the element
    /// @param _enName The name of the element belonging to the user
    /// @param _extraInfo The extra information
    /// @param _extraAdr The extra address
    function createElement(bytes32 _userName, bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
        checkRegistered(_userName, msg.sender);

        address creatorAdr;
        if (isDelegate(msg.sender, 1)) {
            creatorAdr = _extraAdr;
        } else {
            creatorAdr = msg.sender;
        }

        return createFactoryNode(_factoryType, _userName, _enName, _extraInfo, creatorAdr);
    }

    function enableElementWallet(bytes32 _userName, bytes32 _tokeSymbol, address _extraAdr) public returns (address) {
        checkRegistered(_userName, msg.sender);

        address creatorAdr;
        if (isDelegate(msg.sender, 1)) {
            creatorAdr = _extraAdr;
        } else {
            creatorAdr = msg.sender;
        }

        bytes32 factoryType;
        if (_tokeSymbol == "ETH") {
            factoryType = "wallet-eth";
        } else {
            factoryType = "wallet-erc20";
        }
        return enableWallet(factoryType, _userName, _tokeSymbol, creatorAdr);
    }

    /// @dev Get the element by its address
    /// @param _adr The address of the existing element
    function getElementNameByAddress(bytes32 _userName, address _adr) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        require (getDBDatabase().checkeNodeByAddress(_adr));
        return Object(_adr).name();
    }

    /// @dev Get the type of an element
    /// @param _enName The name of the element belonging to the user
    function getElementType(bytes32 _userName, bytes32 _enName) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        DBNode nd = getDBNode( _enName);
        require(nd != DBNode(0));
        return nd.getNodeType();
    }


    /// @dev Add a paramter to an element
    /// @param _enName The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return operateNodeParameter("add", _enName, _parameter, "");
    }

    /// @dev Set the value to a paramter of an element 
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    /// @param _value The parameter value
    function setElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter, string _value) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return operateNodeParameter("set", _enName, _parameter, _value);
    }

    /// @dev Get the value of a paramter of an element
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (string) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return getControlInfoParameterValue(_enName, _parameter);
    }

    /// @dev Get the address of the element 
    /// @param _enName The name of the element
    function getElementAddress(bytes32 _userName, bytes32 _enName) public constant returns (address) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return address(getDBNode(_enName));
    }

    /// @dev Get the eth balance of the element
    /// @param _enName The name of the element
    function getElementBalance(bytes32 _userName, bytes32 _enName, bytes32 _symbol, bool _locked) public constant returns (uint256) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        string memory str = PlatString.append(_enName, "-", _symbol);
        bytes32 walletName = PlatString.tobytes32(str);
        require(getDBNode(walletName) != DBNode(0));

        return getDBNode(walletName).getBlance(_locked);
    }

    /// @dev Get the number of paramters of an element
    /// @param _enName The name of the existing element
    function numElementParameters(bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return  getDBNode(_enName).numParameters();
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
        checkMatched(_userName, _enName, msg.sender);

        return  getDBNode(_enName).getParameterNameByIndex(_index);
    }

    /// @dev Transfer a particular amount from a user wallet to the destination address
    /// @param _dest The destination address
    /// @param _amount The amount to be transferred
    function submitTransfer(bytes32 _userName, bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint) {
        require(_amount > 0);
        checkRegistered(_userName, msg.sender);

        bytes32 walletName = formatWalletName(_userName, _tokenSymbol);
        address walletAdr = address(getDBNode(walletName));

        require(walletAdr != address(0));

        uint amount = 0;
        if (DBNode(walletAdr).doesLastTransactionSigned()) {
            amount = DBNode(walletAdr).submitTransaction(_dest, _amount, "", msg.sender);
        } 
        return amount;
    }

    /// @dev Confirm a transaction
    function confirmTransfer(bytes32 _userName, bytes32 _tokenSymbol) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        bytes32 walletName = formatWalletName(_userName, _tokenSymbol);
        address walletAdr = address(getDBNode(walletName));

        require(walletAdr != address(0));

        uint amount = 0;
        if (!DBNode(walletAdr).doesLastTransactionSigned()) {
            amount = DBNode(walletAdr).confirmTransaction(msg.sender);
        } 
        return amount;
    }

    function informTransfer(bytes32 _userName, bytes32 _enName, address _dest, uint256 _amount) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);

        return  conductInformTransaction(_enName, _dest, _amount);
    }

    /// @dev Announce an insurance agreement by a provider
    /// @param _agrName The agreement name
    function submitPublishAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _agrName, msg.sender);

        return conductPublishAgreement(true, _userName, _agrName, msg.sender);
    }

    function confirmPublishAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _agrName, msg.sender);

        return conductPublishAgreement(false, _userName, _agrName, msg.sender);
    }

    function numTemplates(bytes32 _userName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        address adr = getDBNode(_userName).getHandler("template");
        return DBNode(adr).numChildren();
    }

    function getTemplateNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        address adr = getDBNode(_userName).getChildByIndex(_index);
        return Object(adr).name();
    }

    function numAgreements(bytes32 _userName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        address userAdr = address(getDBNode(_userName));        
        bytes32 userType = DBNode(userAdr).getNodeType();

        if (userType == "provider" || userType == "staker" || userType == "receiver") {
            return DBNode(userAdr).numAgreements();
        } else {
            revert();
        }
    }

    function numElementChildren(bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _enName, msg.sender);
        return  getDBNode(_enName).numChildren();
    }

    function getAgreementNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);
        address userAdr = address(getDBNode(_userName));        
        bytes32 userType = DBNode(userAdr).getNodeType();

        if (userType == "provider" || userType == "staker" || userType == "receiver") {
            address agrAdr = DBNode(userAdr).getAgreementByIndex(_index);
            return Object(agrAdr).name();
        } else {
            revert();
        }
    }

    function deleteAgreementByIndex(bytes32 _userName, uint _index) public returns (bool) {
        checkRegistered(_userName, msg.sender);

        address adr = getDBNode(_userName).getChildByIndex(_index);
        return deleteAgreement(Object(adr).name());
    }

    /// @dev Buy an insurance agreement from a provider
    /// @param _userName The receiver name
    /// @param _agrName The agreement name
    function submitPurchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        uint amount = conductPurchaseAgreement(true, _userName, _agrName, msg.sender);
        if (amount > 0) {
            require(preparePurchaseAgreement(_userName, _agrName));
        }     
        return amount; 
    }

    /// @dev Buy an insurance agreement from a provider
    /// @param _userName The receiver name
    /// @param _agrName The agreement name
    function confirmPurchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        uint amount = conductPurchaseAgreement(false, _userName, _agrName, msg.sender);
        if (amount > 0) {
            require(preparePurchaseAgreement(_userName, _agrName));
        }     
        return amount; 
    }

    function numRegisteredErc20Tokens(bytes32 _userName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        return getWalletManager().numTokenContracts() + 1;
    }

    function getTokenBalanceInfoByIndex(bytes32 _userName, uint _index) public constant returns (string) {
        checkRegistered(_userName, msg.sender);

        return prepareTokenBalanceInfoByIndex(_userName, _index);
    }

    function getUserWalletAddress(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (address) {
        checkRegistered(_userName, msg.sender);

        DBNode nd = getDBNode( _userName);
        require(nd != DBNode(0));

        string memory temp = PlatString.append(_userName, "-", _tokenSymbol);
        return address(getDBNode(PlatString.tobytes32(temp)));
    }

    function numUserTransactions(bytes32 _userName, bytes32 _tokenSymbol) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);

        DBNode nd = getDBNode( _userName);
        require(nd != DBNode(0));

        string memory temp = PlatString.append(_userName, "-", _tokenSymbol);
        return getDBNode(PlatString.tobytes32(temp)).numTransactions();
    }

    function getUserTransactionByIndex(bytes32 _userName, bytes32 _tokenSymbol, uint _index) public constant returns (string) {
        checkRegistered(_userName, msg.sender);

        DBNode nd = getDBNode( _userName);
        require(nd != DBNode(0));

        string memory temp = PlatString.append(_userName, "-", _tokenSymbol);
        return prepareTranasationfoByIndex(PlatString.tobytes32(temp), _index);
    }

    function numBlockInfo(bytes32 _userName, uint _poolIndex, bool _isMined) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        return getPosManager().numBlockInfo(_poolIndex, _isMined);
    }

    function getBlockInfoByIndex(bytes32 _userName, uint _poolIndex, uint _blockIndex) public constant returns (string) {
        checkRegistered(_userName, msg.sender);
        return prepareBlockInfoByIndex(_poolIndex, _blockIndex);
    }

    function numStakerMining(bytes32 _userName, bool _isReward) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        return getDBNode(_userName).numMiningInfo(_isReward);
    }

    function getStakerMiningInfoByIndex(bytes32 _userName, bool _isReward, uint _index) public constant returns (string) {
        checkRegistered(_userName, msg.sender);
        return prepareMiningInfoByIndex(_userName, _isReward, _index);
    }
}
