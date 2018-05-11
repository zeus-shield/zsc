/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./control_info.sol";

contract DBNode is Object {
    function setId(address _ethWalletiId) public;
    function getId() public returns (address);
    function getNodeType() public constant returns (bytes32);
    function getBlance(bool _locked) public constant returns (uint256);

    function setActivated(bool _activated) public;
    function getActivated() public constant returns (bool);

    function addParameter(bytes32 _parameter) public returns (bool);
    function removeParameter(bytes32 _parameter) public returns (bool);
    function setParameter(bytes32 _parameter, string _value) public returns (bool);
    function numParameters() public constant returns (uint);
    function getParameterNameByIndex(uint _index) public constant returns (bytes32);

    function setERC20TokenAddress(address _tokenAdr) public;
    function doesLastTransactionSigned() public constant returns (bool);
    function submitTransaction(address _dest, uint256 _amount, bytes _data, address _user) public returns (uint);
    function confirmTransaction(address _sigAdr) public returns (uint);    
    function executeTransaction(bool _doesDirectly, address _dest, uint256 _amount, bytes _data) public returns (uint);
    function informTransaction(address _src, address _dest, uint256 _amount) public;
    function numTransactions() public constant returns (uint);
    function getTransactionInfoByIndex(uint _index) public constant returns (uint, bool, bytes32, uint, address, address);

    function setAgreementStatus(bytes32 _tag, bytes32 receiver) public returns (bool);
    function configureHandlers() public returns (bool);
    function getHandler(bytes32 _type) public constant returns (address);
    function numAgreements() public constant returns (uint);
    function getAgreementByIndex(uint _index) public constant returns (address);

    function numChildren() public constant returns(uint);
    function getChildByIndex(uint _index) public  constant returns(address);
    function addChild(address _node) public returns (address);

    function getMiningInfoByIndex(bool _isReward, uint _index) public constant returns (uint, uint);
    function numMiningInfo(bool _isReward) public constant returns (uint);

    function addSignature(address _sigAdr) public returns (bool);
}

contract PosManager is Object {
    function registerStaker(address _nodeAddress) public;
    function removeStaker(address _nodeAddress) public;

    function numBlockInfo(uint _poolIndex, bool _isMined) public constant returns (uint);
    function getBlockInfoByIndex(uint _poolIndex, uint _blockIndex) public constant returns (uint, uint, uint);
}

contract WalletManager is Object {
    function initWalletManager(address _controller, address _database) public;
    function doesTokenContractAdded() public constant returns (bool);
    function addTokenContract(bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) public returns (bool);
    function removeTokenContract(bytes32 _symbol) public returns (bool);
    function disableTokenContract(bytes32 _symbol) public returns (bool);
    function getTokenContractAddress(bytes32 _symbol) public constant returns (address);
    function enableTokenByHolder(bytes32 _tokenSymbol, bytes32 _nodeName, address _nodeAddress) public returns (bool);
    function numTokenContracts() public constant returns (uint);
    function getTokenInfoByIndex(uint _index) public constant returns (bytes32, bytes32, bytes32, uint, address);
    function enableWalletByUser(bytes32 _user, bytes32 _tokeSymbol, address _creator) public returns (address);
}

contract SimulatorManager is Object {
    function addSimulationRun(uint _proLevel, uint _price, uint _lockedAmount, uint _end, address _agrWallet, address _proWallet, address _recWallet) public returns (bytes32);
    function runSimulation(uint _steps) public;
}

contract SystemManager is Object {
    function getFactory(bytes32 _name) public returns (address);
    function getDatabase(bytes32 _name) public returns (address);
    function getModuleManager(bytes32 _name) public returns (address)
}

contract DBFactory is Object { 
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
    function numFactoryElements() public constant returns (uint);
    function getFactoryElementByIndex(uint _index) public constant returns (address);
}

contract DBDatabase is Object { 
    function getNode(bytes32 _name) public constant returns (address);
    function checkeNodeByAddress(address _adr) public constant returns (bool);
    function numNodes() public constant returns (uint);
    function getNodeByIndex(uint _index) public constant returns (address);
    function destroyNode(address _node) public returns (bool);
}

contract FactoryManager {
    function createFactoryNode(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) internal returns (address);
}

