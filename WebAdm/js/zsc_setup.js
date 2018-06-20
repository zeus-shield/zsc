/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCSetup(logRecorderAdr, timerAdr, zscTokenAdr, adrs) {
    /*
    "SystemOverlayer", "ControlApisAdv", "AdmAdv", "PosAdv", "WalletManager", "SimulatorManager", "DatabaseManager", "FactoryManager",
     "DBDatabase", "FactoryPro", "FactoryRec", "FactoryStaker" , "FactoryTmp",  "FactoryAgr",  "FactoryWalletEth", "FactoryWalletErc20"
    */
    /*
    this.RecorderAdr = logRecorderAdr;
    this.AdmAdvAdr = adrs[0];
    this.PosAdvAdr = adrs[1];
    this.WalletManagerAdr = adrs[2];
    this.SimulatorManagerAdr = adrs[3];
    this.DatabaseManagerAdr  = adrs[4];
    this.FactoryManagerAdr   = adrs[5];
    this.SystemOverlayerAdr  = adrs[6];
    this.ControlApisAdvAdr   = adrs[7];
    this.DBDatabaseAdr = adrs[8];
    this.FactoryProAdr = adrs[9];
    this.FactoryRecAdr = adrs[10];
    this.FactoryTmpAdr = adrs[11];
    this.FactoryAgrAdr = adrs[12];
    this.FactoryWalletEthAdr   = adrs[13];
    this.FactoryWalletErc20Adr = adrs[14];
    this.zscTokenAdr = zscTokenAdr;
    this.account = web3.eth.accounts[0];
    */

    /*
    "AdmAdv", "DBDatabase", "FactoryPro", "FactoryRec", "FactoryTmp",  
    "FactoryAgr",  "FactoryWalletEth", "FactoryWalletErc20", "ControlApisAdv");
    */
    this.RecorderAdr = logRecorderAdr;
    this.TimerAdr = timerAdr;
    this.zscTokenAdr = zscTokenAdr;
    this.AdmAdvAdr = adrs[0];
    this.DBDatabaseAdr = adrs[1];
    this.FactoryProAdr = adrs[2];
    this.FactoryRecAdr = adrs[3];
    this.FactoryTmpAdr = adrs[4];
    this.FactoryAgrAdr = adrs[5];
    this.FactoryWalletErc20Adr = adrs[6];
    this.ControlApisAdvAdr   = adrs[7];
    this.account = web3.eth.accounts[0];
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(700);
}

ZSCSetup.prototype = new ZSCJsBase();

ZSCSetup.prototype.registerListenerToLogRecorder = function(listener, listenerName, hashID, func) {
    var myContract = web3.eth.contract(cC_getContractAbi("LogRecorder"));
    var myLogRecorder = myContract.at(this.RecorderAdr);

    myLogRecorder.registerListener(listener, listenerName, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result) { 
            if(!error) { 
                cC_showHashResultTest(hashID, result, func);
            } else {
                console.log("error: " + error);
            }
        });
}  

ZSCSetup.prototype.setLogRecorderToListener = function(listener,listenerName, hashID, func) {
    var myContract = web3.eth.contract(cC_getContractAbi(listenerName));
    var myListener = myContract.at(listener);

    myListener.setLogRecorderAndTimer(this.RecorderAdr, this.TimerAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, func);
            else console.log("error: " + error);
        });
}  

ZSCSetup.prototype.initSystemModule = function(module, hashID) {
    if (module == "TestToken") {
        this.initTestZSCToken(hashID);

    } else if (module == "AdmAdv") {
        this.initAdmAdv(hashID);

    } else if (module == "PosAdv") {
        this.initPosAdv(module, hashID);

    } else if (module == "WalletManager") {
        this.initWalletManager(module, hashID);

    } else if (module == "SimulatorManager") {
        this.initSimulatorManager(module, hashID);

    } else if (module == "FactoryManager") {
        this.initFactoryManager(module, hashID);

    } else if (module == "DatabaseManager") {
        this.initDatabaseManager(module, hashID);

    } else if (module == "DBDatabase") {
        this.initDatabase(module, hashID);

    } else if (module == "ControlApisAdv") {
        this.initControlApis(module, hashID);

    } else if (module == "SystemOverlayer") {
        this.initSystemOverlayer(module, hashID);

    } else {
        var factoryAdr;
        if (module == "FactoryPro") factoryAdr = this.FactoryProAdr;
        else if (module == "FactoryRec") factoryAdr = this.FactoryRecAdr;
        else if (module == "FactoryTmp") factoryAdr = this.FactoryTmpAdr;
        else if (module == "FactoryAgr") factoryAdr = this.FactoryAgrAdr;
        else if (module == "FactoryWalletErc20") factoryAdr = this.FactoryWalletErc20Adr;
        else if (module == "FactoryWalletEth") factoryAdr = this.FactoryWalletEthAdr;

        this.initFactory(module, factoryAdr, hashID);
    }
}

