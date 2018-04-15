/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPrintLog(logRecorderAdr) {
    this.logRecorderAdr = logRecorderAdr;
    this.logerModuleAdr = 0;
    this.logMap = new Map();
    this.logIndexMap = new Map();
    this.account = web3.eth.accounts[0];
}

ZSCPrintLog.prototype.changeLogerModule = function(adr) {
    this.logerModuleAdr = adr;
}

ZSCPrintLog.prototype.refreshGetLog = function(logRecorderAdr, adr, elementID) {
    var myContract = web3.eth.contract(cC_getContractAbi("LogRecorder"));
    var myLogRecorder = myContract.at(this.logRecorderAdr);
    var account = this.account;

    var text = this.logMap.get(adr);
    var index = this.logIndexMap.get(adr);

    myLogRecorder.printLog(adr, index,
    function(error, result){ 
        if(!error) {
            if (result != "null") {
                //console.log(result);
                this.logMap.set(adr, text + result + "\n");
                index++;
                sthis.logIndexMap.set(adr, index);
            }
            document.getElementById(elementID).innerText = sF_logMap.get(this.logerModuleAdr);
        }
        else console.log("error: " + error);
    });
}

ZSCPrintLog.prototype.initSystemLog = function(adrs, elementID, initialModuleIndex) {
    this.logerModuleAdr = adrs[initialModuleIndex];
    for (var i = 0; i < adrs.length; ++i) {
        this.logMap.set(adrs[i], "");
        this.logIndexMap.set(adrs[i], 0);
        window.setInterval("sF_refreshGetLog('" + this.logRecorderAdr + "', '" + adrs[i] + "', '" + elementID + "')", 2000);
    }
}  


