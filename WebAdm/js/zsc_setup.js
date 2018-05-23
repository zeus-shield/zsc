/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCSetup(logRecorderAdr, zscTokenAdr, adrs) {
    this.RecorderAdr = logRecorderAdr;
    this.DBDatabaseAdr = adrs[0];
    this.AdmAdvAdr = adrs[1];
    this.PosAdvAdr = adrs[2];
    this.WalletManagerAdr = adrs[3];
    this.SimulatorManagerAdr = adrs[4];
    this.DatabaseManagerAdr = adrs[5];
    this.FactoryManagerAdr = adrs[6];
    this.FactoryProAdr = adrs[7];
    this.FactoryRecAdr = adrs[8];
    this.FactoryTmpAdr = adrs[9];
    this.FactoryAgrAdr = adrs[10];
    this.ControlApisAdvAdr = adrs[11];
    this.zscTokenAdr = zscTokenAdr;
    this.account = web3.eth.accounts[0];
}

ZSCSetup.prototype = new ZSCJsBase();

ZSCSetup.prototype.registerListenerToLogRecorder = function(listener, listenerName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("LogRecorder"));
    var myLogRecorder = myContract.at(this.RecorderAdr);
    var account = web3.eth.accounts[0];

    myLogRecorder.registerListener(listener, listenerName, {from:account, gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.setLogRecorderToListener = function(listener,listenerName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(listenerName));
    var myListener = myContract.at(listener);
    var account = web3.eth.accounts[0];

    myListener.setLogRecorder(logRecorderAdr, {from:account, gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.initSystemModule = function(module, hashID) {
    if (module == "AdmAdv") {
    } else if (module == "PosAdv") {
        this.initPosAdv(module, hashID);
    } else if (module == "WalletManager") {
        this.initWalletManager(module, hashID);
    } else if (module == "SimulatorManager") {
        this.initSimulatorManager(module, hashID);
    } else if (module == "FacotryManager") {
        this.initFactoryManager(module, hashID);
    } else if (module == "DBDatabase") {
        this.initDatabase(module, hashID);
    } else if (module == "ControlApisAdv") {
        this.setSystemModules(module, hashID);
    } else {
        var factoryAdr;
        if (module == "FactoryPro") factoryAdr = FactoryProAdr;
        else if (module == "FactoryRec") factoryAdr = FactoryRecAdr;
        else if (module == "FactoryTmp") factoryAdr = FactoryTmpAdr;
        else if (module == "FactoryAgr") factoryAdr = FactoryAgrAdr;

        this.initFactory(module, factoryAdr, hashID + module);
    }
}

////////////////////////////////////////////
ZSCSetup.prototype.setControlAbisAdvAbi = function(hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(AdmAdv));
    var myAdmAdv = myContract.at(this.AdmAdvAdr);

    var data = cC_getContractAbiString('ControlApisAdv');

    myAdmAdv.setControlApisFullAbi(cC_getContractAbi(abiName), 
        {from:web3.eth.accounts[0], gas: 9000000},
        function(error, result) { 
            if(!error) this.showHashResult(hashID, result);
            else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.addFactoryModule = function(module, hashID) {
   var factoryAdr;
   var factoryType;
   if (extra == "FactoryPro") {
       factoryAdr = this.FactoryProAdr;
       factoryType = "provider";
   } else if (extra == "FactoryRec") {
       factoryAdr = this.FactoryRecAdr;
       factoryType = "receiver";
   } else if (extra == "FactoryTmp") {
       factoryAdr = this.FactoryTmpAdr;
       factoryType = "template";
   } else if (extra == "FactoryAgr") {
       factoryAdr = this.FactoryAgrAdr;
       factoryType = "agreement";
   }
   this.addFactory("FactoryManagerAdr", factoryType, factoryAdr, hashID + extra);
}

ZSCSetup.prototype.initPosAdv = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myPosAdv = myContract.at(this.PosAdvAdr);
    myPosAdv.initPos(this.ControlApisAdvAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initWalletManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myPosAdv = myContract.at(this.WalletManagerAdr);
    myPosAdv.initPos(this.ControlApisAdr, this.DBDatabaseAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initSimulatorManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myPosAdv = myContract.at(this.SimulatorManagerAdr);
    myPosAdv.initPos(this.ControlApisAdr, this.DBDatabaseAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initFactoryManager = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myFactoryGM = myContract.at(this.FactoryManagerAdr);
    myFactoryGM.initFactoryManager(this.ControlApisAdr, this.DBDatabaseAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}

ZSCSetup.prototype.initDatabase = function(abiName, hashID) {
    var factories = [this.FactoryProAdr, this.FactoryRecAdr, this.FactoryTmpAdr, this.FactoryAgrAdr];
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myDatabase = myContract.at(DBDatabaseAdr);

    //ddress _controller, address _posAdv, address _walletManager, address[] _factories
    myDatabase.initDatabase(this.ControlApisAdr, this.PosAdvAdr, this.WalletManagerAdr, factories, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.initFactory = function(FactoryModule, FactoryAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(FactoryModule));
    var myFactory= myContract.at(FactoryAdr);
    myFactory.initFactory(this.FactoryManagerAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

ZSCSetup.prototype.setSystemModules = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myControlApi= myContract.at(this.ControlApisAdr);

    //setSystemModules(address _adm, address _db, address _walletGM, address _simulatorGM, address _pos, address _zscToken)
    myControlApi.setSystemModules(this.AdmAdvAdr, this.DBDatabaseAdr, this.WalletManagerAdr, this.SimulatorManagerAdr, this.PosAdvAdr, this.zscTokenAdr,
    {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
} 

ZSCSetup.prototype.addFactoryModule = function(abiName, factoryType, FactoryAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myFactoryGM = myContract.at(this.FactoryManagerAdr);
    myFactoryGM.addFactory(factoryType, FactoryAdr, 
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) this.showHashResult(hashID, result);
            else console.log("error: " + error);
        });
}

ZSCSetup.prototype.addDatabaseModule = function(abiName, databaseName, databaseAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myDatabaseGM = myContract.at(this.DatabaseManagerAdr);
    myDatabaseGM.addDatabase(databaseName, databaseAdr, 
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) this.showHashResult(hashID, result);
            else console.log("error: " + error);
        });
}

