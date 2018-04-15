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
    this.FactoryProAdr = adrs[5];
    this.FactoryRecAdr = adrs[6];
    this.FactoryTmpAdr = adrs[7];
    this.FactoryAgrAdr = adrs[8];
    this.ControlApisAdvAdr = adrs[9];
    this.zscTokenAdr = zscTokenAdr;
    this.account = web3.eth.accounts[0];
}

ZSCSetup.prototype.showHashResult = function(elementID, hash){
    web3.eth.getTransactionReceipt(hash, 
    function(error, result){ 
        if(!error) {
            var show;
            if (result == null) {
                show =  "(pending)" + hash ;
                this.howHashResult(elementID, hash, func);
            } else {
                if (result.status == 0) {
                    show = "(failure)" + hash;
                } else {
                    show = "(succeeded)" + hash ;
                }
            }
            document.getElementById(elementID).innerText = show;
        } else {
            console.log("error: " + error);
        }
    });
} 

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

ZSCSetup.prototype.initSystemModule = function(module, extra, hashID) {
    if (module == "AdmAdv") {
    } else if (module == "PosAdv") {
        this.initPosAdv(module, hashID);
    } else if (module == "WalletManager") {
        this.initWalletManager(module, hashID);
    } else if (module == "SimulatorManager") {
        this.initSimulatorManager(module, hashID);
    } else if (module == "DBDatabase") {
        this.initDatabase(module, hashID);
    } else if (module == "ControlApisAdv") {
        if (extra == "SystemModules") {
            this.setSystemModules(module, hashID);
        } else {
            var factoryAdr;
            if (extra == "FactoryPro") factoryAdr = FactoryProAdr;
            else if (extra == "FactoryRec") factoryAdr = FactoryRecAdr;
            else if (extra == "FactoryTmp") factoryAdr = FactoryTmpAdr;
            else if (extra == "FactoryAgr") factoryAdr = FactoryAgrAdr;
            this.addFactory("ControlApisAdv", extra, factoryAdr, hashID + extra);
        }
    } else {
        var factoryAdr;
        if (module == "FactoryPro") factoryAdr = FactoryProAdr;
        else if (module == "FactoryRec") factoryAdr = FactoryRecAdr;
        else if (module == "FactoryTmp") factoryAdr = FactoryTmpAdr;
        else if (module == "FactoryAgr") factoryAdr = FactoryAgrAdr;

        this.initFactory(module, factoryAdr, hashID + module);
    }
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

ZSCSetup.prototype.initFactory = function(FactoryModule, FactoryAdr， hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(FactoryModule));
    var myFactory= myContract.at(FactoryAdr);
    myFactory.initFactory(this.ControlApisAdr, this.DBDatabaseAdr, {from: web3.eth.accounts[0], gas: 9000000},
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

ZSCSetup.prototype.addFactory = function(abiName, factoryType, FactoryAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myControlApi= myContract.at(this.ControlApisAdr);
    myControlApi.addFactory(factoryType, FactoryAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) this.showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}

