/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";
import "./control_info.sol";

contract DBNode {
    function setId(address _ethWalletiId) public;
    function getId() public returns (address);
    function getNodeType() public constant returns (bytes32);
    function getBlance() public constant returns (uint256);

    function setActivated(bool _activated) public;
    function getActivated() public constant returns (bool);

    function addParameter(bytes32 _parameter) public returns (bool);
    function removeParameter(bytes32 _parameter) public returns (bool);
    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool);
    function getParameter(bytes32 _parameter) public constant returns (bytes32);
    function numParameters() public constant returns (uint);
    function getParameterNameByIndex(uint _index) public constant returns (bytes32);

    function setERC20TokenAddress(address _tokenAdr) public;
    //function submitTransaction(address _dest, uint256 _amount, bytes _data, address _user) public returns (uint);
    //function confirmTransaction(address _sigAdr) public returns (uint);    
    function executeTransaction(address _dest, uint256 _amount) public returns (uint);
    function informTransaction(address _src, uint256 _amount) public;
    function numTransactions() public constant returns (uint);
    function getTransactionInfoByIndex(uint _index) public constant returns (uint, bool,  bytes32, uint, address, address);

    function setAgreementStatus(bytes32 _tag, bytes32 receiver) public returns (bool);
    //function configureHandlers() public returns (bool);
    //function getHandler(bytes32 _type) public constant returns (address);

    function bindAgreement(address _adr) public;
    function numAgreements() public constant returns (uint);
    function numTemplates() public constant returns (uint);
    function getAgreementByIndex(uint _index) public constant returns (address);
    function getTemplateByIndex(uint _index) public constant returns (address);

    function numChildren() public constant returns(uint);
    function getChildByIndex(uint _index) public  constant returns(address);
    function addChild(address _node) public returns (address);

    //function getMiningInfoByIndex(bool _isReward, uint _index) public constant returns (uint, uint);
    //function numMiningInfo(bool _isReward) public constant returns (uint);

    //function addSignature(address _sigAdr) public returns (bool);
    //function getAgreementInfo() public constant returns (bytes32, bytes32, uint, uint, bytes32, uint);

    function simulatePayforInsurance() public returns (uint);
}

contract DBFactory {
    function setDatabase(address _adr) public;
    function getDatabase() public constant returns (address);
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
    function numFactoryNodes() public constant returns (uint);
    function getFactoryNodeNameByIndex(uint _index) public constant returns (bytes32);
}

contract DBDatabase {
    function delegateFactory(address _adr, uint _priority) public;
    function getNode(bytes32 _name) public constant returns (address);
    function getRootNode() public constant returns (address);
    function destroyNode(address _node) public returns (bool);
    function checkeNodeByAddress(address _adr) public constant returns (bool);
    function _addNode(address _node) public ;
}

