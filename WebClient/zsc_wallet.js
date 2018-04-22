/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(nm, abi, adr) {
    this.userName = nm;
    this.tokenNos = 0;
    this.tokenSymbol = [];
    this.tokenAddress = [];
    this.tokenBalance = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.getTokenSymbol = function(index) { return this.tokenSymbol[index];}

ZSCWallet.prototype.getTokenBalance = function(index) { return this.tokenBalance[index];}

ZSCWallet.prototype.getTokenAddress = function(index) { return this.tokenAddress[index];}

ZSCWallet.prototype.getTokenNos = function() { return this.tokenNos; }

ZSCElement.prototype.transferValue = function(destAddressID, amountID, logID) {  
    var srcAddress = document.getElementById(destAddressID).innerText;
    var destAddress = document.getElementById(destAddressID).value;
    var amount = document.getElementById(amountID).value;

    if (destAddress != 0 && amount > 0) {
        this.myControlApi.elementTransferValue(this.name, ethAddress, destAddress, web3.toWei(amount, 'ether') , 
            {from: bF_getEthAccount(), gasPrice: bF_getGasPrice(1), gas : bF_getGasLimit(55000)}, 
            function(error, result){ 
            if(!error) bF_showHashResult(logID, result, function(){});
            else console.log("error: " + error);
        });
    }
}

ZSCWallet.prototype.loadTokenWallets = function(func) {
    this.numTokenWallets(function() {
        for (var i = 0; i < this.tokenNos; ++i) {
            this.loadTokenInfoByIndex(i, function(index){
                if (indx == this.tokenNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCWallet.prototype.numTokenWallets = function(func) {
    this.myControlApi.numRegisteredErc20Tokens("null",
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.tokenNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.loadTokenInfoByIndex = function(index, func) {
    this.myControlApi.getTokenBalanceInfoByIndex(this.userName, i,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.parserTokenBalanceInfoByIndex(result, index);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

/*
"info?status=", "symbol=", "adr=", "balance=",    
*/
"info?status=", "symbol=", "adr=", "balance=",    
ZSCWallet.prototype.parserTokenBalanceInfoByIndex = function(urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var statusInfo   = newsids[0];
    var symbolInfo   = newsids[1];
    var adrInfo      = newsids[2];
    var balanceInfo  = newsids[3];

    this.tokenSymbols[index]  = symbolInfo.split("=")[1];
    this.tokenAdrs[index]     = adrInfo.split("=")[1];
    this.tokenBalance         = balanceInfo.split("=")[1];
    return true;
}



