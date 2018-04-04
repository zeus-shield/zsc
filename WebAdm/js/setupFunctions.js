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


function sF_initSystemModule(module, extra, adrs, hashID) {
    var AdmAdvAdr = adrs[0];
    var DBDatabaseAdr = adrs[1];
    var FactoryProAdr = adrs[2];
    var FactoryTmpAdr = adrs[3];
    var FactoryAgrAdr = adrs[4];
    var ControlApisAdr = adrs[5];

    if (module == "AdmAdv") {

    } else if (module == "DBDatabase") {
        sF_initDatabase(DBDatabaseAdr, FactoryProAdr, FactoryTmpAdr, FactoryAgrAdr, ControlApisAdr, hashID);
    } else if (module == "ControlApisAdv") {
        if (extra == "DBDatabase") {
            sF_setDatabaseAdr(DBDatabaseAdr, ControlApisAdr, hashID);
        } else if (extra == "AdmAdv") {
            sF_setAdm(AdmAdvAdr, ControlApisAdr, hashID);
        }else {
            var factoryAdr;
            if (extra == "FactoryPro") factoryAdr = FactoryProAdr;
            else if (extra == "FactoryTmp") factoryAdr = FactoryTmpAdr;
            else if (extra == "FactoryAgr") factoryAdr = FactoryAgrAdr;
            sF_addFactory(extra, factoryAdr, ControlApisAdr, hashID + extra);
        }
    } else {
        var factoryAdr;
        if (module == "FactoryPro") factoryAdr = FactoryProAdr;
        else if (module == "FactoryTmp") factoryAdr = FactoryTmpAdr;
        else if (module == "FactoryAgr") factoryAdr = FactoryAgrAdr;

        sF_initFactory(factoryAdr, DBDatabaseAdr, ControlApisAdr, hashID + module);
    }
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


function sF_initFactory(FactoryAdr, DBDatabaseAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("FactoryPro"));
    var myFactoryPro= myContract.at(FactoryAdr);
    myFactoryPro.initFactory(ControlApisAdr, DBDatabaseAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

function sF_setAdm(AdmAdvAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(ControlApisAdr);
    myControlApi.setAdm(AdmAdvAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
} 

function sF_setDatabaseAdr(DBDatabaseAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(ControlApisAdr);
    myControlApi.setDatabaseAdr(DBDatabaseAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

function sF_addFactory(factoryType, FactoryAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(ControlApisAdr);
    myControlApi.addFactory(factoryType, FactoryAdr, {from: web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  


    function setAdm(address _adr) public only_owner {



////////////////
var sF_logerModuleAdr;

function sF_changeLogerModule(adr) {
    sF_logerModuleAdr = adr;
}

////////////////////////////////////////////
function sF_setControlAbisAdvAbi(ControlApisAdr,  hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("ControlApisAdv"));
    var myControlApi= myContract.at(ControlApisAdr);
    var account = web3.eth.accounts[0];
    var data = cC_getContractAbiString('ControlApisAdv');

    myControlApi.setFullAbi(data, {from: account, gas: 5000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  



