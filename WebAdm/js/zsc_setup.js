/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZscSetup(logRecorderAdr, adrs, abi) {
    this.RecorderAdr = logRecorderAdr;
    this.AdmAdvAdr = adrs[0];
    this.PosAdvAdr = adrs[1];
    this.WalletManagerAdr = adrs[2];
    this.DBDatabaseAdr = adrs[3];
    this.FactoryProAdr = adrs[4];
    this.FactoryRecAdr = adrs[5];
    this.FactoryTmpAdr = adrs[6];
    this.FactoryAgrAdr = adrs[7];
    this.ControlApisAdr = adrs[8];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZscSetup.prototype.showHashResult = function(elementID, hash){
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

ZscSetup.prototype.registerListenerToLogRecorder = function(listener, listenerName, hashID) {
    var myContract = web3.eth.contract(cC_getContractAbi("LogRecorder"));
    var myLogRecorder = myContract.at(this.RecorderAdr);
    var account = web3.eth.accounts[0];

    myLogRecorder.registerListener(listener, listenerName, {from:account, gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashID, result);
        else console.log("error: " + error);
    });
}  


