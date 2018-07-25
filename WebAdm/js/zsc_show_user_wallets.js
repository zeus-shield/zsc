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
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
}

ZSCShowUserWallets.prototype = new ZSCJsBase();

ZSCShowUserWallets.prototype.setUserName = function(userName) {
    this.userName = userName;
    this.setModuleType("userWallets");
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
        {from: this.account},
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
        {from: this.account},
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

ZSCShowUserWallets.prototype.loadUserWalletsHtml = function(elementId)  {
    var funcPrefix = funcName + '('; 
    var funcSuffix = ')"';

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Symbol</text></td> <td><text>Balance</text></td>  <td><text>Address</text></td>  '
    text += '</tr>'

    for (var i = 0; i < this.walletNos(); ++i) {
        var symbol = this.walletSymbols(i);
        var adr = this.walletAdrs(i);
        var balance = this.walletAdrs(i);
        text += '<tr>'
        text += '   <td><text>' + symbol + '</text></td>'
        text += '   <td><text>' + balance + '</text></td>'
        text += '   <td><text>' + adr  + '</text></td>'  
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}
