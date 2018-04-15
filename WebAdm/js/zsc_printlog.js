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