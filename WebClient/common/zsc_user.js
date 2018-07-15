/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUser() {
    this.admAdr = "0x295459c5ba2e760daacb57e0ac455456227df223";
    this.userStatus;
    this.userType;
    this.controlApisAdr;
    this.controlApisFullAbi;
    this.account = web3.eth.accounts[0];
    this.myAdmAdv = web3.eth.contract(this.getLoginAbi()).at(this.admAdr);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCUser.prototype.getUserName = function() { return this.userName; }
ZSCUser.prototype.getUserNameHr = function() { return this.userNameHr; }
ZSCUser.prototype.getUserStatus = function() { return this.userStatus; }
ZSCUser.prototype.getUserType = function() { return this.userType; }
ZSCUser.prototype.getControlApisAdr = function() { return this.controlApisAdr; }
ZSCUser.prototype.getControlApisFullAbi = function() { return this.controlApisFullAbi; }
ZSCUser.prototype.getLoginAbi = function() { 
    return [{"constant":true,"inputs":[],"name":"getControlApisFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getControlApisAdr","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_pass","type":"bytes32"}],"name":"tryLogin","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_hexx","type":"bytes32"},{"name":"_type","type":"bytes32"}],"name":"activeByUser","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_hexx","type":"bytes32"}],"name":"getUserType","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_hexx","type":"bytes32"}],"name":"keepOnline","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_hexx","type":"bytes32"}],"name":"getUserStatus","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}];
}

ZSCUser.prototype.tryLogin = function(func){
    var gm = this;
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.tryLogin(function(error, result) {
        if(!error) {
            if (result == false) {
                callBack(false);
            } else {
                gm.getAdr(gm, func);
            }
        } else { 
            console.log("error: " + error);
        }
    });
}

ZSCUser.prototype.getAdr = function(gm, func){
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getControlApisAdr(function(error, adr) {
        if(!error) { 
            gm.getFullAbi(gm, adr, callBack);
        } else {
            console.log("error: " + error);
        }
    } );
}

ZSCUser.prototype.getFullAbi = function(gm, userName, adr, func){
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

ZSCUser.prototype.activeByUser = function(type, hashLogId){
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

ZSCUser.prototype.getUserStatusFromAdm = function(func) {
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

ZSCUser.prototype.getUserTypeFromAdm = function(func){
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

ZSCUser.prototype.loadWelcome = function(tagId) {
    var text = '<div class="well">'
    text += '   <text>Welcome to the ZSC testing platform</text>'
    text += '</div>'
    document.getElementById(tagId) = text; 
}

ZSCUser.prototype.loadUserApplication = function(funcName, tagId) {
    var funcPrefix = funcName + "(";
    var funcSuffix = ")";
    var text;

    text = '<div class="well">'
    text += '   <button type="button" onClick="' + funcPrefix + "'provider', 'ApplyForProviderHash' " + funcSuffix + '">Apply for provider</button> <br><br>'
    text += '   <button type="button" onClick="' + funcPrefix + "'receiver', 'ApplyForProviderHash' " + funcSuffix + '">Apply for receiver</button> <br>'
    text += '   <button type="button" onClick="' + funcPrefix + "'staker', 'ApplyForProviderHash' " + funcSuffix + '">Apply for receiver</button> <br>'
    text += '   <br><text id="ApplyForProviderHash"></text>'
    text += '</div>'
    document.getElementById(tagId) = text; 
}


