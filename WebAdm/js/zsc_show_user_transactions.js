/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUserTransactions(adr, abi) {
    this.userName;
    this.walletSymbol;
    this.transNos = 0;
    this.timeMoments = [];
    this.inputTags   = [];  
    this.txHash      = [];     
    this.amounts     = [];    
    this.senders     = [];    
    this.receivers   = [];  
    this.account  = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCShowUserTransactions.prototype = new ZSCJsBase();

ZSCShowUserTransactions.prototype.setUserName = function(userName) {
    this.userName = userName;
}

ZSCShowUserTransactions.prototype.loadUserTransactions = function(func) {
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

ZSCShowUserTransactions.prototype.numUserTransactions = function(func) {
    this.myControlApi.numUserTransactions(this.userName, this.tokenSymbol, 
        {from: this.account},
        function(error, result){ 
            if(!error) {
                this.transNos = result.toString(10);
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserTransactions.prototype.loadUserTransactionByIndex = function(index, func) {

}
