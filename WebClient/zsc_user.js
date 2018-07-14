/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUser() {
    this.admAdr = "0x295459c5ba2e760daacb57e0ac455456227df223";
    this.userName;
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

    myAdmAdv.tryLogin(function(error, userName) {
        if(!error) {
            if (userName == 0x0) {
                callBack(false);
            } else {
                gm.getAdr(gm, userName, func);
            }
        } else { 
            console.log("error: " + error);
        }
    });
}

ZSCUser.prototype.getAdr = function(gm, userName, func){
    var callBack = func;
    var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);

    myAdmAdv.getControlApisAdr(function(error, adr) {
        if(!error) { 
            gm.getFullAbi(gm, userName, adr, callBack);
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
            gm.userName = userName;
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

    myAdmAdv.activeByUser(gm.userName, type, 
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

    myAdmAdv.getUserStatus(gm.userName,
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

    myAdmAdv.getUserType(gm.userName,
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

ZSCUser.prototype.loadUserApplication = function(type, tagId) {
    if (type != "")
    var text = '<div class="well">'
    text += '   <button type="button" onClick="' + funcPrefix + "'provider' " + funcSuffix + '">Apply for provider</button> <br><br>'
    text += '   <button type="button" onClick="' + funcPrefix + "'receiver' " + funcSuffix + '">Apply for receiver</button> <br>'
    text += '   <button type="button" onClick="' + funcPrefix + "'staker' " + funcSuffix + '">Apply for receiver</button> <br>'
    text += '   <br><text id="ApplyForProviderHash"></text>'
    text += '</div>'
    document.getElementById(tagId) = text; 
}




ZSCInsura.prototype.loadPageHeader = function(funcName, userType, doesUserApplied) {
    var funcPrefix = funcName + "(";
    var funcSuffix = ")";
    var text;

    text = '<div class="well">'

    if (doesUserApplied == false) {
        text += '   <button type="button" onClick="' + funcPrefix + "'module-adrs'" + funcSuffix + '">Show Module Adrs</button> '
        text += '   <button type="button" onClick="' + funcPrefix + "'logout'" + funcSuffix + '">Log Out</button>'
        text += '</div><div class="well">'
        text += '   <button type="button" onClick="' + funcPrefix + "'apply-provider' " + funcSuffix + '">Apply for provider</button> <br><br>'
        text += '   <button type="button" onClick="' + funcPrefix + "'apply-receiver' " + funcSuffix + '">Apply for receiver</button> <br>'
    } else {
        text += '   <button type="button" onClick="' + funcPrefix + "'wallet'" + funcSuffix + '">Wallate</button>'
        text += '   <button type="button" onClick="' + funcPrefix + "'parameter-profile'" + funcSuffix + '">Profile</button>'
        if (userType == "provider") {
            text += '   <button type="button" onClick="' + funcPrefix + "'template'" + funcSuffix + '">Templates</button>'
        } else if (userType == "receiver") {
            text += '   <button type="button" onClick="' + funcPrefix + "'agreement-receiver'" + funcSuffix + '">Agreements</button>'
        }
        text += '   <button type="button" onClick="' + funcPrefix + "'agreement-all'" + funcSuffix + '">Show All Agreements</button>'
        text += '   <button type="button" onClick="' + funcPrefix + "'module-adrs'" + funcSuffix + '">Show Module Adrs</button>'
        text += '   <button type="button" onClick="' + funcPrefix + "'logout'" + funcSuffix + '">Log Out</button>'
    }
    text += ' <br><text id="ApplyForProviderHash"></text>'
    text += '</div>'
    this.setHtmlContent(this.pageHeaderId, text);  
}

ZSCInsura.prototype.loadWaitingApproval = function(funcName) {
    var func;
    var hashLogId;
    var text = '<text>Enable the user in ZSC blockchain system</text>'

    functionInput = funcName + "()";
    text += '<div class="well">'
    text += '    <text value="Applied as' + this.type + '></text>'
    text += '    <button type="button" onClick="' + functionInput + '">Refresh</button>'
    text += '</div>'
    
    this.setHtmlContent(this.pageBodyId, text);  
}

ZSCInsura.prototype.loadPageBody = function(tag, func) {
    var text;
    switch(tag) {
        case "login": 
            text = this.loadLogin(func); 
            break;
        case "welecome": 
            text = this.loadWelcome(); 
            break;
        case "apply": 
            text = this.loadButtonForEnablingElement(func); 
            break;
    }
    this.setHtmlContent(this.pageBodyId, text);  
} 

ZSCInsura.prototype.loadLogin = function(funcName) {
    var functionInput = funcName + "('AdmAdvAdr', 'UserName', 'PassWord')";
    text =  '<div class="well">'
    text += '   <text>Login ZSC system </text><br><br>'
    text += '   <text>Address of ZSC login module on the Rinkeby Ethereum test network</text> <br>'
    text += '   <text>!!! DONT CHANGE THIS ADDRESS !!!</text> <br>'
    text += '   <input class="form-control"  type="text" id="AdmAdvAdr" value="0x295459c5ba2e760daacb57e0ac455456227df223"></input> <br> <br>'
    text += '   <text>User Name </text> <br>' 
    text += '   <input type="text" id="UserName" value="test"></input> <br>' 
    text += '   <input type="password" id="PassWord" value="test"></input> <br>' 
    text += '   <button type="button" onClick="' + functionInput + '">Enter</button>'
    text += '</div>'
    
    return text;
}


