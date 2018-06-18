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
    this.gasPrice = bF_getGasPrice(20);
    this.gasLimit = bF_getGasLimit(743);
}

ZSCWallet.prototype = new ZSCClient();

ZSCWallet.prototype.getUserName = function() {return this.userName;}

ZSCWallet.prototype.setUserType = function(type) {return this.userType = type;}

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

ZSCWallet.prototype.informTransfer = function(srcAddress, destAddress, amount, func) { 
    if (amount > 0) {
        this.myControlApi.elementInformTransfer(this.userName, srcAddress, destAddress, web3.toWei(amount, 'ether') , 
            {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
            function(error, result){ 
            if(!error) {
                func();
            } else {
                console.log("error: " + error);
            }
        });
    }
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

ZSCWallet.prototype.loadWalletsHtml = function(elementId, func1, func2)  {
    var transPrefix = func1 + "('"; 
    var transSuffix = "')";

    var showTransPrefix = func2 + "('";
    var showTransSuffix = "')";

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

        if (this.tokenStatus[i] == "false") {
            text += '<button type="button" onClick="' + enableWalletPrefix + symbol + "', '" + hashId + showTransSuffix + '">Enable</button>'
        } else {
            text += '---------------</text><br>'
            text += 'Symbol: <text>Test' + symbol + '</text><br>'
            text += 'Address: <text>0x' + adr  + '</text><br>'   
            text += 'Balance: <text>' + balance + '</text><br><br>'
            //text += '---------------</text><br>'
            //text += '  <button type="button" onClick="' + showTransPrefix + symbol + "', '" + hashId + showTransSuffix + '">Show Transactions</button><br><br>'
            text += '---------------</text><br>'
            text += 'Dest-adr<input id="' + sentoId + '"></input> <br> Amount:<input id="' + amountId + '"></input> <br>'
            text += '  <button type="button" onClick="' + transPrefix + symbol + "', '" + sentoId + "', '" + amountId + "', '" + hashId + transSuffix + '">  Transfer  </button> <br>'
            text += '<text id="'+ hashId + '" value = "log:"> </text> <br>'
            text += '---------------</text><br>'
        }
    }
    text += '</div>'

    document.getElementById(elementId).innerHTML = text;  
}


