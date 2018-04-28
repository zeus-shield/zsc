/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUserAgrs(adr, abi) {
    this.userName;
    this.agrNos = 0;
    this.agrNames = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCShowUserAgrs.prototype = new ZSCJsBase();

ZSCShowUserAgrs.prototype.parserUserName = function() {    
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

ZSCShowUserAgrs.prototype.loadUserAgrs = function(func) {
    this.numUserAgrs(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getAgrNameByIndex(i, function(index){
                if (indx == this.agrNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCShowUserAgrs.prototype.numUserAgrs= function(func) {
    this.myControlApi.numAgreements(this.userName,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserAgrs.prototype.getAgrNameByIndex = function(index, func) {
    this.myControlApi.getAgreementNameByIndex(this.userName, index,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrNames[index] = result;
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

