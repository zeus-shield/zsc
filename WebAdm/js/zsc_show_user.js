/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUser(adr, abi) {
    this.userName;
    this.walletNos = 0;
    this.walletNames = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCShowUser.prototype = new ZSCJsBase();

ZSCShowUser.prototype.parserUserName = function() {    
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

ZSCShowUser.prototype.showUserWallets = function(func) {
    this.numUsernWallets(function() {
        for (var i = 0; i < this.walletNos; ++i) {
            this.loadWalletInfoByIndex(i, function(index){
                if (indx == this.walletNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCShowUser.prototype.numUsernWallets = function(func) {
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

ZSCShowUser.prototype.loadWalletInfoByIndex = function(index, func) {
    this.myControlApi.getTokenBalanceInfoByIndex(this.userName, i,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}
