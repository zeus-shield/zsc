/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUserTmps(adr, abi) {
    this.userName;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCShowUserTmps.prototype = new ZSCJsBase();

ZSCShowUserTmps.prototype.parserUserName = function() {    
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

ZSCShowUserTmps.prototype.loadUserAgrs = function(func) {
    this.numUserTmps(function() {
        for (var i = 0; i < this.tmpNos; ++i) {
            this.getTmpNameByIndex(i, function(index){
                if (indx == this.tmpNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCShowUserTmps.prototype.numUserTmps= function(func) {
    this.myControlApi.numTemplates(this.userName,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.tmpNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserTmps.prototype.getTmpNameByIndex = function(index, func) {
    this.myControlApi.getTemplateNameByIndex(this.userName, index,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.tmpNames[index] = result;
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

