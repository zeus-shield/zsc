/*
Copyright (c) 2018 ZSC Dev Team
*/

pragma solidity ^0.4.21;

import "./object.sol";

contract DBNode {
    function getNodeType() public view returns (bytes32);
    function getBalance(address _adr) public view returns (uint256);
    function getLockedAmount(address _tokenAdr) public view returns (uint);
    function getTransactionInfoByIndex(uint _index) public view returns (uint, uint, uint, address, address);
    function executeTransaction(address _tokenAdr, address _dest, uint _amount) public returns (uint);
    function setERC20TokenAddress(address _tokenAdr) public;
    function numTransactions() public view returns (uint);
    function lockWallet(address _tokenAdr, uint _amount) public;
    function unlockWallet(address _tokenAdr, uint _amount) public;

    function addParameter(bytes32 _parameter) public returns (bool);
    //function removeParameter(bytes32 _parameter) public returns (bool);
    function setParameter(bytes32 _parameter, bytes32 _value) public returns (bool);
    function getParameter(bytes32 _parameter) public view returns (bytes32);
    function numParameters() public view returns (uint);
    function getParameterNameByIndex(uint _index) public view returns (bytes32);

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
    function numOfTokens() public view returns (uint);
    function getTokenAddress(bytes32 _symbol) public view returns (address);
    function getTokenInfoByIndex(uint _index) public view returns (bytes32, bytes32, bytes32, uint, address);
    function getTokenInfoBySymbol(bytes32 _symbol) public view returns (bytes32, bytes32, bytes32, uint, address);

    /*ERC721 for miner robot begin*/
    //function balanceOf(address _owner) public view returns (uint);
    //function tokenOfOwnerByIndex(address _owner, uint _index) public view returns (uint);
    //function getRobotInfo(uint _robotId) public view returns (bytes32, uint, uint, uint, uint, uint, uint);
    //function getExtraEffect(uint _robotId) public view returns (uint _extraSp, uint _extraUpgradProb);
    //function getLevelInfo(uint _index) public view returns (uint, uint, uint, uint);

    //function createRobot(address _user, uint _level) public returns (uint);
    //function activeRobot(address _user, uint _robotId, uint _durationInDays, uint _totalZSC) public returns (uint);
    //function publishRobot(address _seller, uint _robotId, uint _price) public;
    //function cancelAuction(address _seller, uint _robotId) public;
    //function purchaseRobot(address _buyer, uint _robotId) public returns (address, uint);
    //function getReward(address _user, uint _robotId) public view returns (uint);
    //function claimReward(address _user, uint _robotId) public returns (uint, uint);
    //function numSellingRobots() public view returns (uint);
    //function getSellingRobotByIndex(uint _index) public view returns (uint, uint, uint, uint, address);
    //function safeTransferFrom(address _from, address _to, uint _tokenId) public;
    /*ERC721 for miner robot end*/
}

