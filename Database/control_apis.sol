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
    function setSystemModules(address _adm, address _db, address _walletGM, address _simulatorGM, address _pos, address _zscToken) public {
        checkDelegate(msg.sender, 1);
        setSystemModuleAdrs(_adm, _db, _walletGM, _simulatorGM, _pos, _zscToken);
    }

    /// @dev Add the database factory of managing the elements
    /// @param _typeInUint The type of the database factory
    /// @param _adr The address of the database factory
    function addElementFactory(uint _typeInUint, address _adr) public {
        checkDelegate(msg.sender, 1);
        addFactoryAdr(mapType(_typeInUint), _adr);
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
    function numElements() public constant returns (uint) { 
        checkDelegate(msg.sender, 1);
        return getDBDatabase().numNodes(); 
    }
    
    /// @dev Get the element name by the index
    /// @param _index The index of the element in the database
    function getElementNameByIndex(uint _index) public constant returns (bytes32) { 
        checkDelegate(msg.sender, 1);

        address nd = getDBDatabase().getNodeByIndex(_index);
        require(nd != address(0));
        return Object(nd).name();
    }


    /// @dev Check the element wheather or not existing
    /// @param _enName The name of the element to be checked
    function doesElementExist(bytes32 _userName, bytes32 _enName) public constant returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, msg.sender);
        checkDelegate(msg.sender, 1);

        return (getDBNode(_enName) != DBNode(0));
    }

    /// @dev Creat an element
    /// @param _typeInUint The type of the factory for creating the element
    /// @param _enName The name of the element belonging to the user
    /// @param _extraInfo The extra information
    /// @param _extraAdr The extra address
    function createElement(bytes32 _userName, uint _typeInUint, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
        checkRegistered(_userName, msg.sender);

        address creatorAdr;
        if (isDelegate(msg.sender, 1)) {
            creatorAdr = _extraAdr;
        } else {
            creatorAdr = msg.sender;
        }

        return createFactoryNode(mapType(_typeInUint), _enName, _extraInfo, creatorAdr);
    }

    function enableElementWallet(bytes32 _userName, bytes32 _tokeSymbol, address _extraAdr) public returns (address) {
        checkRegistered(_userName, msg.sender);

        address creatorAdr;
        if (isDelegate(msg.sender, 1)) {
            creatorAdr = _extraAdr;
        } else {
            creatorAdr = msg.sender;
        }

        uint typeUint;
        if (_tokeSymbol == "ETH") {
            typeUint = 6;
        } else {
            typeUint = 7;
        }
        return enableWallet(mapType(typeUint), _userName, _tokeSymbol, creatorAdr);
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
        checkMatched(_enName, msg.sender);

        DBNode nd = getDBNode( _enName);
        require(nd != DBNode(0));
        return nd.getNodeType();
    }


    /// @dev Add a paramter to an element
    /// @param _enName The name of the existing element
    /// @param _parameter The name of the added parameter
    function addElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

        return operateNodeParameter("add", _enName, _parameter, "");
    }

    /// @dev Set the value to a paramter of an element 
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    /// @param _value The parameter value
    function setElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter, string _value) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

        return operateNodeParameter("set", _enName, _parameter, _value);
    }

    /// @dev Get the value of a paramter of an element
    /// @param _enName The name of the element
    /// @param _parameter The name of the existing parameter
    function getElementParameter(bytes32 _userName, bytes32 _enName, bytes32 _parameter) public constant returns (string) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

        return getControlInfoParameterValue(_enName, _parameter);
    }

    /// @dev Get the address of the element 
    /// @param _enName The name of the element
    function getElementAddress(bytes32 _userName, bytes32 _enName) public constant returns (address) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

        return address(getDBNode(_enName));
    }

    /// @dev Get the eth balance of the element
    /// @param _enName The name of the element
    function getElementBalance(bytes32 _userName, bytes32 _enName, bytes32 _symbol, bool _locked) public constant returns (uint256) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

        string memory str = PlatString.append(_enName, "-", _symbol);
        bytes32 walletName = PlatString.tobytes32(str);
        require(getDBNode(walletName) != DBNode(0));

        return getDBNode(walletName).getBlance(_locked);
    }

    /// @dev Get the number of paramters of an element
    /// @param _enName The name of the existing element
    function numElementParameters(bytes32 _userName, bytes32 _enName) public constant returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

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
        checkMatched(_enName, msg.sender);

        return  getDBNode(_enName).getParameterNameByIndex(_index);
    }

    /// @dev Transfer ETH from a user element to the destination address
    /// @param _dest The destination address
    /// @param _amount The amount of ETH to be transferred
    function elementTransferValue(bytes32 _userName, address _src, address _dest, uint256 _amount) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        return  DBNode(_src).executeTransaction(_dest, _amount, "null");
    }

    function elementInformTransfer(bytes32 _userName, bytes32 _enName, address _dest, uint256 _amount) public returns (bool) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_enName, msg.sender);

        return  conductInformTransaction(_enName, _dest, _amount);
    }

    /// @dev Announce an insurance agreement by a provider
    /// @param _agrName The agreement name
    function publishAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);
        checkMatched(_agrName, msg.sender);

        return conductPublishAgreement(_userName, _agrName, msg.sender);
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

        bytes32 userType = getDBNode(_userName).getNodeType();
        address userAdr = address(getDBNode(_userName));
        address agrAdr; 
        
        if (userType == "provider") {
            agrAdr = DBNode(userAdr).getHandler("agreement");
            return DBNode(agrAdr).numChildren();
        } else if (userType == "receiver") {
            return DBNode(userAdr).numChildren();
        } else if (userType == "staker") {
            return 0;
        }
    }

    function getAgreementNameByIndex(bytes32 _userName, uint _index) public constant returns (bytes32) {
        checkRegistered(_userName, msg.sender);

        bytes32 userType = getDBNode(_userName).getNodeType();
        address userAdr = address(getDBNode(_userName));
        address agrAdr; 

        if (userType == "provider") {
            agrAdr = getDBNode(_userName).getChildByIndex(_index);
            return Object(agrAdr).name();
        } else if (userType == "receiver") {
            agrAdr = DBNode(userAdr).getChildByIndex(_index);
            return Object(agrAdr).name();
        } else if (userType == "staker") {
            return "null";
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
    function purchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        bool ret = preparePurchaseAgreement(_userName, _agrName);
        require(ret);        
        return conductPurchaseAgreement(_userName, _agrName); 
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
