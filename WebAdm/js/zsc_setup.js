/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCSetup(logRecorderAdr, testTokenAdr, adrs) {
    /*
    "AdmAdv",  "DBDatabase", 
    "FactoryPro", "FactoryRec", "FactoryTmp", "FactoryAgr",  "FactoryWalletAdv",
    "TokenManager", "PosManager",
    "ControlApisAdv");
    */
    this.RecorderAdr = logRecorderAdr;
    this.testTokenAdr = testTokenAdr;
    this.TimerAdr = 0x0;
    this.AdmAdvAdr     = adrs[0];
    this.DBDatabaseAdr = adrs[1];
    //this.FactoryProAdr = adrs[2];
    //this.FactoryRecAdr = adrs[3];
    //this.FactoryStakerAdr = adrs[4];
    //this.FactoryTmpAdr = adrs[5];
    //this.FactoryAgrAdr = adrs[6];
    this.FactoryWalletAdvAdr = adrs[2];
    this.TokenManagerAdr     = adrs[3];
    this.PosManagerAdr       = adrs[4];
    this.ControlApisAdvAdr   = adrs[5];
    this.account = web3.eth.accounts[0];
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
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
        this.initTestToken(hashID);

    } else if (module == "AdmAdv") {
        this.initAdmAdv(hashID);

    } else if (module == "TokenManager") {
        this.initTokenManager(module, hashID);

    } else if (module == "PosManager") {
        this.initPosManager(module, hashID);

    } else if (module == "FactoryManager") {
        this.initFactoryManager(module, hashID);

    } else if (module == "DatabaseManager") {
        this.initDatabaseManager(module, hashID);

    } else if (module == "DBDatabase") {
        this.initDatabase(module, hashID);

    } else if (module == "ControlApisAdv") {
        this.initControlApis(module, hashID);

    } else {
        var factoryAdr;
        if (module == "FactoryPro") factoryAdr = this.FactoryProAdr;
        else if (module == "FactoryRec") factoryAdr = this.FactoryRecAdr;
        else if (module == "FactoryStaker") factoryAdr = this.FactoryStakerAdr;
        else if (module == "FactoryTmp") factoryAdr = this.FactoryTmpAdr;
        else if (module == "FactoryAgr") factoryAdr = this.FactoryAgrAdr;
        else if (module == "FactoryWalletAdv") factoryAdr = this.FactoryWalletAdvAdr;

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


ZSCSetup.prototype.setPosPaymentReceiver = function(hashID, receiver) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi = myContract.at(this.ControlApisAdvAdr);

    myControlApi.setPaymentReceiver(receiver, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){console.log("ok");});
            else console.log("error: " + error);
        });
} 

ZSCSetup.prototype.setTokenAmountToUser = function(ethAmount, tokenSymbol, tokenAmount, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi = myContract.at(this.ControlApisAdvAdr);

    myControlApi.setPreallocateAmountToTester(ethAmount, tokenSymbol, tokenAmount,
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
        factoryAdr = this.FactoryStakerAdr;
        factoryType = "staker";
    } else if (factModule == "FactoryTmp") {
        factoryAdr = this.FactoryTmpAdr;
        factoryType = "template";
    } else if (factModule == "FactoryAgr") {
        factoryAdr = this.FactoryAgrAdr;
        factoryType = "agreement";
    } else if (factModule == "FactoryWalletAdv") {
        factoryAdr = this.FactoryWalletAdvAdr;
        factoryType = "wallet-adv";
    } else {
        return;
    }
    this.addFactory(factoryType, factoryAdr, hashID);
}

ZSCSetup.prototype.addGmModule = function(gmModule, hashID) {
    var gmAdr;
    var gmType;
    if (gmModule == "TokenManager") {
        gmAdr = this.TokenManagerAdr;
        gmType = "gm-token";
    } else if (gmModule == "PosManager") {
        gmAdr = this.PosManagerAdr;
        gmType = "gm-pos";
    }

    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi = myContract.at(this.ControlApisAdvAdr);

    myControlApi.addSystemComponent("module", gmType, gmAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });

}

ZSCSetup.prototype.initTestToken = function(hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("TestToken"));
    var myTestToken = myContract.at(this.testTokenAdr);

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

    myAdmAdv.initAdm(this.ControlApisAdvAdr, 
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
    myControlApi.initControlApis(this.AdmAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 


ZSCSetup.prototype.initPosManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myPosAdv = myContract.at(this.PosManagerAdr);
    myPosAdv.initSysGm(this.ControlApisAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}

ZSCSetup.prototype.initTokenManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myTokneGM = myContract.at(this.TokenManagerAdr);
    myTokneGM.initSysGm(this.ControlApisAdvAdr, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
}


