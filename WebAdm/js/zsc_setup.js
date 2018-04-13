/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCSetup(logRecorderAdr, zscTokenAdr, adrs) {
    this.RecorderAdr = logRecorderAdr;
    this.AdmAdvAdr = adrs[0];
    this.PosAdvAdr = adrs[1];
    this.WalletManagerAdr = adrs[2];
    this.DBDatabaseAdr = adrs[3];
    this.FactoryProAdr = adrs[4];
    this.FactoryRecAdr = adrs[5];
    this.FactoryTmpAdr = adrs[6];
    this.FactoryAgrAdr = adrs[7];
    this.ControlApisAdvAdr = adrs[8];
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

ZSCSetup.prototype.setLogRecorderToListener(listener,listenerName, hashID) {
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
        sF_initPosAdv(module, hashID);
    } else if (module == "DBDatabase") {
        sF_initWalletManager(module, hashID);
    } else if (module == "DBDatabase") {
        sF_initDatabase(module, hashID);
    } else if (module == "ControlApisAdv") {
        if (extra == "DBDatabase") {
            sF_setDatabaseAdr(module, hashID);
        } else if (extra == "WalletManager") {
            sF_setWalletManager(module, hashID);
        } else if (extra == "AdmAdv") {
            sF_setAdm(module, hashID);
        } else if (extra == "PosAdv") {
            sF_setPos(module, hashID);
        } else {
            var factoryAdr;
            if (extra == "FactoryPro") factoryAdr = FactoryProAdr;
            else if (extra == "FactoryRec") factoryAdr = FactoryRecAdr;
            else if (extra == "FactoryTmp") factoryAdr = FactoryTmpAdr;
            else if (extra == "FactoryAgr") factoryAdr = FactoryAgrAdr;
            sF_addFactory("ControlApisAdv", extra, factoryAdr, hashID + extra);
        }
    } else {
        var factoryAdr;
        if (module == "FactoryPro") factoryAdr = FactoryProAdr;
        else if (module == "FactoryRec") factoryAdr = FactoryRecAdr;
        else if (module == "FactoryTmp") factoryAdr = FactoryTmpAdr;
        else if (module == "FactoryAgr") factoryAdr = FactoryAgrAdr;

        sF_initFactory(module, factoryAdr, hashID + module);
    }
}

ZSCSetup.prototype.initPosAdv = function(abiName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(abiName));
    var myPosAdv = myContract.at(this.PosAdvAdr);
    myPosAdv.initPos(this.ControlApisAdvAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}