contract ControlBase is ControlInfo {   
    mapping(uint => bytes32) private factoryTypes_;
    mapping(bytes32 => address) private factories_;
    address private databaseGM_;
    address private systemGM_;

    address private bindedAdm_;
    address private bindedPos_;
    address private walletGM_;
    address private simulatorGM_;
    address private zscTokenAddress_;

    constructor(bytes32 _name) public ControlInfo(_name) {
    }

    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) internal pure returns (bytes32) {
        string memory str;
        bytes32 temp;
        if (_tokenSymbol == "ETH") {
            str = PlatString.append(_userName, "-ETH");
        } else {
            str = PlatString.append(_userName, "-", _tokenSymbol);
        }
        temp = PlatString.tobytes32(str);
    }
    
    function setSystemModuleAdrs(address _adm, address _systemGM, address _zscToken) internal {
        require (_adm != 0 && _db != 0 && _systemGM != 0 && _zscToken != 0);     

        zscTokenAddress_ = _zscToken;

        systemGM_ = _systemGM;
        setDelegate(moduleGM_, 1);

        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);

        addLog("setSystemModules ", true);
    }

    function getDBDatabase(bytes32 _name) internal constant returns (DBDatabase) { 
        return DBDatabase(SystemManager(systemGM_).getDatabase(_name));
    }

    function getFactoryManager() internal constant returns (DBFactory) {
        return DBFactory(SystemManager(systemGM_).getFactory(_name));
    }

    function getWalletManager() internal constant returns (WalletManager) {      
        return DBDatabase(SystemManager(systemGM_).getModuleManager("wallet-gm"));
    }

    function getPosManager() internal constant returns (PosManager) {      
        return DBDatabase(SystemManager(systemGM_).getModuleManager("pos-gm"));
    }

    function getSimulatorManager() internal constant returns (SimulatorManager) {      
        return DBDatabase(SystemManager(systemGM_).getModuleManager("simulator-gm"));
    }

    function getDBNode(bytes32 _type, bytes32 _node) internal constant returns (DBNode) {      
        return DBNode(getDBDatabase(_type).getNode(_node));
    }

    function createFactoryNode(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) internal returns (address) {
        address adr;
        address parentNode = address(0);

        if (_type == "template") {
            parentNode = getDBNode(_userName).getHandler(_type);
        } else if (_type == "agreement") {
            uint copies = PlatString.stringToUint(getNodeParameterValue(_userName, _extra, "copies"));
            parentNode = address(getDBNode(_extra));
            require(DBNode(parentNode).numChildren() < copies);
        }

        adr = getDBFactory(_type).createNode(_nodeName, parentNode, _creator);
        require(adr != 0);

        if (_type == "provider" || _type == "receiver" || _type == "staker") {
            DBNode(adr).configureHandlers();
            DBNode(adr).setId(_creator);
            registerUserNode(_nodeName, adr, _creator);
        } else {
            registerEntityNode(_userName, _nodeName, adr, _creator);
        }

        if (_type == "staker") {
            PosManager(bindedPos_).registerStaker(adr);
        } else if (_type == "template") {
            DBNode(adr).setParameter("provider", PlatString.bytes32ToString(_userName));
        } else if (_type == "agreement") {
            duplicateNode(_userName, _extra,  _nodeName);
            DBNode(adr).setAgreementStatus("READY", "null");
        }
        return adr;
    }

    function operateNodeParameter(bytes32 _operation, bytes32 _userName, bytes32 _node, bytes32 _parameter, string _value) internal returns (bool) {
        bool ret;
        string memory str = ""; 
        str = PlatString.append(str, PlatString.bytes32ToString(_node), " : " );
        str = PlatString.append(str, PlatString.bytes32ToString(_parameter), " : " , _value);
        if (_operation == "add") {
            str = PlatString.append("addNodeParameter - ", str);
            ret = getDBNode(_node).addParameter(_parameter);
        } else if (_operation == "set") {
            str = PlatString.append("setNodeParameter - ", str);
            ret = getDBNode(_node).setParameter(_parameter, _value);
            setNodeParameterValue(_userName, _node, _parameter, _value);
        }        
        addLog(str, true);
        return ret;
    }

    function duplicateNode(bytes32 _userName, bytes32 _nodeSrc, bytes32 _nodeDst) internal returns (bool) {
        address nodeSrc = address(getDBNode( _nodeSrc));
        address nodeDst = address(getDBNode( _nodeDst));

        if (nodeSrc == address(0)) return false;
        if (nodeDst == address(0)) return false;
        
        bytes32 tempPara;
        string memory tempValue; 

        uint paraNos = DBNode(nodeSrc).numParameters();
        for (uint i = 0; i < paraNos; ++i) {
            tempPara = DBNode(nodeSrc).getParameterNameByIndex(i);
            tempValue = getNodeParameterValue(_userName, _nodeSrc, tempPara);

            DBNode(nodeDst).addParameter(tempPara);
            DBNode(nodeDst).setParameter(tempPara, tempValue);
        }
        return true;
    }

    function manageErc20TokenContract(bool _doesAdd, bytes32 _name, bytes32 _symbol, uint _decimals, address _tokenAdr) internal returns (bool) {
        if (_doesAdd) {
            return WalletManager(walletGM_).addTokenContract(_name, _symbol, _decimals, _tokenAdr);
        } else {
            return WalletManager(walletGM_).removeTokenContract(_symbol);
        }
    }

    function prepareTokenContractInfoByIndex(uint _index) internal constant returns (string) {
        require(_index <= WalletManager(walletGM_).numTokenContracts());

        if (_index == 0) {
            return "ETH";
        }

        bytes32 tokenName;
        bytes32 status;
        bytes32 tokenSymbol;
        uint tokenDecimals;
        address tokenAdr;
        (tokenName, status, tokenSymbol, tokenDecimals, tokenAdr) =  WalletManager(walletGM_).getTokenInfoByIndex(_index - 1);

        string memory str ="";
        str = PlatString.append(str, "info?name=", PlatString.bytes32ToString(tokenName),   "&");
        str = PlatString.append(str, "status=",    PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",    PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "decimals=",  PlatString.uintToString(tokenDecimals),  "&");
        str = PlatString.append(str, "adr=",       PlatString.addressToString(tokenAdr),    "&");
        return str;
    }

    function prepareTokenBalanceInfoByIndex(bytes32 _enName, uint _index) internal constant returns (string) {
        require(_index <= WalletManager(walletGM_).numTokenContracts());

        bytes32 tokenName;
        bytes32 status;
        bytes32 tokenSymbol;
        uint tokenDecimals;
        address tokenAdr;
        uint tokenBalance;
        bytes32 walletName;

        if (_index == 0) {
            status = "true";
            tokenSymbol = "ETH";
        } else {
            (tokenName, status, tokenSymbol, tokenDecimals, tokenAdr) =  WalletManager(walletGM_).getTokenInfoByIndex(_index);
        }

        walletName = formatWalletName(_enName, "ETH");

        tokenAdr = address(getDBNode(walletName));
        tokenBalance = getDBNode(walletName).getBlance(false);

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        return str;
    }

    function prepareTranasationfoByIndex(bytes32 _walletName, uint _index) internal constant returns (string) {
        require(_index < getDBNode(_walletName).numTransactions());
        
        uint tranTime;
        bool isInput;
        bytes32 txHash;
        uint amount;
        address sender;
        address receiver;
        bytes32 inputTag;

        (tranTime, isInput, txHash, amount, sender, receiver) =  getDBNode(_walletName).getTransactionInfoByIndex(_index);

        if (isInput) inputTag = "true";
        else inputTag = "false";

        string memory str ="";
        str = PlatString.append(str, "info?time=", PlatString.uintToString(tranTime),    "&");
        str = PlatString.append(str, "input=",     PlatString.bytes32ToString(inputTag), "&");
        str = PlatString.append(str, "tx=",        PlatString.bytes32ToString(txHash),   "&");
        str = PlatString.append(str, "amout=",     PlatString.uintToString(amount),      "&");
        str = PlatString.append(str, "sender=",    PlatString.addressToString(sender),   "&");
        str = PlatString.append(str, "receiver=",  PlatString.addressToString(receiver), "&");
        return str;
    }

    function preparePurchaseAgreement(bytes32 _userName, bytes32 _agrName) internal returns (bool) {
        bytes32 proName;
        uint price;
        uint lockedAmount;
        bytes32 tokenSymbol;
        uint endTime;

        proName     = PlatString.tobytes32(getNodeParameterValue(_userName, _agrName, "provider"));
        price       = PlatString.stringToUint(getNodeParameterValue(_userName, _agrName, "price"));
        lockedAmount= PlatString.stringToUint(getNodeParameterValue(_userName, _agrName, "lockedAmount"));
        tokenSymbol = PlatString.tobytes32(getNodeParameterValue(_userName, _agrName, "walletSymbol"));
        endTime     = PlatString.stringToUint(getNodeParameterValue(_userName, _agrName, "endTime"));

        address agrAdr = getDBDatabase().getNode(_agrName);
        address proAdr = getDBDatabase().getNode(proName);
        address recAdr = getDBDatabase().getNode(_userName);

        bytes32 runName = getSimulatorManager().addSimulationRun(70, price, endTime, lockedAmount, agrAdr, proAdr, recAdr);
        require(runName != "null");

        getDBNode(_agrName).setAgreementStatus("PAID", _userName);
        DBNode(recAdr).addChild(agrAdr);

        return true;
    }

    function conductPurchaseAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _sigAdr) internal returns (uint) {
        bytes32 tokenSymbol = PlatString.tobytes32(getNodeParameterValue(_userName, _agrName, "walletSymbol"));
        uint price          = PlatString.stringToUint(getNodeParameterValue(_userName, _agrName, "price"));
        address recWallet   = getDBDatabase().getNode(formatWalletName(_userName, tokenSymbol));
        address agrWallet   = getDBDatabase().getNode(formatWalletName(_agrName, tokenSymbol));

        uint purchaseAount = 0;
        if (_isFirstSubmit) {
            if (DBNode(recWallet).doesLastTransactionSigned()) {
                purchaseAount = DBNode(recWallet).submitTransaction(agrWallet, price, "", _sigAdr);
            }
        } else { 
            if (!DBNode(recWallet).doesLastTransactionSigned()) {
                purchaseAount = DBNode(recWallet).confirmTransaction(_sigAdr);
            }
        }
        return purchaseAount;
    }

    function conductPublishAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _creator) internal returns (uint) {
        bytes32 tokenSymbol = PlatString.tobytes32(getNodeParameterValue(_userName, _agrName, "walletSymbol"));
        address userWallet = address(getDBNode(formatWalletName(_userName, tokenSymbol)));
        address agrWallet; 

        require(agrWallet != address(0));
        uint lockedAmount = PlatString.stringToUint(getNodeParameterValue(_userName, _agrName, "lockedAmount"));

        uint amount = 0;
        if (_isFirstSubmit) {
            if (DBNode(userWallet).doesLastTransactionSigned()) {
                if (tokenSymbol == "ETH") {
                    agrWallet = getWalletManager().enableWalletByUser(_agrName, tokenSymbol, _creator);
                } else {
                    if (!WalletManager(walletGM_).doesTokenContractAdded()) {
                        return 0;
                    } else {
                        agrWallet = getWalletManager().enableWalletByUser(_agrName, tokenSymbol, _creator);
                    }
                }
                amount = DBNode(userWallet).submitTransaction(agrWallet, lockedAmount, "", _creator);
            }
        } else {
            if (!DBNode(userWallet).doesLastTransactionSigned()) {
                agrWallet = address(getDBNode(formatWalletName(_agrName, tokenSymbol)));
                amount = DBNode(userWallet).confirmTransaction(_creator);
                getDBNode(_agrName).setAgreementStatus("PUBLISHED", "null");
            }
        }
        return amount;
    }

    function conductInformTransaction(bytes32 _userName, bytes32 _enName, address _dest, uint256 _amount) internal returns (bool) {
        bytes32 destName = Object(_dest).name();
        bytes32 tokenSymbol = PlatString.tobytes32(getNodeParameterValue(_userName, destName, "walletSymbol"));
        address userWallet = address(getDBNode(formatWalletName(_enName, tokenSymbol)));
        DBNode(_dest).informTransaction(userWallet, _dest, _amount);
        return true;
    }

    function deleteAgreement(bytes32 _userName, bytes32 _agrName) internal returns (bool) {
        address agrAdr = address(getDBNode(_agrName));
        require(agrAdr != address(0));

        bytes32 status = PlatString.tobytes32(getNodeParameterValue(_userName, _agrName, "status"));
        if (status == "PAID") return false;

        address agrWallet = address(getDBNode(formatWalletName(_agrName, tokenSymbol)));
        require(agrWallet != address(0));

        bytes32 tokenSymbol;
        bytes32 proName;
        uint lockedAmount;
        string memory temp;

        temp        = getNodeParameterValue(_userName, _agrName, "walletSymbol");
        tokenSymbol = PlatString.tobytes32(temp);

        temp        = getNodeParameterValue(_userName, _agrName, "provider");
        proName     = PlatString.tobytes32(temp);

        temp        = getNodeParameterValue(_userName, _agrName, "lockedAmount");
        lockedAmount= PlatString.stringToUint(temp);

        address userWallet = address(getDBNode(formatWalletName(proName, tokenSymbol)));
        require(userWallet != address(0));

        DBNode(userWallet).executeTransaction(true, userWallet, lockedAmount, "");
        return DBDatabase(bindedDB_).destroyNode(agrAdr);
    }

    function prepareMiningInfoByIndex(bytes32 _enName, bool _isReward, uint _index) internal constant returns (string) {
        uint time;
        uint amount;

        (time, amount) = getDBNode(_enName).getMiningInfoByIndex(_isReward, _index);

        string memory str ="";
        str = PlatString.append(str, "info?time=", PlatString.uintToString(time),    "&");
        str = PlatString.append(str, "amount=",    PlatString.uintToString(amount), "&");
        return str;
    }

    function prepareBlockInfoByIndex(uint _poolIndex, uint _blockIndex) internal constant returns (string) {
        checkDelegate(msg.sender, 1);
   
        uint size; 
        uint txNos;
        uint limit;

        (limit, size, txNos) = getPosManager().getBlockInfoByIndex(_poolIndex, _blockIndex);

        string memory str = "";
        str = PlatString.append(str, "info?limit=", PlatString.uintToString(limit), "&");
        str = PlatString.append(str, "info?size=", PlatString.uintToString(size), "&");
        str = PlatString.append(str, "info?txNos=", PlatString.uintToString(txNos), "&");

        return str;
    }

}
