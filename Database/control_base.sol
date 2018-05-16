/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./system_include.sol";
import "./system_include_adv.sol";
import "./control_info.sol";

contract ControlBase is ControlInfo {   
    mapping(uint => bytes32) private factoryTypes_;
    mapping(bytes32 => address) private factories_;
    address private systemGM_;
    address private zscTokenAddress_;
    address private bindedAdm_;
    address private bindedPos_;

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
    
    function setSystemModuleAdrs(address _adm, address _posGM, address _systemGM, address _zscToken) internal {
        require (_adm != 0 && _db != 0 && _systemGM != 0 && _zscToken != 0);     

        zscTokenAddress_ = _zscToken;

        systemGM_ = _systemGM;
        setDelegate(moduleGM_, 1);

        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);

        bindedPos_ = _posGM;
        setDelegate(bindedPos_, 1);

        addLog("setSystemModules ", true);
    }

    function getDBDatabase(bytes32 _name) internal constant returns (DBDatabase) {
        return DBDatabase(SystemManager(systemGM_).getComponent("database", _name));
    }

    function getFactoryManager() internal constant returns (FactoryManager) {
        return FactoryManager(SystemManager(systemGM_).getComponent("factory", "gm"));
    }

    function getDatabaseManager() internal constant returns (DBManager) {
        return DBManager(SystemManager(systemGM_).getComponent("database", "gm"));
    }

    function getWalletManager() internal constant returns (WalletManager) {      
        return WalletManager(SystemManager(systemGM_).getComponent("module", "wallet-gm"));
    }

    function getPosManager() internal constant returns (PosManager) {      
        return PosManager(SystemManager(systemGM_).getComponent("module", "pos-gm"));
    }

    function getSimulatorManager() internal constant returns (SimulatorManager) {      
        return SimulatorManager(SystemManager(systemGM_).getComponent("module", "simulator-gm"));
    }

    function getDBNode(bytes32 _dbName, bytes32 _nodeName) internal constant returns (DBNode) {      
        return DBNode(getDBDatabase(_dbName).getNode(_nodeName));
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

        tokenAdr = address(getDBNode("zsc", walletName));
        tokenBalance = getDBNode("zsc", walletName).getBlance(false);

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        return str;
    }

    function prepareTranasationfoByIndex(bytes32 _walletName, uint _index) internal constant returns (string) {
        require(_index < getDBNode("zsc",_walletName).numTransactions());
        
        uint tranTime;
        bool isInput;
        bytes32 txHash;
        uint amount;
        address sender;
        address receiver;
        bytes32 inputTag;

        (tranTime, isInput, txHash, amount, sender, receiver) =  getDBNode("zsc",_walletName).getTransactionInfoByIndex(_index);

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

        proName     = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "provider"));
        price       = PlatString.stringToUint(ggetDatabaseManager().getNodeParameterValue("zsc", _agrName, "price"));
        lockedAmount= PlatString.stringToUint(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "lockedAmount"));
        tokenSymbol = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "walletSymbol"));
        endTime     = PlatString.stringToUint(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "endTime"));

        address agrAdr = getDBDatabase().getNode(_agrName);
        address proAdr = getDBDatabase().getNode(proName);
        address recAdr = getDBDatabase().getNode(_userName);

        bytes32 runName = getSimulatorManager().addSimulationRun(70, price, endTime, lockedAmount, agrAdr, proAdr, recAdr);
        require(runName != "null");

        getDBNode("zsc", _agrName).setAgreementStatus("PAID", _userName);
        DBNode(recAdr).addChild(agrAdr);

        return true;
    }

    function conductPurchaseAgreement(bool _isFirstSubmit, bytes32 _userName, bytes32 _agrName, address _sigAdr) internal returns (uint) {
        bytes32 tokenSymbol = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "walletSymbol"));
        uint price          = PlatString.stringToUint(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "price"));
        address recWallet   = getDBDatabase().getNode(formatWalletName(_userName, tokenSymbol));
        address agrWallet   = getDBDatabase().getNode(formatWalletName(_agrName, tokenSymbol));

        uint purchaseAount = 0;
        if (_isFirstSubmit) {
            purchaseAount = DBNode(recWallet).submitTransaction(agrWallet, price, "", _sigAdr);
        } else { 
            purchaseAount = DBNode(recWallet).confirmTransaction(_sigAdr);
        }
        return purchaseAount;
    }

    function conductPublishAgreement(bytes32 _userName, bytes32 _agrName, address _creator) internal returns (uint) {
        bytes32 tokenSymbol = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "walletSymbol"));
        address userWallet = address(getDBNode("zsc", formatWalletName(_userName, tokenSymbol)));
        address agrWallet; 

        require(agrWallet != address(0));
        uint lockedAmount = PlatString.stringToUint(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "lockedAmount"));

        uint amount = 0;
        if (tokenSymbol == "ETH") {
            agrWallet = getWalletManager().enableWalletByUser(_agrName, tokenSymbol, _creator);
        } else {
            if (!WalletManager(walletGM_).doesTokenContractAdded()) {
                return 0;
            } else {
                agrWallet = getWalletManager().enableWalletByUser(_agrName, tokenSymbol, _creator);
            }
        }
        amount = DBNode(userWallet).executeTransaction(agrWallet, lockedAmount, "", _creator);
        require(amount > 0);

        getDBNode("zsc", _agrName).setAgreementStatus("PUBLISHED", "null");
        return amount;
    }

    function conductInformTransaction(bytes32 _userName, bytes32 _enName, address _dest, uint256 _amount) internal returns (bool) {
        bytes32 destName = Object(_dest).name();
        bytes32 tokenSymbol = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue("zsc", destName, "walletSymbol"));
        address userWallet = address(getDBNode("zsc", formatWalletName(_enName, tokenSymbol)));
        DBNode(_dest).informTransaction(userWallet, _dest, _amount);
        return true;
    }

    function deleteAgreement(bytes32 _userName, bytes32 _agrName) internal returns (bool) {
        address agrAdr = address(getDBNode("zsc", _agrName));
        require(agrAdr != address(0));

        bytes32 status = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue("zsc", _agrName, "status"));
        if (status == "PAID") return false;

        address agrWallet = address(getDBNode("zsc", formatWalletName(_agrName, tokenSymbol)));
        require(agrWallet != address(0));

        bytes32 tokenSymbol;
        bytes32 proName;
        uint lockedAmount;
        string memory temp;

        temp        = getDatabaseManager().getNodeParameterValue("zsc", _agrName, "walletSymbol");
        tokenSymbol = PlatString.tobytes32(temp);

        temp        = getDatabaseManager().getNodeParameterValue("zsc", _agrName, "provider");
        proName     = PlatString.tobytes32(temp);

        temp        = getDatabaseManager().getNodeParameterValue("zsc", _agrName, "lockedAmount");
        lockedAmount= PlatString.stringToUint(temp);

        address userWallet = address(getDBNode("zsc", formatWalletName(proName, tokenSymbol)));
        require(userWallet != address(0));

        DBNode(userWallet).executeTransaction(true, userWallet, lockedAmount, "");
        return DBDatabase(bindedDB_).destroyNode(agrAdr);
    }

    function prepareMiningInfoByIndex(bytes32 _enName, bool _isReward, uint _index) internal constant returns (string) {
        uint time;
        uint amount;

        (time, amount) = getDBNode("zsc", _enName).getMiningInfoByIndex(_isReward, _index);

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
