/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBNode {
    function getNodeType() public view returns (bytes32);
    function getBlance(address _adr) public view returns (uint256);

    function addParameter(bytes32 _parameter) public returns (bool);
    //function removeParameter(bytes32 _parameter) public returns (bool);
    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool);
    function getParameter(bytes32 _parameter) public view returns (bytes32);
    function numParameters() public view returns (uint);
    function getParameterNameByIndex(uint _index) public view returns (bytes32);

    function setERC20TokenAddress(address _tokenAdr) public;
    //function submitTransaction(address _dest, uint256 _amount, bytes _data, address _user) public returns (uint);
    //function confirmTransaction(address _sigAdr) public returns (uint);    
    function executeTransaction(address _tokenAdr, address _dest, uint256 _amount) public returns (uint);
    function informTransaction(address _src, uint256 _amount) public;
    function numTransactions() public view returns (uint);
    function getTransactionInfoByIndex(uint _index) public view returns (uint, bool,  bytes32, uint, address, address);
    function lockWallet(address _tokenAdr, uint _amount) public;
    function unlockWallet(address _tokenAdr, uint _amount) public;
   
    function setAgreementStatus(bytes32 _tag, bytes32 receiver) public returns (bool);
    //function configureHandlers() public returns (bool);
    //function getHandler(bytes32 _type) public view returns (address);

    function bindAgreement(address _adr) public;
    function numAgreements() public view returns (uint);
    function numTemplates() public view returns (uint);
    function getAgreementByIndex(uint _index) public view returns (address);
    function getTemplateByIndex(uint _index) public view returns (address);

    function numChildren() public view returns(uint);
    function getChildByIndex(uint _index) public  view returns(address);
    function addChild(address _node) public returns (address);

    //function getMiningInfoByIndex(bool _isReward, uint _index) public view returns (uint, uint);
    //function numMiningInfo(bool _isReward) public view returns (uint);

    //function addSignature(address _sigAdr) public returns (bool);
    //function getAgreementInfo() public view returns (bytes32, bytes32, uint, uint, bytes32, uint);

    function simulatePayforInsurance() public returns (uint);
}

contract DBFactory {
    function setDatabase(address _adr) public;
    function createNode(bytes32 _nodeName, address _parent, address _creator) public returns (address);
    function numFactoryNodes() public view returns (uint);
    function getFactoryNodeNameByIndex(uint _index) public view returns (bytes32);
}

contract DBDatabase {
    function delegateFactory(address _adr, uint _priority) public;
    function getNode(bytes32 _name) public view returns (address);
    function getRootNode() public view returns (address);
    function destroyNode(address _node) public returns (bool);
    function checkeNodeByAddress(address _adr) public view returns (bool);
    function _addNode(address _node) public ;
}

contract DBModule {
    function getTokenAddress(bytes32 _symbol) public view returns (address);
    function getTokenInfoByIndex(uint _index) public view returns (bytes32, bytes32, bytes32, uint, address);
    function getTokenInfoBySymbol(bytes32 _symbol) public view returns (bytes32, bytes32, bytes32, uint, address);

    function createRobot(address _user, uint _level) public returns (uint);
    function activeRobot(address _user, uint _robotId, uint _rewardType) public returns (uint);
    function enhanceRobot(address _user, uint _robotA, uint _robotB) public returns (uint);
    function publishRobot(address _seller, uint _robotId, uint _price, uint _durationInDays) public;
    function cancelAuction(address _seller, uint _robotId) public returns (address buyer, uint price);
    function auctionRobot(address _buyer, uint _robotId, uint _price) public returns (address preBuyer, uint prePrice, uint newPrice);
    function tryTakeRobot(address _buyer, uint _robotId) public returns (address seller, address endBuyer, uint endPrice);
    function claimable(address _user, uint _robotId) public view returns (bool);
    function claimReward(address _user, uint _robotId) public returns (uint);
}

