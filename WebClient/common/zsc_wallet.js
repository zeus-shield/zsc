/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCWallet(acount, abi, adr) {
    this.userType;
    this.tokenNos = 0;
    this.tokenSymbol = [];
    this.tokenAddress = [];
    this.tokenBalance = [];
    this.tokenStatus = [];
    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCWallet.prototype.nomTokens = function() { return this.tokenNos;}
ZSCWallet.prototype.getTokenSymbol = function(index) { return this.tokenSymbol[index];}
ZSCWallet.prototype.getTokenBalance = function(index) { return this.tokenBalance[index];}

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

    gm.numTokenWallets(gm, function(gm) {
        for (var i = 0; i < gm.tokenNos; ++i) {
            gm.loadTokenInfoByIndex(gm, i, function(gm, index) {
                if (indx == gm.tokenNos - 1) {
                    func();
                }
            });
        }
    });
}

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

ZSCWallet.prototype.loadTokenInfoByIndex = function(index, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(this.contractAbi).at(this.contractAdr);

    myControlApi.getTokenBalanceInfoByIndex(index,
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

    myControlApi.enableUserZSCWallet(
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
    var adrInfo      = newsids[3];

    gm.tokenStatus[index]  = statusInfo.split("=")[1];
    gm.tokenSymbol[index]  = symbolInfo.split("=")[1];
    gm.tokenAddress[index] = adrInfo.split("=")[1];
    gm.tokenBalance[index] = balanceInfo.split("=")[1];
    return true;
}

ZSCWallet.prototype.loadWalletsHtml = function(elementId, func1, func2, func3)  {
    var transPrefix = func1 + "('"; 
    var transSuffix = "')";

    var showTransPrefix = func2 + "('";
    var showTransSuffix = "')";

    var enableWalletPrefix = func3 + "('";
    var enableWalletSuffix = "')";

    var symbol;
    var adr;
    var balance;
    var hashId;

    var titlle = this.userType + " [" + this.userName + "] - wallet info"

    text = '<div class="well"> <text> ' + titlle + ' </text></div>';

    text += '<div class="well">';

    for (var i = 0; i < this.tokenNos; ++i) {
        symbol = this.tokenSymbol[i];
        adr = this.tokenAddress[i];
        balance = this.tokenBalance[i];
        hashId = symbol + "Hash";
        sentoId = symbol + "Dest";
        amountId = symbol + "Amount";

        text += '---------------</text><br>'
        if (this.tokenStatus[i] == "false") {
            text += '<button type="button" onClick="' + enableWalletPrefix + 'EnableZSCWalletHash' + "', '" + hashId + enableWalletSuffix + '">Enable TestZSC Wallet</button><br>'
            text += '<text id="EnableZSCWalletHash" value = "log:"> </text> <br>';
            text += '<text>---------------</text><br>'
        } else {
            text += 'Symbol: <text>Test' + symbol + '</text><br>'
            text += 'Address: <text> <a href="https://rinkeby.etherscan.io/address/0x' + adr + '#tokentxns" target="_blank" >0x' + adr + '</a></text><br>'
            text += 'Balance: <text>' + balance + '</text><br><br>'
            //text += '---------------</text><br>'
            //text += '  <button type="button" onClick="' + showTransPrefix + symbol + "', '" + hashId + showTransSuffix + '">Show Transactions</button><br><br>'
            text += '---------------</text><br>'
            text += 'Dest-adr<input id="' + sentoId + '"></input> <br> Amount:<input id="' + amountId + '"></input> <br>'
            text += '  <button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '">  Transfer  </button> <br>'
            text += '<text id="'+ hashId + '" value = "log:"> </text> <br>';
            text += '<text>---------------</text><br>'
        }

    }
    text += '</div>'

    document.getElementById(elementId).innerHTML = text;  
}


