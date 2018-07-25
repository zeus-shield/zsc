/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCLogin(userAccount) {
    this.admAdr = "0x106d93cfeca100680627d2b6b96ae19dc559225a";
    this.userStatus;
    this.userType;
    this.controlApisAdr;
    this.controlApisFullAbi;
    this.account = userAccount;
    this.myAdmAdv = web3.eth.contract(this.getLoginAbi()).at(this.admAdr);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCLogin.prototype.getUserName = function() { return this.userName; }
ZSCLogin.prototype.getUserNameHr = function() { return this.userNameHr; }
ZSCLogin.prototype.getUserStatus = function() { return this.userStatus; }
ZSCLogin.prototype.getUserType = function() { return this.userType; }
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
                gm.getAdr(gm, callBack);
            }
        } else { 
            callBack(false);
            console.log("error: " + error);
        }
    });
}

ZSCLogin.prototype.getAdr = function(gm, func){
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getControlApisAdr({from: gm.account},
        function(error, adr) {
        if(!error) { 
            gm.getFullAbi(gm, adr, callBack);
        } else {
            console.log("error: " + error);
        }
    } );
}

ZSCLogin.prototype.getFullAbi = function(gm, adr, func){
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getControlApisFullAbi(function(error, fullAbi) {
        if(!error) { 
            gm.controlApisAdr = adr;
            gm.controlApisFullAbi = fullAbi;
            callBack(true);
        } else {
            console.log("error: " + error);
        }
    } );
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



