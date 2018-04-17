/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCWalletMangement(adr, abi) {
    this.tokenNos = 0;
    this.tokenSymbols = [];
    this.tokenNames = [];
    this.tokenDecimals = [];
    this.tokenAdrs = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCWalletMangement.prototype = new ZSCJsBase();

ZSCUserMangement.prototype.addToken = function(tokenName, tokenSymbol,decimals, tokenAddress, hashId, func){
    this.myControlApi.registerErc20Token(tokenName, tokenSymbol,decimals, tokenAddress,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) this.howHashResult(hashId, result, func);
            else console.log("error: " + error);
        });
}  

ZSCUserMangement.prototype.loadWalletManagementHtml = function(funcName, elementId) {
    var funcPrefix = funcName + '('; 
    var funcSuffix = ')"';

    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Name</text></td>  <td><text>Sysmbol</text></td>  <td><text>Decimals</text></td>  <td><text>Address</text></td> '
    text += '</tr><tr>'

    for (var i = 0; i < this.userNos; ++i) {
        var name = this.userName[i];
        var hashId = this.userName[i] + "Hash"
        text += '   <td><text>' + this.tokenNames[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenSymbols[i]  + '</text></td>'
        text += '   <td><text>' + this.tokenDecimals[i]    + '</text></td>'
        text += '   <td><text>' + this.tokenAdrs[i]      + '</text></td>'
    }
    text += '</tr>'
    document.getElementById(elementId).innerHTML = text;  
}

ZSCUserMangement.prototype.loadErcTokenInfo = function(func) {
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

ZSCUserMangement.prototype.numErcTokens = function(func) {
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

ZSCUserMangement.prototype.loadErcTokenInfoByIndex = function(index, func) {
    this.myControlApi.getErc20TokenInfoByIndex(i,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.parserTokenInfo(result, index);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCUserMangement.prototype.parserTokenInfoByIndex = function(str, index) {
}



    