contract ControlBase is Object {   
    address public systemOL_;
    address public bindedAdm_;

    bytes32 public dbName_ = "zsc";

    mapping(bytes32 => address) public databases_;
    mapping(bytes32 => address) public factories_;
    mapping(bytes32 => address) public modules_;

    uint internal allocatedZSC_;
    uint internal allocatedETH_;

    function ControlBase(bytes32 _name) public Object(_name) {
    }

    //////////////////////////////////
    function allowedUser(bytes32 _userName, address _sender) internal constant returns (bool);
    function addAllowedUser(bytes32 _userName, address _creator) internal returns (bool);
    function checkMatched(bytes32 _userName, bytes32 _enName, address _sender) internal view;
    function checkRegistered(bytes32 _userName, address _sender) internal view;
    function registerUserNode(bytes32 _userName, address _nodeAdr, address _creator) internal;
    function registerEntityNode(bytes32 _userName,  bytes32 _enName, address _nodeAdr, address _creator) internal;
    function setUserStatus(bytes32 _user, bool _tag) public returns (bool);
    function getUserStatus(bytes32 _user) public view returns (bool);
    //////////////////////////////////
    
    function getCurrentDBName() internal view returns (bytes32) {
        return dbName_;
    }

    function initControlApisAdrs(address _adm) internal {
        require (_adm != 0);     
        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);
        addLog("initControlApisAdrs ", true);
    }

    function preallocateZSCToTester(address _userWalletAdr) internal {
        address tokenContractAdr = getDBModule("token").getTokenAddress("ZSC");

        if (allocatedZSC_ == 0) {
            uint remaingZSC = ERC20Interface(tokenContractAdr).balanceOf(address(this));
            if (remaingZSC > allocatedZSC_) {
                ERC20Interface(tokenContractAdr).transfer(_userWalletAdr, allocatedZSC_);
            }
        }

        if (allocatedETH_ > 0) {
            uint remaingETH = address(this).balance;
            if (remaingETH > allocatedETH_) {
                require(_userWalletAdr.call.value(allocatedETH_)());
            }
        }        
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
        } else if (_type == "module") {
            require(modules_[_name] == address(0));
            modules_[_name] = _adr;       
        } else {
            revert();
        }
        return ret;
    }

    function getComponent(bytes32 _type, bytes32 _name) internal view returns (address) {
        if (_type == "factory") {
            return factories_[_name];
        } else if (_type == "database") {
            return databases_[_name];
        } else if (_type == "module") {
            return modules_[_name];
        } else {
            revert();
        }
    }

    function getDBFactory(bytes32 _name) internal view returns (DBFactory) {
        return DBFactory(getComponent("factory", _name));
    }

    function getDBDatabase(bytes32 _name) internal view returns (DBDatabase) {
        return DBDatabase(getComponent("database", _name));
    }

    function getDBModule(bytes32 _name) internal view returns (DBModule) {
        return DBModule(getComponent("module", _name));
    }

    function getDBNode(bytes32 _db, bytes32 _nodeName) internal view returns (DBNode) {
        return DBNode(getDBDatabase(_db).getNode(_nodeName));
    }

    function formatWalletName(bytes32 _userName, bytes32 _tokenSymbol) internal pure returns (bytes32) {
        string memory str;
        str = PlatString.append(_userName, "-", _tokenSymbol);
        return PlatString.tobytes32(str);
    }

    function duplicateNode(address _nodeSrcAdr, address _nodeDstAdr) internal returns (bool) {
        //require(_nodeSrcAdr != address(0) && _nodeDstAdr != address(0));
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

    function getWalletAddress(bytes32 _enName) internal view returns (address) {
        bytes32 walletName;
        
        walletName = formatWalletName(_enName, "wat");
        return address(getDBNode(dbName_, walletName)); 
    }

    function createNodeForUser(bytes32 _type, bytes32 _nodeName, address _creator) internal returns (address) {
        address ndAdr;
        address parentAdr = getDBDatabase(dbName_).getRootNode();

        ndAdr = getDBFactory(_type).createNode(_nodeName, parentAdr, _creator);
        require(ndAdr != 0);

        return ndAdr;
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

    function enableWallet(bytes32 _enName, address _enAdr, address _creator) internal returns (address) {
        bytes32 walletNmae = formatWalletName(_enName, "wat");
        require(address(getDBNode(dbName_, walletNmae)) != 0);

        address walletAdr  = getDBFactory("wallet-adv").createNode(walletNmae, _enAdr, _creator);
        require(walletAdr != 0);
        return walletAdr;
    }

    //////////////////////////////////////
    function publishAgreement(bytes32 _userName, bytes32 _agrName) public {
        checkRegistered(_userName, msg.sender);
        checkMatched(_userName, _agrName, msg.sender);

        address _creator = msg.sender;
        address agrAdr = address(getDBNode(dbName_, _agrName));
        require(agrAdr != 0);

        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "CREATED");

        address agrWalletAdr     = enableWallet(_agrName, agrAdr, _creator);
        address userWallet       = getWalletAddress(_userName);
        address tokenContractAdr = getDBModule("token").getTokenAddress("ZSC");

        uint lockedAmount = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("insurance")));

        DBNode(userWallet).executeTransaction(tokenContractAdr, agrWalletAdr, lockedAmount.mul(1 ether));

        DBNode(agrAdr).setAgreementStatus("PUBLISHED", "null");
    }

    function purchaseAgreement(bytes32 _userName, bytes32 _agrName) public returns (uint) {
        checkRegistered(_userName, msg.sender);

        bytes32 userType = getDBNode(getCurrentDBName(), _userName).getNodeType();
        require(userType == "receiver");

        address agrAdr = address(getDBNode(dbName_, _agrName));
        require(agrAdr != address(0));

        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "PUBLISHED");

        uint price     = PlatString.stringToUint(PlatString.bytes32ToString(DBNode(agrAdr).getParameter("price")));
        require(price > 0);
        price = price.mul(1 ether);

        address recWallet   = getWalletAddress(_userName); 
        address agrWallet   = getWalletAddress(_agrName);
        address tokenContractAdr = getDBModule("token").getTokenAddress("ZSC");

        uint ret = DBNode(recWallet).executeTransaction(tokenContractAdr, agrWallet, price);

        getDBNode(dbName_, _agrName).setAgreementStatus("PAID", _userName);
        getDBNode(dbName_, _userName).bindAgreement(agrAdr);

        bytes32 provider = DBNode(agrAdr).getParameter("provider");
        address proWallet = getWalletAddress(provider);
        DBNode(recWallet).executeTransaction(tokenContractAdr, proWallet, price);
        
        return ret;
    }


    function claimInsurance(bytes32 _userName, bytes32 _agrName) public returns (bool) {
        checkRegistered(_userName, msg.sender);

        bytes32 agrName = _agrName;

        address agrAdr = address(getDBNode(dbName_, agrName));
        bytes32 status = DBNode(agrAdr).getParameter("status");
        require(status == "PAID");

        bytes32 provider = DBNode(agrAdr).getParameter("provider");
        bytes32 receiver = DBNode(agrAdr).getParameter("receiver");
        require(_userName == provider || _userName == receiver);

        address proWallet = getWalletAddress(provider);/// address(getDBNode(dbName_, formatWalletName(provider, "ZSC")));
        address recWallet = getWalletAddress(receiver);// address(getDBNode(dbName_, formatWalletName(receiver, "ZSC")));
        address agrWallet = getWalletAddress(receiver);// address(getDBNode(dbName_, formatWalletName(agrName, "ZSC")));
        address tokenContractAdr = getDBModule("token").getTokenAddress("ZSC");

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
 
    function getTokenBalanceInfo(bool _useIndex, bytes32 _enName, uint _index, bytes32 _symbol) public view returns (string) { 
        checkRegistered(_enName, msg.sender);

        bytes32 status;
        bytes32 tokenName;
        bytes32 tokenSymbol;
        uint tokenDecimals;
        address tokenAdr;
        address userWalletAdr;
        uint tokenBalance;

        userWalletAdr = getWalletAddress(_enName);

        if (_useIndex) {
            (status, tokenName, tokenSymbol, tokenDecimals, tokenAdr) = getDBModule("token").getTokenInfoByIndex(_index);
        } else {
            (status, tokenName, tokenSymbol, tokenDecimals, tokenAdr) = getDBModule("token").getTokenInfoBySymbol(_symbol);
        }
        
        tokenBalance = DBNode(userWalletAdr).getBlance(tokenAdr);
        
        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        return str;
    }


    function getUserTransactionByIndex(bytes32 _userName, uint _index) public constant returns (string) {
        checkRegistered(_userName, msg.sender);

        address walletAdr = getWalletAddress(_userName);

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
 

    function getModuleAddresses() public view returns (string) {
        address dbAdr = address(getDBDatabase(dbName_));
        address factoryProAdr = address(getDBFactory("provider"));
        address factoryRecAdr = address(getDBFactory("receiver"));
        address factoryTmpAdr = address(getDBFactory("template"));
        address factoryAgrAdr = address(getDBFactory("agreement"));
        address factoryErc20Adr = address(getDBFactory("wallet-erc20"));
        address tokenContractAdr = getDBModule("token").getTokenAddress("ZSC");

        string memory str ="adrs?";
        str = PlatString.append(str, "testZSC=",      PlatString.addressToString(tokenContractAdr), "&");
        str = PlatString.append(str, "log-decorder=", PlatString.addressToString(logRecorder_),     "&");
        str = PlatString.append(str, "adm-base=",     PlatString.addressToString(bindedAdm_),       "&");
        str = PlatString.append(str, "control-apis=", PlatString.addressToString(address(this)),    "&");
        str = PlatString.append(str, "database=",     PlatString.addressToString(dbAdr),            "&");
        str = PlatString.append(str, "factory-provider=",    PlatString.addressToString(factoryProAdr),    "&");
        str = PlatString.append(str, "factory-receiver=",    PlatString.addressToString(factoryRecAdr),    "&");
        str = PlatString.append(str, "factory-template=",    PlatString.addressToString(factoryTmpAdr),    "&");
        str = PlatString.append(str, "factory-agreement=",   PlatString.addressToString(factoryAgrAdr),    "&");
        str = PlatString.append(str, "factory-wallet-erc20=",PlatString.addressToString(factoryErc20Adr),  "&");
        return str;
    }
    
}
