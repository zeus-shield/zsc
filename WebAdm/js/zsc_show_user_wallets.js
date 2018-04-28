/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUserWallets(adr, abi) {
    this.userName;
    this.walletNos = 0;
    this.walletSymbols = [];
    this.walletAdrs = [];
    this.walletBalance = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCShowUserWallets.prototype = new ZSCJsBase();

ZSCShowUserWallets.prototype.parserUserName = function() {    
        var urlinfo=window.location.href; 
        var found1 = urlinfo.indexOf("?");
        var found2 = urlinfo.indexOf("=");
    
        if (found1 == -1 || found2 == -1) return false;

        var len=urlinfo.length;
        var offset=urlinfo.indexOf("?");
        var newsidinfo=urlinfo.substr(offset,len)
        var newsids = newsidinfo.split("&");
    
        var userName = newsids[0];
        this.userName = userName.split("=")[1];
    
        return true;
}  

ZSCShowUserWallets.prototype.loadUserWallets = function(func) {
    this.numUserWallets(function() {
        for (var i = 0; i < this.walletNos; ++i) {
            this.loadWalletInfoByIndex(i, function(index){
                if (indx == this.walletNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCShowUserWallets.prototype.numUserWallets = function(func) {
    this.myControlApi.numRegisteredErc20Tokens(this.userName,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.walletNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserWallets.prototype.loadWalletInfoByIndex = function(index, func) {
    this.myControlApi.getTokenBalanceInfoByIndex(this.userName, index,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                parserWalletInfoByIndex(result, index)
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserWallets.prototype.parserWalletInfoByIndex = function(urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var statusInfo   = newsids[0];
    var symbolInfo   = newsids[1];
    var adrInfo      = newsids[2];
    var balanceInfo  = newsids[3];

    this.walletSymbols[index] = symbolInfo.split("=")[1];
    this.walletAdrs[index]    = adrInfo.split("=")[1];
    this.walletBalance[index] = balanceInfo.split("=")[1];
    return true;
}

ZSCShowUserWallets.prototype.loadWalletHtml = function(elementId)  {
    var funcPrefix = funcName + "('"; 
    var funcSuffix = "')";
    var walletObj = extra;
    var symbol;
    var adr;
    var balance;
    var hashId;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Symbol</text></td> <td><text>Balance</text></td>  <td><text>Address</text></td>  <td></td> <td></td> '
    text += '</tr><tr>'

    for (var i = 0; i < this.walletNos(); ++i) {
        symbol = walletObj.getTokenSymbol(i);
        adr = walletObj.getTokenAddress(i);
        balance = walletObj.getTokenBalance(i);
        hashId = symbol + "Hash";
        sentoId = symbol + "Dest";
        amountId = symbol + "Amount";
        text += '<tr>'
        text += '   <td><text>' + symbol + '</text></td>'
        text += '   <td><text>' + balance + '</text></td>'
        text += '   <td><text>' + adr  + '</text></td>'  
        text += '   <td><text id="'+ hashId + '"></text></td>'
        text += '</tr>'
    }
    text += '</div>'

    document.getElementById(elementId).innerHTML = text;  
}