contract ControlBase is ControlInfo {   
    address public systemOL_;
    address public zscTokenAddress_;
    address public bindedAdm_;

    bytes32 public dbName_ = "zsc";

    mapping(bytes32 => address) public databases_;
    mapping(bytes32 => address) public factories_;

    function ControlBase(bytes32 _name) public ControlInfo(_name) {
    }
    
    function getCurrentDBName() internal constant returns (bytes32) {
        return dbName_;
    }

    function initControlApisAdrs(address _zscToken, address _adm) internal {
        require (_adm != 0 && _zscToken != 0);     

        zscTokenAddress_ = _zscToken;
        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);

        addLog("initControlApisAdrs ", true);
    }

    function mapFactoryDatabase(address _factoryAdr, bytes32 _dbName, uint _priority) internal {
        address dbAdr = databases_[_dbName];
        DBFactory(_factoryAdr).setDatabase(dbAdr);
        DBDatabase(dbAdr).delegateFactory(_factoryAdr, _priority);
    }

    function addComponent(bytes32 _type, bytes32 _name, address _adr) internal returns (bool) {
        bool ret = false;
        addLog("addComponent ", true);
        addLog(PlatString.bytes32ToString(_type), false);
        addLog(PlatString.bytes32ToString(_name), false);

        if (_type == "factory") {
            require(factories_[_name] == address(0));
            factories_[_name] = _adr;
            mapFactoryDatabase(_adr, dbName_, 1);
        } else if (_type == "database") {
            require(databases_[_name] == address(0));
            databases_[_name] = _adr;        
        } else {
            revert();
        }
        return ret;
    }

    function getComponent(bytes32 _type, bytes32 _name) internal constant returns (address) {
        if (_type == "factory") {
            return factories_[_name];
        } else if (_type == "database") {
            return databases_[_name];
        } else {
            revert();
        }
    }

    function getDBFactory(bytes32 _name) internal constant returns (DBFactory) {
        return DBFactory(getComponent("factory", _name));
    }

    function getDBDatabase(bytes32 _name) internal constant returns (DBDatabase) {
        return DBDatabase(getComponent("database", _name));
    }

    function getDBNode(bytes32 _db, bytes32 _nodeName) internal constant returns (DBNode) {
        return DBNode(getDBDatabase(_db).getNode(_nodeName));
    }

    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) internal pure returns (bytes32) {
        string memory str;
        if (_tokenSymbol == "ETH") {
            str = PlatString.append(_userName, "-ETH");
        } else {
            str = PlatString.append(_userName, "-", _tokenSymbol);
        }
        return PlatString.tobytes32(str);
    }

    function duplicateNode(address _nodeSrcAdr, address _nodeDstAdr) internal returns (bool) {
        require(_nodeSrcAdr != address(0) && _nodeDstAdr != address(0));

        bytes32 tempPara;
        bytes32 tempValue; 

        uint paraNos = DBNode(_nodeSrcAdr).numParameters();
        for (uint i = 0; i < paraNos; ++i) {
            tempPara = DBNode(_nodeSrcAdr).getParameterNameByIndex(i);
            tempValue = DBNode(_nodeSrcAdr).getParameter(tempPara);

            DBNode(_nodeDstAdr).addParameter(tempPara);
            DBNode(_nodeDstAdr).setParameter(tempPara, tempValue);
        }
        return true;
    }

    function createNodeForUser(bytes32 _type, bytes32 _nodeName, address _creator) internal returns (address) {
        address ndAdr;
        address parentAdr = getDBDatabase(dbName_).getRootNode();

        require(address(getDBNode(dbName_, _nodeName)) == 0);
        ndAdr = getDBFactory(_type).createNode(_nodeName, parentAdr, _creator);
        require(ndAdr != 0);

        enableZSCWallet(_nodeName, ndAdr, _creator);
        return ndAdr;
    }

    function createNodeForEelement(bytes32 _type, bytes32 _userName, bytes32 _nodeName, bytes32 _extra, address _creator) internal returns (address) {
        address ndAdr;
        address parentAdr;

        if (_type == "template") {
            parentAdr = address(getDBNode(dbName_, _userName));
        } else if (_type == "agreement") {
            parentAdr = address(getDBNode(dbName_, _extra));
        }

        ndAdr = getDBFactory(_type).createNode(_nodeName, parentAdr, _creator);
        require(ndAdr != 0);

        if (_type == "template") {
            DBNode(ndAdr).setParameter("provider", _userName);
        } else if (_type == "agreement") {
            duplicateNode(getDBNode(dbName_, _extra),  ndAdr);

            address agrWalletAdr = enableZSCWallet(_nodeName, ndAdr, _creator);
            publishZSCAgreement(_userName, ndAdr, agrWalletAdr);
        }
        return ndAdr;
    }

    function enableZSCWallet(bytes32 _enName, address _enAdr,  address _creator) private returns (address) {
        bytes32 walletName = formatWalletName(_enName, "ZSC");
        address walletAdr  = getDBFactory("wallet-erc20").createNode(walletName, _enAdr, _creator);

        require(walletAdr != 0);
        DBNode(walletAdr).setERC20TokenAddress(zscTokenAddress_); 
        return walletAdr;
    }

    function publishZSCAgreement(bytes32 _userName, address _agrAdr, address _agrWalletAdr) internal {
        string memory temp;
        uint lockedAmount;
        uint price;
        uint duration;

        temp = PlatString.bytes32ToString(DBNode(_agrAdr).getParameter("insurance"));
        lockedAmount = PlatString.stringToUint(temp);
        lockedAmount = lockedAmount.mul(1 ether);

        temp = PlatString.bytes32ToString(DBNode(_agrAdr).getParameter("price"));
        price = PlatString.stringToUint(temp);
        price = price.mul(1 ether);

        temp = PlatString.bytes32ToString(DBNode(_agrAdr).getParameter("duration"));
        duration = PlatString.stringToUint(temp);

        /*
        addLog("publishZSCAgreement: ", true);
        addLog("| price: ", false);
        addLog(PlatString.uintToString(price), false);
        addLog("| insurance: ", false);
        addLog(PlatString.uintToString(lockedAmount), false);
        */

        require(lockedAmount > 0 && price > 0 && duration >= 60);

        address userWallet = address(getDBNode(dbName_, formatWalletName(_userName, "ZSC")));

        DBNode(userWallet).executeTransaction(_agrWalletAdr, lockedAmount);
        DBNode(_agrWalletAdr).informTransaction(userWallet, lockedAmount);

        DBNode(_agrAdr).setAgreementStatus("PUBLISHED", "null");
    }

    //Disabled during alpha-test
    /*
    function enableWalletByUser(bytes32 _enName, bytes32 _tokeSymbol, address _creator) internal returns (address) {
        address ndAdr = address(getDBNode(dbName_, _enName));
        require(ndAdr != address(0));
        
        bytes32 ndType = DBNode(ndAdr).getNodeType();
        require(ndType == "provider" || ndType == "receiver" || ndType == "template" || ndType == "agreement");
        require(_tokeSymbol == "ZSC");

        bytes32 factoryType;
        address parentNode   = ndAdr;    
        bytes32 walletName = formatWalletName(_enName, _tokeSymbol);

        if (_tokeSymbol == "ETH") {
            factoryType = "wallet-eth";
        } else {
            factoryType = "wallet-erc20";
        }

        address walletAdr  = getDBFactory(factoryType).createNode(walletName, parentNode, _creator);
        require(walletAdr != 0);

        if (factoryType == "wallet-erc20") {
            DBNode(walletAdr).setERC20TokenAddress(zscTokenAddress_);  
        }  

        return walletAdr;
    }
    */

    /*
    function deleteAgreement( bytes32 _agrName) internal returns (bool) {
        address agrAdr = address(getDBNode(dbName_, _agrName));
        require(agrAdr != address(0));

        bytes32 status;
        bytes32 proName;
        uint price;
        uint lockedAmount;
        bytes32 tokenSymbol;
        uint endTime;

        (status, proName, price, lockedAmount, tokenSymbol, endTime) = getDBNode(dbName_, _agrName).getAgreementInfo();
        if (status == "PAID") return false;

        address agrWallet = address(getDBNode(dbName_, formatWalletName(_agrName, tokenSymbol)));
        address userWallet = address(getDBNode(dbName_, formatWalletName(proName, tokenSymbol)));
        require(agrWallet != address(0) && userWallet != address(0));

        DBNode(userWallet).executeTransaction(userWallet, lockedAmount);
        return getDBDatabase(dbName_).destroyNode(agrAdr);
    }
    */

    //Disabled during alpha-test
    /*
    function conductPublishAgreement(bytes32 _userName, bytes32 _agrName, address _creator) internal returns (uint) {
        checkDelegate(msg.sender, 1);

        address agrAdr = address(getDBNode(dbName_, _agrName));
        bytes32 tokenSymbol = DBNode(agrAdr).getParameter("walletSymbol");

        //address agrWallet = enableWalletByUser(_agrName, tokenSymbol, _creator);
        address agrWallet = enableZSCWallet(_agrName, agrAdr, _creator); 

        address userWallet = address(getDBNode(dbName_, formatWalletName(_userName, tokenSymbol)));
        require(userWallet != address(0));

        string memory temp;
        uint lockedAmount;
        uint price;

        temp = PlatString.bytes32ToString(DBNode(agrAdr).getParameter("insurance(lockedAmount)"));
        lockedAmount = PlatString.stringToUint(temp);

        temp = PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price"));
        price = PlatString.stringToUint(temp);

        require(lockedAmount > 0 && price > 0);

        uint amount = DBNode(userWallet).executeTransaction(agrWallet, lockedAmount);
        require(amount > 0);

        DBNode(agrAdr).setAgreementStatus("PUBLISHED", "null");

        addLog("publish agreement ", true);
        addLog(PlatString.bytes32ToString(_agrName), false);

        return amount;
    }
    */

    function conductPurchaseAgreement(bytes32 _userName, bytes32 _agrName) internal returns (uint) {
        bytes32 tokenSymbol = "ZSC"; //DBNode(agrAdr).getParameter("walletSymbol");

        address agrAdr = address(getDBNode(dbName_, _agrName));

        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "PUBLISHED");

        uint price     = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price")));
        require(price > 0);
        price = price.mul(1 ether);

        address recWallet   = address(getDBNode(dbName_, formatWalletName(_userName, tokenSymbol)));
        address agrWallet   = address(getDBNode(dbName_, formatWalletName(_agrName, tokenSymbol)));

        uint ret = DBNode(recWallet).executeTransaction(agrWallet, price);
        DBNode(agrWallet).informTransaction(recWallet, price);

        getDBNode(dbName_, _agrName).setAgreementStatus("PAID", _userName);
        getDBNode(dbName_, _userName).bindAgreement(agrAdr);

        addLog(PlatString.bytes32ToString(_userName), true);
        addLog(" purchased ", false);
        addLog(PlatString.bytes32ToString(_agrName), false);

        return ret;
    }


    function conductZSCClaimInsurance(bytes32 _userName, bytes32 _agrName) internal returns (bool) {
        bytes32 agrName = _agrName;

        address agrAdr = address(getDBNode(dbName_, agrName));
        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "PAID");

        bytes32 provider = DBNode(agrAdr).getParameter("provider");
        bytes32 receiver = DBNode(agrAdr).getParameter("receiver");
        require(_userName == provider || _userName == receiver);

        address proWallet = address(getDBNode(dbName_, formatWalletName(provider, "ZSC")));
        address recWallet = address(getDBNode(dbName_, formatWalletName(receiver, "ZSC")));
        address agrWallet = address(getDBNode(dbName_, formatWalletName(agrName, "ZSC")));

        string memory temp;
        uint lockedAmount;
        uint price;

        temp = PlatString.bytes32ToString(DBNode(agrAdr).getParameter("insurance"));
        lockedAmount = PlatString.stringToUint(temp);
        lockedAmount = lockedAmount.mul(1 ether);

        temp = PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price"));
        price = PlatString.stringToUint(temp);
        price = price.mul(1 ether);

        uint ret = DBNode(agrAdr).simulatePayforInsurance();

        if (ret == 0) {
            return false;
        } else if (ret == 1) {
            //Insurance to receiver
            DBNode(agrWallet).executeTransaction(proWallet, price);
            DBNode(agrWallet).executeTransaction(recWallet, lockedAmount);

            DBNode(proWallet).informTransaction(agrWallet, price);
            DBNode(recWallet).informTransaction(agrWallet, lockedAmount);

            /*
            temp = "";
            temp = PlatString.append(temp, PlatString.bytes32ToString(agrName), ": Paid price (", PlatString.uintToString(price));
            temp = PlatString.append(temp, ") to provider", PlatString.bytes32ToString(provider));
            addLog(temp, true);

            temp = "";
            temp = PlatString.append(temp, "; Give insurance (", PlatString.uintToString(lockedAmount));
            temp = PlatString.append(temp, ") to receiver", PlatString.bytes32ToString(receiver));
            addLog(temp, false);
            */
        } else if (ret == 2) {
            //Paid to provider
            DBNode(agrWallet).executeTransaction(proWallet, lockedAmount + price);

            DBNode(proWallet).informTransaction(agrWallet, lockedAmount + price);

            /*
            temp = "";
            temp = PlatString.append(temp, PlatString.bytes32ToString(agrName), ": Give reward (", PlatString.uintToString(price + lockedAmount));
            temp = PlatString.append(temp, ") to provider", PlatString.bytes32ToString(provider));
            addLog(temp, true);
            */
        }
        return true;
    }

    function prepareTokenBalanceInfoByIndex(bytes32 _enName, uint _index) internal constant returns (string) { 
        bytes32 status;
        bytes32 tokenSymbol;
        address tokenAdr;
        uint tokenBalance;
        bytes32 walletName;

        status = "true";
        if (_index == 0) {
            tokenSymbol = "ETH";
        } else if (_index == 1) {
            tokenSymbol = "ZSC";
        } else {
            revert();
        }

        walletName   = formatWalletName(_enName, tokenSymbol);
        tokenAdr     = address(getDBNode(dbName_, walletName));
        tokenBalance = DBNode(tokenAdr).getBlance().div(1 ether);

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        return str;
    }

    function prepareTransationfoByIndex(bytes32 _walletName, uint _index) internal constant returns (string) {
        address walletAdr = getDBNode(dbName_, _walletName);

        require(_index < DBNode(walletAdr).numTransactions());
        
        uint tranTime;
        bool isInput;
        bytes32 txHash;
        uint amount;
        address sender;
        address receiver;
        bytes32 inputTag;

        (tranTime, isInput, txHash, amount, sender, receiver) =  DBNode(walletAdr).getTransactionInfoByIndex(_index);

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
}
