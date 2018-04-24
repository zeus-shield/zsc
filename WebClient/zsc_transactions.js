/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTransactions(nm, abi, adr) {
    this.userName = nm;
    this.nos;
    this.tokenSymbol;
    this.timeMoments = [];
    this.inputTags = [];
    this.txHash = [];
    this.amounts = [];
    this.senders = [];
    this.receivers = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
ZSCTransactions.prototype.getUserName = function() {return this.userName;}

ZSCTransactions.prototype.setTokenSymbol = function(symbol) {return this.tokenSymbol = symbol;}

ZSCTransactions.prototype.getTokenSymbol = function() { return this.tokenSymbol;}

ZSCTransactions.prototype.getTimeMoment = function(index) { return this.timeMoments[index];}

ZSCTransactions.prototype.getAmount = function(index) { return this.amounts[index];}

ZSCTransactions.prototype.getSender = function(index) { return this.senders[index];}

ZSCTransactions.prototype.getReceiver = function(index) { return this.receivers[index];}

ZSCTransactions.prototype.getInputTag = function(index) { return this.inputTags[index];}

ZSCTransactions.prototype.getTransactionNos = function() { return this.nos; }

ZSCTransactions.prototype.loadTransactions = function(func) {
    this.numTransactions(function() {
        for (var i = 0; i < this.walletNos; ++i) {
            this.loadTransactionInfoByIndex(i, function(index){
                if (indx == this.walletNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCTransactions.prototype.numTransactions = function(func) {
    this.myControlApi.numUserTransactions(this.userName, this.tokenSymbol, 
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.walletNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTransactions.prototype.loadTransactionInfoByIndex = function(index, func) {
    this.myControlApi.getUserTransactionByIndex(this.userName, this.tokenSymbol, index,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                //parserTransactionInfoByIndex(result, index)
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}
