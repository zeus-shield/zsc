
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
    var DBDatabaseAdr = adrs[0];
    var FactoryProAdr = adrs[1];
    var ControlApisAdr = adrs[2];
    if (module == "DBDatabase") sF_initDatabase(DBDatabaseAdr, FactoryProAdr, ControlApisAdr, hashID);
    else if (module == "FactoryPro") sF_initFactoryPro(DBDatabaseAdr, FactoryProAdr, ControlApisAdr, hashID);
    else if (module == "ControlApisAdv") sF_addFactory(DBDatabaseAdr, FactoryProAdr, ControlApisAdr, hashID);
}


function sF_initDatabase(DBDatabaseAdr, FactoryProAdr, ControlApisAdr, hashID) {
    var myContract = web3.eth.contract(getContractAbi("DBDatabase"));
    var myDatabase = myContract.at(DBDatabaseAdr);
    myDatabase.initDatabase([FactoryProAdr], ControlApisAdr, {from:web3.eth.accounts[0], gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  

