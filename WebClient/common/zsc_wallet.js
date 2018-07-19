/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(acount, adr, abi) {
    this.userType;
    this.tokenNos = 0;
    this.tokenSymbol = [];
    this.tokenBalance = [];
    this.tokenStatus = [];
    this.tokenLocked = [];
    this.tokenAddress;
    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCWallet.prototype.getWalletAddress = function() { return this.tokenAddress;}
ZSCWallet.prototype.getTokenNos = function() { return this.tokenNos;}
ZSCWallet.prototype.getTokenSymbol = function(index) { return this.tokenSymbol[index];}
ZSCWallet.prototype.getTokenBalance = function(index) { return web3.fromWei(this.tokenBalance[index], 'ether');}
ZSCWallet.prototype.getTokenLocked = function(index) { return web3.fromWei(this.tokenLocked[index], 'ether');}

ZSCWallet.prototype.submitTransferValue = function(tokenSymbol, destAddress, amount, logId, func) {  
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    if (destAddress != 0 && amount > 0) {
        myControlApi.submitTransfer(tokenSymbol, destAddress, web3.toWei(amount, 'ether') , 
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

ZSCWallet.prototype.loadTokenWallets = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.getUserWalletAddress(gm, function(ret) {
        if (ret) {
            callBack();
        } else {
            gm.numTokenWallets(gm, function(gm) {
                for (var i = 0; i < gm.tokenNos; ++i) {
                    gm.loadTokenInfoByIndex(gm, i, function(gm, index) {
                        if (index == gm.tokenNos - 1) {
                            func();
                        }
                    });
                }
            });
        }
    });
}

ZSCWallet.prototype.getUserWalletAddress = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getUserWalletAddress(
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tokenAddress = result;
                if (result == 0x0) {
                    callBack(true);
                } else {
                    gm.isActivated = true;
                    callBack(false)
                }
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.numTokenWallets = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numOfTokens(
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tokenNos = result.toString(10);
                func(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.loadTokenInfoByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.getTokenBalanceInfoByIndex(Number(index), 
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.parserTokenBalanceInfoByIndex(gm, result, index);
                callBack(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.enableUserWallet = function(hashId, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.enableUserWallet(
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(hashId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

/*
"info?status=", "symbol=", "adr=", "balance=",    
*/
ZSCWallet.prototype.parserTokenBalanceInfoByIndex = function(gm, urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var statusInfo   = newsids[0];
    var symbolInfo   = newsids[1];
    var balanceInfo  = newsids[2];
    var lockedInfo  = newsids[3];

    gm.tokenStatus[index]  = statusInfo.split("=")[1];
    gm.tokenSymbol[index]  = symbolInfo.split("=")[1];
    gm.tokenBalance[index] = balanceInfo.split("=")[1];
    gm.tokenLocked[index]  = lockedInfo.split("=")[1];
    return true;
}


