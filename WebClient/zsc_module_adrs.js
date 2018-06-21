/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCModuleAdrs(nm, abi, adr) {
    this.adrName = [];
    this.adrValue = [];
    this.userName = nm;
    this.userType;
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
}

ZSCModuleAdrs.prototype.setUserName = function(nm) {this.userName = nm; }

ZSCModuleAdrs.prototype.setUserType = function(type) {this.userType = type;}

ZSCModuleAdrs.prototype.getModuleAdrs = function(func) {  
    var gm = this;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.getModuleAddresses({from: gm.account},
        function(error, result){ 
        if(!error) {
            parserAdrInfo(result);
            func();
        } else {
            console.log("error: " + error);
        }
    });
}

ZSCModuleAdrs.prototype.parserAdrInfo = function(gm, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    for (var i = 0; i < 10; ++i) {
        gm.adrName[i]  = newsids[i].split("=")[0];
        gm.adrValue[i] = newsids[i].split("=")[1];
    }
}


