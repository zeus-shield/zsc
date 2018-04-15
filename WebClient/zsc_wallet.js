/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(nm, abi, adr) {
    this.userName = nm;
    this.tokenNos = 0;
    this.nodeAddress = 0;
    this.tokenSymbol = [];
    this.tokenBalance = [];
    this.tokenAddress = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.getTokenSymbol = function(index) { return this.tokenSymbol[index];}

ZSCWallet.prototype.getTokenBalance = function(index) { return this.tokenBalance[index];}

ZSCWallet.prototype.getTokenAddress = function(index) { return this.tokenAddress[index];}

ZSCWallet.prototype.getTokenNos = function() { return this.tokenNos; }

ZSCWallet.prototype.loadEthBalance = function(func) {
    this.myControlApi.getElementEthBalance(this.name, function(error, balance){ 
        if(!error) {
            this.ethBalance = balance;  
            myControlApi.getElementAddress(this.name, function(error, address){ 
                if(!error) { 
                    this.nodeAddress = address; 
                    func(); 
                } else {
                    console.log("error: " + error);
                }
            });
        }
    });
}
