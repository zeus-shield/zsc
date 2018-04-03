/*
Copyright (c) 2018 ZSC Dev Team
*/

function sF_showHashResult(elementID, hash) {
    web3.eth.getTransactionReceipt(hash, 
    function(error, result){ 
        if(!error) {
            var show;
            if (result == null) {
                show =  "(pending)" + hash ;
                sF_showHashResult(elementID, hash);
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

function sF_registerListenerToLogRecorder(logRecorderAdr, listener, listenerName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("LogRecorder"));
    var myLogRecorder = myContract.at(logRecorderAdr);
    var account = web3.eth.accounts[0];

    myLogRecorder.registerListener(listener, listenerName, {from:account, gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

function sF_setLogRecorderToListener(logRecorderAdr, listener,listenerName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi(listenerName));
    var myListener = myContract.at(listener);
    var account = web3.eth.accounts[0];

    myListener.setLogRecorder(logRecorderAdr, {from:account, gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  


function sF_initSystemModule(module, adrs, hashID) {
    var AdmAdv = adrs[0];
    var DBDatabaseAdr = adrs[1];
    var FactoryProAdr = adrs[2];
    var FactoryTmpAdr = adrs[3];
    var FactoryAgrAdr = adrs[4];
    var ControlApisAdr = adrs[5];

    if (module == "DBDatabase") sF_initDatabase(AdmAdv, DBDatabaseAdr, FactoryProAdr, FactoryTmpAdr, FactoryAgrAdr, ControlApisAdr, hashID);
    else if (module == "FactoryPro") sF_initFactory(module, FactoryProAdr, DBDatabaseAdr, ControlApisAdr, hashID);
    else if (module == "FactoryTmp") sF_initFactory(module, FactoryTmpAdr, DBDatabaseAdr, ControlApisAdr, hashID);
    else if (module == "FactoryAgr") sF_initFactory(module, FactoryAgrAdr, DBDatabaseAdr, ControlApisAdr, hashID);
    else if (module == "ControlApisAdv") sF_addFactory(DBDatabaseAdr, FactoryProAdr, ControlApisAdr, hashID);
}


function sF_initDatabase(DBDatabaseAdr, FactoryProAdr, FactoryTmpAdr, FactoryAgrAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("DBDatabase"));
    var myDatabase = myContract.at(DBDatabaseAdr);
    myDatabase.initDatabase([FactoryProAdr, FactoryTmpAdr, FactoryAgrAdr], ControlApisAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  


function sF_initFactory(factoryName, FactoryAdr, DBDatabaseAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("FactoryPro"));
    var myFactoryPro= myContract.at(FactoryAdr);
    myFactoryPro.initFactory(ControlApisAdr, DBDatabaseAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

function sF_setDatabaseAdr(DBDatabaseAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(ControlApisAdr);
    myControlApi.setDatabaseAdr(DBDatabaseAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  


////////////////
var sF_logerModuleAdr;

function sF_changeLogerModule(adr) {
    sF_logerModuleAdr = adr;
}


