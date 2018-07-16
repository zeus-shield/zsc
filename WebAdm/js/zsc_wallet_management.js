/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCWalletMangement(controlApiAdr, controlApiAbi, tokenManagerAdr, tokenManagerAbi) {
    this.tokenNos = 0;
    this.tokenNames = [];
    this.tokenStatus = [];
    this.tokenSymbols = [];
    this.tokenDecimals = [];
    this.tokenAdrs = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(controlApiAbi).at(controlApiAdr);
    this.myTokenManager= web3.eth.contract(tokenManagerAbi).at(tokenManagerAdr);
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(700);
}

ZSCWalletMangement.prototype.addTokenContractInfo = function(nameId, symbolId, decimalsId, adrId, hashId, func) {
    var tokenName    =  document.getElementById(nameId).value;
    var tokenSymbol  =  document.getElementById(symbolId).value;
    var decimals     =  document.getElementById(decimalsId).value;
    var tokenAddress =  document.getElementById(adrId).value;

    var callback = func;
    var gm = this;

    gm.myTokenManager.addToken(tokenName, tokenSymbol, decimals, tokenAddress,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashId, result, callback);
            else console.log("error: " + error);
        });
}  

ZSCWalletMangement.prototype.loadErcTokenContracts = function(func) {
    var callback = func;
    var gm = this;

    gm.numErcTokens(gm, function() {
        for (var i = 0; i < gm.tokenNos; ++i) {
            gm.loadErcTokenContractInfoByIndex(gm, i, function(index){
                if (index == gm.tokenNos - 1) {
                    callback();
                }
            });
        }
    });
}

ZSCWalletMangement.prototype.numErcTokens = function(gm, func) {
    var callback = func;

    gm.myTokenManager.numOfTokens(
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tokenNos = result.toString(10); ;
                callback(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCWalletMangement.prototype.loadErcTokenContractInfoByIndex = function(gm, index, func) {
    var callback = func;

    gm.myTokenManager.getTokenInfoStrByIndex(index,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.parserTokenContractInfoByIndex(gm, result, index);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}


/*
"info?name=", "symbol=", "decimals=", "adr=",     
*/
ZSCWalletMangement.prototype.parserTokenContractInfoByIndex = function(gm, urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var statusInfo   = newsids[0];
    var nameInfo      = newsids[1];
    var symbolInfo   = newsids[2];
    var decimalsInfo = newsids[3];
    var addressInfo  = newsids[4];

    gm.tokenNames[index]  = nameInfo.split("=")[1];
    gm.tokenSymbols[index]  = symbolInfo.split("=")[1];
    gm.tokenStatus[index]   = statusInfo.split("=")[1];
    gm.tokenDecimals[index] = decimalsInfo.split("=")[1];
    gm.tokenAdrs[index]     = addressInfo.split("=")[1];

    return true;
}

ZSCWalletMangement.prototype.loadWalletManagementHtml = function(elementId) {
    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Name</text></td> <td><text>Actived</text></td>  <td><text>Sysmbol</text></td>  <td><text>Decimals</text></td>  <td><text>Address</text></td> '
    text += '</tr>'
    text += '<tr> <td>---</td> <td>---</td> <td>---</td>  <td>---</td> <td>---</td> </tr>'

    for (var i = 0; i < this.tokenNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + this.tokenNames[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenStatus[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenSymbols[i]  + '</text></td>'
        text += '   <td><text>' + this.tokenDecimals[i]    + '</text></td>'
        text += '   <td><text>0x' + this.tokenAdrs[i]      + '</text></td>'
        text += '</tr>'
    }
    text += '</table>'
    document.getElementById(elementId).innerHTML = text;  
}



    
