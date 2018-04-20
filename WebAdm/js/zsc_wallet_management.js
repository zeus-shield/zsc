/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCWalletMangement(adr, abi) {
    this.tokenNos = 0;
    this.tokenNames = [];
    this.tokenStatus = [];
    this.tokenSymbols = [];
    this.tokenDecimals = [];
    this.tokenAdrs = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCWalletMangement.prototype = new ZSCJsBase();

ZSCWalletMangement.prototype.addTokenContractInfo = function(nameId, symbolId, decimalsId, adrId, hashId, func) {
    var tokenName    =  document.getElementById(nameId).value;
    var tokenSymbol  =  document.getElementById(symbolId).value;
    var decimals     =  document.getElementById(decimalsId).value;
    var tokenAddress =  document.getElementById(adrId).value;

    this.myControlApi.registerErc20Token(tokenName, tokenSymbol, decimals, tokenAddress,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) this.showHashResult(hashId, result, func);
            else console.log("error: " + error);
        });
}  

ZSCWalletMangement.prototype.loadWalletManagementHtml = function(elementId) {
    var funcPrefix = funcName + '('; 
    var funcSuffix = ')"';

    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Name</text></td> <td><text>Actived</text></td>  <td><text>Sysmbol</text></td>  <td><text>Decimals</text></td>  <td><text>Address</text></td> '
    text += '</tr><tr>'

    for (var i = 0; i < this.userNos; ++i) {
        var name = this.userName[i];
        var hashId = this.userName[i] + "Hash"
        text += '   <td><text>' + this.tokenNames[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenStatus[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenSymbols[i]  + '</text></td>'
        text += '   <td><text>' + this.tokenDecimals[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenAdrs[i]      + '</text></td>'
    }
    text += '</tr>'
    document.getElementById(elementId).innerHTML = text;  
}

ZSCWalletMangement.prototype.loadErcTokenContracts = function(func) {
    this.numErcTokens(function() {
        for (var i = 0; i < this.tokenNos; ++i) {
            this.loadErcTokenInfoByIndex(i, function(index){
                if (index == this.tokenNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCWalletMangement.prototype.numErcTokens = function(func) {
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

ZSCWalletMangement.prototype.loadErcTokenInfoByIndex = function(index, func) {
    this.myControlApi.getErc20TokenInfoByIndex(i,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.parserTokenInfoByIndex(result, index);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}


/*
"info?name=", "symbol=", "decimals=", "adr=",     
*/
ZSCUserMangement.prototype.parserTokenInfoByIndex = function(urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var namInfo      = newsids[0];
    var statusInfo   = newsids[1];
    var symbolInfo   = newsids[2];
    var decimalsInfo = newsids[3];
    var addressInfo  = newsids[4];

    this.tokenNames[index]    = namInfo.split("=")[1];
    this.tokenStatus[index]   = statusInfo.split("=")[1];
    this.tokenSymbols[index]  = symbolInfo.split("=")[1];
    this.tokenDecimals[index] = decimalsInfo.split("=")[1];
    this.tokenAdrs[index]     = addressInfo.split("=")[1];

    return true;
}



    
