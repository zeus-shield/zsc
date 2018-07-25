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
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
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
    this.myControlApi.getUserTransactionByIndex(this.userName, this.tokenSymbol, index,
        {from: this.account},
        function(error, result){ 
            if(!error) {
                parserUserTransactionByIndex(result, index)
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserTransactions.prototype.parserUserTransactionByIndex = function(urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var timeInfo     = newsids[0];
    var inputInfo    = newsids[1];
    var txInfo       = newsids[2];
    var amountInfo   = newsids[3];
    var senderInfo   = newsids[4];
    var receiverInfo = newsids[5];

    this.timeMoments[index] = timeInfo.split("=")[1];
    this.inputTags[index]   = inputInfo.split("=")[1];
    this.txHash[index]      = txInfo.split("=")[1];
    this.amounts[index]     = amountInfo.split("=")[1];
    this.senders[index]     = senderInfo.split("=")[1];
    this.receivers[index]   = receiverInfo.split("=")[1];
}

