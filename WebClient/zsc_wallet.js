/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(nm, abi, adr) {
    this.userName = nm;
    this.ethAddress;
    this.ethTotalBalance;
    this.ethLockedBalance;
    this.tokenNos = 0;
    this.tokenSymbol = [];
    this.tokenAddress = [];
    this.tokenTotalBalance = [];
    this.tokenLockedBalance = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.getTokenSymbol = function(index) { return this.tokenSymbol[index];}

ZSCWallet.prototype.getTokenBalance = function(index) { return this.tokenBalance[index];}

ZSCWallet.prototype.getTokenAddress = function(index) { return this.tokenAddress[index];}

ZSCWallet.prototype.getTokenNos = function() { return this.tokenNos; }

ZSCWallet.prototype.loadEthBalance = function(func, locked) {
    this.myControlApi.getElementBalance(this.name, "ETH", locked,
    	function(error, balance){ 
        if(!error) {
        	if (!locked) {
        		this.ethTotalBalance = balance;  
            } else {
        		this.ethLockedBalance = balance;  
            }
            myControlApi.getUserWalletAddress(this.name, "ETH", function(error, address){ 
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

ZSCWallet.prototype.loadErcTokenWallets = function(func) {
    this.numTokenWallets(function() {
        for (var i = 0; i < this.tokenNos; ++i) {
            this.loadTokenBalance(i, false, function(index){
                if (index == this.tokenNos - 1) {
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

ZSCWallet.prototype.loadTokenBalance = function(index, locked, func) {
	var symbol = this.tokenSymbol[index];
    this.myControlApi.getElementBalance(this.name, symbol, locked,
    	function(error, balance){ 
        if(!error) {
        	if (!locked) {
        		this.tokenTotalBalance[index] = balance;  
            } else {
        		this.tokenLockedBalance[index] = balance;  
            }
            myControlApi.getUserWalletAddress(this.name, symbol, function(error, address){ 
                if(!error) { 
                    this.tokenAddress[index] = address; 
                    func(); 
                } else {
                    console.log("error: " + error);
                }
            });
        }
    });
}


