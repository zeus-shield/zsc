/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTransactions(nm, abi, adr) {
    this.userName = nm;
    this.transNos;
    this.tokenSymbol;
    this.timeMoments = [];
    this.inputTags = [];
    this.txHash = [];
    this.amounts = [];
    this.senders = [];
    this.receivers = [];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.account = web3.eth.accounts[0];
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCTransactions.prototype.getUserName = function() {return this.userName;}

ZSCTransactions.prototype.setTokenSymbol = function(symbol) {this.tokenSymbol = symbol;}

ZSCTransactions.prototype.getTokenSymbol = function() { return this.tokenSymbol;}

ZSCTransactions.prototype.loadTransactions = function(func) {
    var gm = this;
    var callBack = func;

    gm.numTransactions(gm, function(gm) {
        if (gm.transNos == 0) {
            callBack();
        } else {
            for (var i = 0; i < gm.transNos; ++i) {
                gm.loadTransactionInfoByIndex(gm, i, function(index){
                    if (index == gm.transNos - 1) {
                        callBack();
                    }
                });
            }
        }
    });
}

ZSCTransactions.prototype.numTransactions = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numUserTransactions(gm.userName, gm.tokenSymbol, 
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.transNos = result.toString(10);
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}