////////////////////////////////////////////
ZSCSetup.prototype.setControlAbisAdvAbi = function(hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("AdmAdv"));
    var myAdmAdv = myContract.at(this.AdmAdvAdr);

    var str = cC_getContractAbiString("ControlApisForUser");
    myAdmAdv.setControlApisFullAbi(str, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result) { 
            if(!error) cC_showHashResultTest(hashID, result, function(){console.log("ok");});
            else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.setZSCAmountToUser = function(amount, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi = myContract.at(this.ControlApisAdvAdr);

    myControlApi.setZSCAmountToUser(amount, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result) { 
            if(!error) cC_showHashResultTest(hashID, result, function(){console.log("ok");});
            else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.addFactoryModule = function(factModule, hashID) {
    var factoryAdr;
    var factoryType;
    if (factModule == "FactoryPro") {
        factoryAdr = this.FactoryProAdr;
        factoryType = "provider";
    } else if (factModule == "FactoryRec") {
        factoryAdr = this.FactoryRecAdr;
        factoryType = "receiver";
    } else if (factModule == "FactoryStaker") {
        factoryAdr = this.FactoryRecAdr;
        factoryType = "staker";
    } else if (factModule == "FactoryTmp") {
        factoryAdr = this.FactoryTmpAdr;
        factoryType = "template";
    } else if (factModule == "FactoryAgr") {
        factoryAdr = this.FactoryAgrAdr;
        factoryType = "agreement";
    } else if (factModule == "FactoryWalletEth") {
        factoryAdr = this.FactoryWalletEthAdr;
        factoryType = "wallet-eth";
    } else if (factModule == "FactoryWalletErc20") {
        factoryAdr = this.FactoryWalletErc20Adr;
        factoryType = "wallet-erc20";
    }
    this.addFactory(factoryType, factoryAdr, hashID);
}

ZSCSetup.prototype.addGMModule = function(gmModule, hashID) {
    var gmAdr;
    var gmType;
    if (gmModule == "PosAdv") {
        gmAdr = this.PosAdvAdr;
        gmType = "pos-gm";
    } else if (gmModule == "WalletManager") {
        gmAdr = this.WalletManagerAdr;
        gmType = "wallet-gm";
    } else if (gmModule == "SimulatorManager") {
        gmAdr = this.SimulatorManagerAdr;
        gmType = "simulator-gm";
    }
    this.addGM(gmType, gmAdr, hashID);
}

ZSCSetup.prototype.initTestZSCToken = function(hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("TestToken"));
    var myTestToken = myContract.at(this.zscTokenAdr);

    myTestToken.allocate(this.ControlApisAdvAdr, 100 * 1000 * 1000 * Math.pow(10, 18), 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCSetup.prototype.initAdmAdv = function(hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("AdmAdv"));
    var myAdmAdv = myContract.at(this.AdmAdvAdr);

    myAdmAdv.initAdm(this.zscTokenAdr, this.ControlApisAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCSetup.prototype.initDatabase = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myDatabase = myContract.at(this.DBDatabaseAdr);

    myDatabase.initDatabase(this.ControlApisAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}  

ZSCSetup.prototype.initFactory = function(FactoryModule, FactoryAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(FactoryModule));
    var myFactory= myContract.at(FactoryAdr);
    myFactory.initFactory(this.ControlApisAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}  

ZSCSetup.prototype.addDatabase = function(databaseName, databaseAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(this.ControlApisAdvAdr);

    myControlApi.addSystemComponent("database", databaseName, databaseAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}

ZSCSetup.prototype.addFactory= function(factoryType, FactoryAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(this.ControlApisAdvAdr);

    myControlApi.addSystemComponent("factory", factoryType, FactoryAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}

ZSCSetup.prototype.initControlApis = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myControlApi= myContract.at(this.ControlApisAdvAdr);

    //setSystemModules(address _adm, address _posGM, address _systemOverlayer, address _zscToken) public {
    myControlApi.initControlApis(this.zscTokenAdr, this.AdmAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

/*
ZSCSetup.prototype.initPosAdv = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myPosAdv = myContract.at(this.PosAdvAdr);
    myPosAdv.setSysOverlayer(this.SystemOverlayerAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashID, result, function(){});
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initWalletManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myWalletGM = myContract.at(this.WalletManagerAdr);
    myWalletGM.setSysOverlayer(this.SystemOverlayerAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashID, result, function(){});
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initSimulatorManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var mySimulatorGM = myContract.at(this.SimulatorManagerAdr);
    mySimulatorGM.setSysOverlayer(this.SystemOverlayerAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashID, result, function(){});
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initFactoryManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myFactoryGM = myContract.at(this.FactoryManagerAdr);
    myFactoryGM.setSysOverlayer(this.SystemOverlayerAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashID, result, function(){});
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initDatabaseManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myDatabaseGM = myContract.at(this.DatabaseManagerAdr);
    myDatabaseGM.setSysOverlayer(this.SystemOverlayerAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashID, result, function(){});
        else console.log("error: " + error);
    });
}


ZSCSetup.prototype.initSystemOverlayer = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var mySystemOverlayer= myContract.at(this.SystemOverlayerAdr);

    //initSysOverlayer(address _controller, address _databaseGM, address _factoryGM) public {
    mySystemOverlayer.initSysOverlayer(this.ControlApisAdvAdr, this.DatabaseManagerAdr, this.FactoryManagerAdr,
    {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashID, result, function(){});
        else console.log("error: " + error);
    });
} 
ZSCSetup.prototype.addGM = function(gmName, gmAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("SystemOverlayer"));
    var myOverlayer = myContract.at(this.SystemOverlayerAdr);

    myOverlayer.addComponent("module", gmName, gmAdr, 
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}
*/

