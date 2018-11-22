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

    this.totalRewards = 0;

    this.itemTags = [];
    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCWallet.prototype.getWalletAddress = function() { return this.tokenAddress;}
ZSCWallet.prototype.getTokenNos = function() { return this.tokenNos;}
ZSCWallet.prototype.getTokenSymbol = function(index) { return this.tokenSymbol[index];}
ZSCWallet.prototype.getTokenBalance = function(index) { return bF_robotParaValue(this.tokenBalance[index], "FromWei");}
ZSCWallet.prototype.getTokenLocked = function(index) { return bF_robotParaValue(this.tokenLocked[index], "FromWei");}
ZSCWallet.prototype.getTotalRewards = function() { return bF_robotParaValue(this.totalRewards, "FromWei");}

ZSCWallet.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.tokenNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCWallet.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.tokenNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCWallet.prototype.submitTransferValue = function(tokenSymbol, destAddress, amount, hashId, func) {  
    var gm = this;
    var callback = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    if (destAddress != 0 && amount > 0) {
        myControlApi.submitTransfer(tokenSymbol, destAddress, web3.toWei(amount, 'ether') , 
            {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
            function(error, result){ 
            if(!error) {
                bF_showHashResult(hashId, result, callback);
            } else {
                console.log("error: " + error);
            }
        });
    }
}

ZSCWallet.prototype.loadTokenWallets = function(func) {
    var gm = this;
    var callback = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.getUserWalletAddress(gm, function(ret) {
        if (ret) {
            callback();
        } else {
            gm.numTokenWallets(gm, function(gm) {
                if (gm.tokenNos == 0) {
                    callback();
                } else {
                    gm.resetAllItemTags(gm);
                    for (var i = 0; i < gm.tokenNos; ++i) {
                        gm.loadTokenInfoByIndex(gm, i, function(gm, index) {
                            if (gm.checkAllItemTags(gm) == true) {
                                callback();
                            }
                        });
                    }
                }
            });
        }
    });
}              

ZSCWallet.prototype.getUserWalletAddress = function(gm, func) {
    var callback = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getUserWalletAddress(
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tokenAddress = result;
                if (result == 0x0) {
                    callback(true);
                } else {
                    gm.isActivated = true;
                    callback(false)
                }
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.loadUserRewardInfo = function(tokenSymbol, func) {
    var gm = this;
    var callback = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getRewardInfoByUser( gm.account, tokenSymbol, 
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.totalRewards = result.toString(10);
                callback();
            } else {
                console.log("error: " + error);
            }
        });
}

///////////////////////////////////
ZSCWallet.prototype.numTokenWallets = function(gm, func) {
    var callback = func;
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
    var callback = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.getTokenBalanceInfoByIndex(Number(index), 
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.itemTags[index] = true;
                gm.parserTokenBalanceInfoByIndex(gm, result, index);
                callback(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWallet.prototype.enableUserWallet = function(hashId, func) {
    var gm = this;
    var callback = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.enableUserWallet(
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(hashId, result, callback);
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