contract ControlBase is Object {   
    address private bindedAdm_;
    bytes32 internal dbName_ = "zsc";

    mapping(bytes32 => address) private databases_;
    mapping(bytes32 => address) private factories_;
    mapping(bytes32 => address) private modules_;

    bytes32 private allocatedTokenSymbol_;
    uint private allocatedToken_;
    uint private allocatedETH_;

    address internal paymentReceiver_;

    function ControlBase(bytes32 _name) public Object(_name) {
    }

    //////////////////////////////////
    function registerUserNode(address _creator, bytes32 _userName, bytes32 _type) internal;
    function registerEntityNode(address _creator, bytes32 _endName) internal;
    function checkAllowed(address _sender) internal view;
    function checkMatched(address _sender, bytes32 _enName) internal view;
    function getMappedName(address _sender) internal view returns (bytes32);
    function getBindedWalletAddress(bytes32 _enName) internal view returns (address);

    function createUserNode(bytes32 _factoryType, bytes32 _userName, address _extraAdr) public returns (address);
    //////////////////////////////////

    function preallocateZSCToTester(address _userWalletAdr) internal {
        if (allocatedToken_ > 0) {
            address tokenContractAdr = getDBModule("gm-token").getTokenAddress(allocatedTokenSymbol_);
            uint remaingZSC = ERC20Interface(tokenContractAdr).balanceOf(address(this));
            if (remaingZSC > allocatedToken_) {
                ERC20Interface(tokenContractAdr).transfer(_userWalletAdr, allocatedToken_);
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

    function formatWalletName(bytes32 _userName) internal pure returns (bytes32) {
        string memory str;
        str = PlatString.append(_userName, "-wat");
        return PlatString.tobytes32(str);
    }

    function enableWallet(bytes32 _walletName, address _enAdr, address _creator) internal returns (address) {
        require(address(getDBNode(dbName_, _walletName)) == 0);

        address walletAdr  = getDBFactory("wallet-adv").createNode(_walletName, _enAdr, _creator);
        require(walletAdr != 0);
        return walletAdr;
    }
    //////////////////////////////////////
    //////////////////////////////////////
    function initControlApis(address _adm) public {
        checkDelegate(msg.sender, 1);

        require (_adm != 0);     
        bindedAdm_ = _adm;
        setDelegate(bindedAdm_, 1);
        addLog("initControlApis ", true);
    }

    function setPaymentReceiver(address _receiver) public {
        checkDelegate(msg.sender, 1);
        require(_receiver != address(0));
        paymentReceiver_ = _receiver;
    }

    function setPreallocateAmountToTester(uint _ethAmount, bytes32 _tokenSymbol, uint _tokenAmount) public { 
        checkDelegate(msg.sender, 1);
        allocatedTokenSymbol_ = _tokenSymbol;
        if (_ethAmount > 0) { allocatedETH_ = _ethAmount.mul(1 ether);}
        if (_tokenAmount > 0) { allocatedToken_ = _tokenAmount.mul(1 ether); }
    }

    function addSystemComponent(bytes32 _type, bytes32 _name, address _adr) public returns (bool) {
        bool ret = false;
        checkDelegate(msg.sender, 1);
        require(_adr != address(0));

        addLog("addComponent ", true);
        addLog(PlatString.bytes32ToString(_type), false);
        addLog(" ", false);
        addLog(PlatString.bytes32ToString(_name), false);

        if (_type == "factory") {
            factories_[_name] = _adr;
            mapFactoryDatabase(_adr, dbName_, 1);
        } else if (_type == "database") {
            databases_[_name] = _adr;       
        } else if (_type == "module") {
            setDelegate(_adr, 1);
            modules_[_name] = _adr;       
        } else {
            revert();
        }
        return ret;
    }

    //////////////////////////////////////
    //////////////////////////////////////
    function submitTransfer(bytes32 _tokenSymbol, address _dest, uint256 _amount) public returns (uint) {
        checkAllowed(msg.sender);
        require(_amount > 0);

        bytes32 userName = getMappedName(msg.sender);
        address walletAdr = getBindedWalletAddress(userName);
        require(walletAdr != address(0));

        address tokenContractAdr = getDBModule("gm-token").getTokenAddress(_tokenSymbol);
        uint amount = DBNode(walletAdr).executeTransaction(tokenContractAdr, _dest, _amount);
        return amount;
    }

    //------2018-07-18: new verstion: YYA------ 
    function getUserWalletAddress() public view returns (address) {
        checkAllowed(msg.sender);
        bytes32 userName = getMappedName(msg.sender);
        return getBindedWalletAddress(userName); 
    }

    function numOfTokens() public view returns (uint) {
        return getDBModule("gm-token").numOfTokens();
    }

    function getTokenBalanceInfoBySymbol(bytes32 _symbol) public view returns (string) {
        checkAllowed(msg.sender);

        bytes32 userName = getMappedName(msg.sender);
        bytes32 status;
        bytes32 tokenName;
        bytes32 tokenSymbol;
        uint tokenDecimals;
        address tokenAdr;
        address userWalletAdr;
        uint tokenBalance;
        uint lockedAmount;

        userWalletAdr = getBindedWalletAddress(userName);

        (status, tokenName, tokenSymbol, tokenDecimals, tokenAdr) = getDBModule("gm-token").getTokenInfoBySymbol(_symbol);

        tokenBalance = DBNode(userWalletAdr).getBalance(tokenAdr);
        lockedAmount = DBNode(userWalletAdr).getLockedAmount(tokenAdr);

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        str = PlatString.append(str, "locked=",      PlatString.uintToString(lockedAmount),   "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        return str;
    }

    function getTokenBalanceInfoByIndex(uint _index) public view returns (string) {
        checkAllowed(msg.sender);

        bytes32 userName = getMappedName(msg.sender);
        bytes32 status;
        bytes32 tokenName;
        bytes32 tokenSymbol;
        uint tokenDecimals;
        address tokenAdr;
        address userWalletAdr;
        uint tokenBalance;
        uint lockedAmount;

        userWalletAdr = getBindedWalletAddress(userName);

        (status, tokenName, tokenSymbol, tokenDecimals, tokenAdr) = getDBModule("gm-token").getTokenInfoByIndex(_index);

        tokenBalance = DBNode(userWalletAdr).getBalance(tokenAdr);
        lockedAmount = DBNode(userWalletAdr).getLockedAmount(tokenAdr);

        string memory str ="";
        str = PlatString.append(str, "info?status=", PlatString.bytes32ToString(status),      "&");
        str = PlatString.append(str, "symbol=",      PlatString.bytes32ToString(tokenSymbol), "&");
        str = PlatString.append(str, "balance=",     PlatString.uintToString(tokenBalance),   "&");
        str = PlatString.append(str, "locked=",      PlatString.uintToString(lockedAmount),   "&");
        str = PlatString.append(str, "adr=",         PlatString.addressToString(tokenAdr),    "&");
        return str;
    }
    
    function getUserTransactionByIndex(uint _index) public view returns (string) {
        checkAllowed(msg.sender);
        
        bytes32 userName = getMappedName(msg.sender);
        address walletAdr = getBindedWalletAddress(userName);

        require(_index < DBNode(walletAdr).numTransactions());
        
        uint tranTime;
        uint isInput;
        uint amount;
        address sender;
        address receiver;
        bytes32 inputTag;

        (tranTime, isInput, amount, sender, receiver) =  DBNode(walletAdr).getTransactionInfoByIndex(_index);

        if (isInput == 1) inputTag = "true";
        else inputTag = "false";

        string memory str ="";
        str = PlatString.append(str, "info?time=", PlatString.uintToString(tranTime),    "&");
        str = PlatString.append(str, "input=",     PlatString.bytes32ToString(inputTag), "&");
        str = PlatString.append(str, "amout=",     PlatString.uintToString(amount),      "&");
        str = PlatString.append(str, "sender=",    PlatString.addressToString(sender),   "&");
        str = PlatString.append(str, "receiver=",  PlatString.addressToString(receiver), "&");
        return str;
    }
 
    function getZSCModuleAddresses() public view returns (string) {
        address dbAdr = address(getDBDatabase(dbName_));
        address factoryProAdr = address(getDBFactory("provider"));
        address factoryRecAdr = address(getDBFactory("receiver"));
        address factoryTmpAdr = address(getDBFactory("template"));
        address factoryAgrAdr = address(getDBFactory("agreement"));
        address factoryWalletAdv = address(getDBFactory("wallet-adv"));
        address tokenContractAdr = getDBModule("gm-token").getTokenAddress("ZSC");
        address tokenManager = address(getDBModule("gm-token"));

        string memory str ="adrs?";
        str = PlatString.append(str, "token-adr=",      PlatString.addressToString(tokenContractAdr), "&");
        str = PlatString.append(str, "log-recorder=", PlatString.addressToString(logRecorder_),     "&");
        str = PlatString.append(str, "adm-base=",     PlatString.addressToString(bindedAdm_),       "&");
        str = PlatString.append(str, "control-apis=", PlatString.addressToString(address(this)),    "&");
        str = PlatString.append(str, "database=",     PlatString.addressToString(dbAdr),            "&");
        str = PlatString.append(str, "factory-provider=",    PlatString.addressToString(factoryProAdr),    "&");
        str = PlatString.append(str, "factory-receiver=",    PlatString.addressToString(factoryRecAdr),    "&");
        str = PlatString.append(str, "factory-template=",    PlatString.addressToString(factoryTmpAdr),    "&");
        str = PlatString.append(str, "factory-agreement=",   PlatString.addressToString(factoryAgrAdr),    "&");
        str = PlatString.append(str, "wallet-adv=",     PlatString.addressToString(factoryWalletAdv),  "&");
        str = PlatString.append(str, "token-manager=",  PlatString.addressToString(tokenManager),  "&");
        return str;
    }   

    function getPoSModuleAddresses() public view returns (string) {
        address dbAdr = address(getDBDatabase(dbName_));
        address factoryWalletAdv = address(getDBFactory("wallet-adv"));
        address tokenContractAdr = getDBModule("gm-token").getTokenAddress("ZSC");
        address tokenManager = address(getDBModule("gm-token"));
        address posManager = address(getDBModule("gm-pos"));

        string memory str ="adrs?";
        str = PlatString.append(str, "token-adr=",      PlatString.addressToString(tokenContractAdr), "&");
        str = PlatString.append(str, "log-recorder=",   PlatString.addressToString(logRecorder_),     "&");
        str = PlatString.append(str, "adm-base=",       PlatString.addressToString(bindedAdm_),       "&");
        str = PlatString.append(str, "control-apis=",   PlatString.addressToString(address(this)),    "&");
        str = PlatString.append(str, "database=",       PlatString.addressToString(dbAdr),            "&");
        str = PlatString.append(str, "wallet-adv=",     PlatString.addressToString(factoryWalletAdv),  "&");
        str = PlatString.append(str, "token-manager=",  PlatString.addressToString(tokenManager),  "&");
        str = PlatString.append(str, "pos-manager=",    PlatString.addressToString(posManager),  "&");
        return str;
    }   
}
