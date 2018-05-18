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
    address private systemOL_;
    address private zscTokenAddress_;
    address private bindedAdm_;
    address private bindedPos_;

    bytes32 private zscDB_ = "zsc";
    constructor(bytes32 _name) public ControlInfo(_name) {
    }
    
    function setSystemModuleAdrs(address _adm, address _posGM, address _systemOverlayer, address _zscToken) internal {
        require (_adm != 0 && _db != 0 && _systemGM != 0 && _zscToken != 0);     

        zscTokenAddress_ = _zscToken;

        systemOL_ = _systemOverlayer;
        setDelegate(moduleGM_, 1);

        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);

        bindedPos_ = _posGM;
        setDelegate(bindedPos_, 1);

        addLog("setSystemModules ", true);
    }

    function getFactoryManager() internal constant returns (FactoryManager) {
        return FactoryManager(SystemManager(systemOL_).getComponent("factory", "gm"));
    }

    function getDatabaseManager() internal constant returns (DBManager) {
        return DBManager(SystemManager(systemOL_).getComponent("database", "gm"));
    }

    function getWalletManager() internal constant returns (WalletManager) {      
        return WalletManager(SystemManager(systemOL_).getComponent("module", "wallet-gm"));
    }

    function getPosManager() internal constant returns (PosManager) {      
        return PosManager(SystemManager(systemOL_).getComponent("module", "pos-gm"));
    }

    function getSimulatorManager() internal constant returns (SimulatorManager) {      
        return SimulatorManager(SystemManager(systemOL_).getComponent("module", "simulator-gm"));
    }

    function getDBNode(bytes32 _dbName, bytes32 _nodeName) internal constant returns (DBNode) {
        address dbAdr = SystemManager(systemGM_).getComponent("database", _dbName);
        return DBNode(DBDatabase(dbAdr).getNode(_nodeName));
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

        walletName = getWalletManager().formatWalletName(_enName, tokenSymbol);

        tokenAdr = address(getDBNode(zscDB_,walletName));
        tokenBalance = DBNode(tokenAdr).getBlance(false);

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

        proName     = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue(zscDB_,_agrName, "provider"));
        price       = PlatString.stringToUint(ggetDatabaseManager().getNodeParameterValue(zscDB_,_agrName, "price"));
        lockedAmount= PlatString.stringToUint(getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "lockedAmount"));
        tokenSymbol = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "walletSymbol"));
        endTime     = PlatString.stringToUint(getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "endTime"));

        address agrAdr = address(getDBNode(zscDB_, _agrName));
        address proAdr = address(getDBNode(zscDB_, proName)); 
        address recAdr = address(getDBNode(zscDB_, _userName)); 

        bytes32 runName = getSimulatorManager().addSimulationRun(70, price, endTime, lockedAmount, agrAdr, proAdr, recAdr);
        require(runName != "null");

        getDBNode(zscDB_, _agrName).setAgreementStatus("PAID", _userName);
        DBNode(recAdr).addChild(agrAdr);

        return true;
    }

    function deleteAgreement(bytes32 _userName, bytes32 _agrName) internal returns (bool) {
        address agrAdr = address(getDBNode(zscDB_, _agrName));
        require(agrAdr != address(0));

        bytes32 status = PlatString.tobytes32(getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "status"));
        if (status == "PAID") return false;

        address agrWallet = address(getDBNode(zscDB_, getWalletManager().formatWalletName(_agrName, tokenSymbol)));
        require(agrWallet != address(0));

        bytes32 tokenSymbol;
        bytes32 proName;
        uint lockedAmount;
        string memory temp;

        temp        = getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "walletSymbol");
        tokenSymbol = PlatString.tobytes32(temp);

        temp        = getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "provider");
        proName     = PlatString.tobytes32(temp);

        temp        = getDatabaseManager().getNodeParameterValue(zscDB_, _agrName, "lockedAmount");
        lockedAmount= PlatString.stringToUint(temp);

        address userWallet = address(getDBNode(zscDB_, getWalletManager().formatWalletName(proName, tokenSymbol)));
        require(userWallet != address(0));

        DBNode(userWallet).executeTransaction(true, userWallet, lockedAmount, "");
        return DBDatabase(bindedDB_).destroyNode(agrAdr);
    }

    function prepareMiningInfoByIndex(bytes32 _enName, bool _isReward, uint _index) internal constant returns (string) {
        uint time;
        uint amount;

        (time, amount) = getDBNode(zscDB_, _enName).getMiningInfoByIndex(_isReward, _index);

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
