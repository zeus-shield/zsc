/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./sys_include.sol";
import "./sys_include_adv.sol";
import "./control_info.sol";

contract ControlBase is ControlInfo {   
    address private systemOL_;
    address private zscTokenAddress_;
    address private bindedAdm_;
    address private bindedPos_;

    bytes32 private dbName_ = "null";
    constructor(bytes32 _name) public ControlInfo(_name) {
    }
    
    function setSystemModuleAdrs(address _adm, address _posGM, address _systemOL, address _zscToken) internal {
        require (_adm != 0 && _posGM != 0 && _systemOL != 0 && _zscToken != 0);     

        zscTokenAddress_ = _zscToken;

        systemOL_ = _systemOL;
        setDelegate(systemOL_, 1);

        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);

        bindedPos_ = _posGM;
        setDelegate(bindedPos_, 1);

        addLog("setSystemModules ", true);
    }

    function setDBName(bytes32 _name) internal {
        dbName_ = _name;
    }

    function getFactoryManager() internal constant returns (FactoryManager) {
        return FactoryManager(SysOverlayer(systemOL_).getComponent("factory", "gm"));
    }

    function getWalletManager() internal constant returns (WalletManager) {      
        return WalletManager(SysOverlayer(systemOL_).getComponent("module", "wallet-gm"));
    }

    function getPosManager() internal constant returns (PosManager) {      
        return PosManager(SysOverlayer(systemOL_).getComponent("module", "pos-gm"));
    }

    function getSimulatorManager() internal constant returns (SimulatorManager) {      
        return SimulatorManager(SysOverlayer(systemOL_).getComponent("module", "simulator-gm"));
    }

    function getDBDatabase() internal constant returns (DBDatabase) {
        return DBDatabase(SysOverlayer(systemOL_).getComponent("database", dbName_));
    }

    function getDBNode(bytes32 _nodeName) internal constant returns (DBNode) {
        return DBNode(getDBDatabase().getNode(_nodeName));
    }

    function deleteAgreement( bytes32 _agrName) internal returns (bool) {
        address agrAdr = address(getDBNode(_agrName));
        require(agrAdr != address(0));

        bytes32 status;
        bytes32 proName;
        uint price;
        uint lockedAmount;
        bytes32 tokenSymbol;
        uint endTime;

        (status, proName, price, lockedAmount, tokenSymbol, endTime) = getDBNode(_agrName).getAgreementInfo();
        if (status == "PAID") return false;

        address agrWallet = address(getDBNode(getWalletManager().formatWalletName(_agrName, tokenSymbol)));
        address userWallet = address(getDBNode(getWalletManager().formatWalletName(proName, tokenSymbol)));
        require(agrWallet != address(0) && userWallet != address(0));

        DBNode(userWallet).executeTransaction(userWallet, lockedAmount, "");
        return getDBDatabase().destroyNode(agrAdr);
    }

    function prepareTokenContractInfoByIndex(uint _index) internal constant returns (string) {
        require(_index <= getWalletManager().numTokenContracts());

        if (_index == 0) {
            return "ETH";
        }

        bytes32 tokenName;
        bytes32 status;
        bytes32 tokenSymbol;
        uint tokenDecimals;
        address tokenAdr;
        (tokenName, status, tokenSymbol, tokenDecimals, tokenAdr) = getWalletManager().getTokenInfoByIndex(_index - 1);

        string memory str ="";
        str = PlatString.append(str, "info?name=", PlatString.bytes32ToString(tokenName),   "&");
        str = PlatString.append(str, "status=",    PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",    PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "decimals=",  PlatString.uintToString(tokenDecimals),  "&");
        str = PlatString.append(str, "adr=",       PlatString.addressToString(tokenAdr),    "&");
        return str;
    }

    function prepareTokenBalanceInfoByIndex(bytes32 _enName, uint _index) internal constant returns (string) {
        require(_index <= getWalletManager().numTokenContracts());

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
            (tokenName, status, tokenSymbol, tokenDecimals, tokenAdr) =  getWalletManager().getTokenInfoByIndex(_index - 1);
        }

        walletName = getWalletManager().formatWalletName(_enName, tokenSymbol);

        tokenAdr = address(getDBNode(walletName));
        tokenBalance = DBNode(tokenAdr).getBlance(false);

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        return str;
    }

    function prepareTransationfoByIndex(bytes32 _walletName, uint _index) internal constant returns (string) {
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

    function prepareMiningInfoByIndex(bytes32 _enName, bool _isReward, uint _index) internal constant returns (string) {
        uint time;
        uint amount;

        (time, amount) = getDBNode(_enName).getMiningInfoByIndex(_isReward, _index);

        string memory str ="";
        str = PlatString.append(str, "info?time=", PlatString.uintToString(time),   "&");
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

    function preparePurchaseAgreement(bytes32 _userName, bytes32 _agrName) internal returns (bool) {
        bytes32 status;
        bytes32 proName;
        uint price;
        uint lockedAmount;
        bytes32 tokenSymbol;
        uint endTime;

        (status, proName, price, lockedAmount, tokenSymbol, endTime) = getDBNode(_agrName).getAgreementInfo();

        address agrAdr = address(getDBNode(_agrName));
        address proAdr = address(getDBNode(proName)); 
        address recAdr = address(getDBNode(_userName)); 

        bytes32 runName = getSimulatorManager().addSimulationRun(70, price, endTime, lockedAmount, agrAdr, proAdr, recAdr);
        require(runName != "null");

        getDBNode(_agrName).setAgreementStatus("PAID", _userName);
        DBNode(recAdr).addChild(agrAdr);

        return true;
    }
}
