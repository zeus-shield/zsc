/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCLogin(userAccount) {
    this.admAdr = "0x162b40e67f72a8ffc13b24b4f15ac7b98d92e454";
    this.userStatus;
    this.userType;
    this.controlApisAdr;
    this.erc721Adr;
    this.controlApisFullAbi;
    this.account = userAccount;
    this.myAdmAdv = web3.eth.contract(this.getLoginAbi()).at(this.admAdr);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCLogin.prototype.getUserName = function() { return this.userName; }
ZSCLogin.prototype.getUserNameHr = function() { return this.userNameHr; }
ZSCLogin.prototype.getUserStatus = function() { return this.userStatus; }
ZSCLogin.prototype.getUserType = function() { return this.userType; }
ZSCLogin.prototype.getErc721Adr = function() { return this.erc721Adr; }
ZSCLogin.prototype.getControlApisAdr = function() { return this.controlApisAdr; }
ZSCLogin.prototype.getControlApisFullAbi = function() { return this.controlApisFullAbi; }
ZSCLogin.prototype.getLoginAbi = function() { 
    return [{"constant":true,"inputs":[],"name":"getUserType","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getControlApisFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getControlApisAdr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_type","type":"bytes32"}],"name":"tryLogin","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_type","type":"string"}],"name":"activeByUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getUserStatus","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}];
}

ZSCLogin.prototype.tryLogin = function(userType, func){
    var gm = this;
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);
    console.log(gm.account);

    myAdmAdv.tryLogin(userType, {from: gm.account},
        function(error, result) {
        if(!error) {
            if (result == false) {
                callBack(false);
            } else {
                gm.getControlApisInfo(gm, callBack);
            }
        } else { 
            callBack(false);
            console.log("error: " + error);
        }
    });
}

ZSCLogin.prototype.getControlApisInfo = function(gm, func) {
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getControlApisAdr({from: gm.account},
        function(error, info) {
        if(!error) { 
            gm.parserControlApisInfo(gm, info);
            callBack(true);
        } else {
            console.log("error: " + error);
        }
    } );
}

/*
"info?abi=",
"sysAdr=",    
"erc721Adr=",  
*/
ZSCLogin.prototype.parserControlApisInfo = function(gm, info) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var abi       = newsids[0];
    var sysAdr    = newsids[1];
    var erc721Adr = newsids[2];

    gm.controlApisFullAbi = timeInfo.split("=")[1];
    gm.controlApisAdr     = inputInfo.split("=")[1];
    gm.erc721Adr          = "0x" + txInfo.split("=")[1];
}

ZSCLogin.prototype.activeByUser = function(type, hashLogId){
    var gm = this;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.activeByUser(type, 
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, ret) {
            if(!error) { 
                gm.type = type;
                bF_showHashResult(hashLogId, ret, function(){window.location.reload(true);});
            } else { 
                console.log("error: " + error);
            }
    } );
}

ZSCLogin.prototype.getUserStatusFromAdm = function(func) {
    var gm = this;
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getUserStatus(
        function(error, ret) {
            if(!error) { 
                gm.userStatus = web3.toUtf8(ret);
                callBack(gm.userStatus);
            } else { 
                console.log("error: " + error);
             }
        } );
}

ZSCLogin.prototype.getUserTypeFromAdm = function(func){
    var gm = this;
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getUserType(
        function(error, ret) {
            if(!error) { 
                gm.userType = web3.toUtf8(ret);
                callBack(gm.userType);
            } else { 
                console.log("error: " + error);
             }
        } );
}



