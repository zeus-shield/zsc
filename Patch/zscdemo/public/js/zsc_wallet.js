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
ZSCWallet.prototype.enableWallet = function(tokenSymbol, elementId, func) {
    this.myControlApi.enableElementWallet(this.userName, tokenSymbol, 0, 
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
            if(!error) {
                bF_showHashResult(elementId, result, function(){});
                func();
            } else {
                console.log("error: " + error);
            }
        });
}
*/

ZSCWallet.prototype.loadTokenWallets = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    //gm.numTokenWallets(gm, function(gm) {
        for (var i = 0; i < gm.tokenNos; ++i) {
            gm.loadTokenInfoByIndex(gm, i, function(gm, index) {
                if (indx == gm.tokenNos - 1) {
                    func();
                }
            });
        }
    //});
}

//Disabled during alpha-test
/*
ZSCWallet.prototype.numTokenWallets = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numRegisteredErc20Tokens(
        gm.userName,
        {from: gm.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                gm.tokenNos = result.toString(10);
                func(gm);
            } else {
                console.log("error: " + error);
            }
        });
}
*/

ZSCWallet.prototype.loadTokenInfoByIndex = function(index, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.getTokenBalanceInfoByIndex(gm.userName, index + 1,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.parserTokenBalanceInfoByIndex(gm, result, index);
                callBack();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.enableUserWallet = function(hashId, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.enableUserZSCWallet(gm.userName,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(hashId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}