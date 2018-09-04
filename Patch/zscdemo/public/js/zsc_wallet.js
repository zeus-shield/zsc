/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(nm, abi, adr) {
    this.userName = nm;
    this.userType;
    this.tokenNos = 1;
    this.tokenSymbol = [];
    this.tokenAddress = [];
    this.tokenBalance = [];
    this.tokenStatus = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCWallet.prototype = new ZSCClient();

ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.setUserName = function(nm) {this.userName = nm; }

ZSCWallet.prototype.setUserType = function(type) {this.userType = type;}

ZSCWallet.prototype.getUserType = function() {return this.userType;}

ZSCWallet.prototype.submitTransferValue = function(tokenSymbol, destAddress, amount, logId, func) {  
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    if (destAddress != 0 && amount > 0) {
        myControlApi.submitTransfer(gm.userName, tokenSymbol, destAddress, web3.toWei(amount, 'ether') , 
            {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
            function(error, result){ 
            if(!error) {
                bF_showHashResult(logId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
    }
}

//Disabled during alpha-test
/*
ZSCWallet.prototype.confirmTransferValue = function(tokenSymbol, logId, func) {  
    this.myControlApi.confirmTransfer(this.userName, tokenSymbol, 
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
        if(!error) {
            if (result > 0) {
                this.informTransfer(srcAddress, destAddress, result);
            } else {
                func();
            }
        } else {
            console.log("error: " + error);
        }
    });
}
