/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUser(admAdr) {
    this.admAdr = admAdr;
    this.userName;
    this.userNameHr;
    this.userStatus;
    this.userType;
    this.controlApisAdr;
    this.controlApisFullAbi;
}
ZSCUser.prototype.setControlApisAdr = function(adr) { this.controlApisAdr = adr; } 
ZSCUser.prototype.setControlApisFullAbi = function(abi) { this.controlApisFullAbi = abi; } 
ZSCUser.prototype.getUserName = function() { return this.userName; }
ZSCUser.prototype.getUserNameHr = function() { return this.userNameHr; }
ZSCUser.prototype.getUserStatus = function() { return this.userStatus; }
ZSCUser.prototype.getUserType = function() { return this.userType; }
ZSCUser.prototype.getControlApisAdr = function() { return this.controlApisAdr; }
ZSCUser.prototype.getControlApisFullAbi = function() { return this.controlApisFullAbi; }
ZSCUser.prototype.getLoginAbi = function() { return [{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_hexx","type":"bytes32"}],"name":"getFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_pass","type":"bytes32"}],"name":"tryLogin","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]; }

ZSCUser.prototype.tryLogin = function(user, pass, func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(this.admAdr);

    myControlApi.tryLogin(user, pass, function(error, hexx) {
        if(!error) {
            if (hexx == 0x0) {
                func(false);
            } else {
                this.getFullAbi(user, hexx, adr, func);
            }
        } else console.log("error: " + error);
    } );
}

ZSCUser.prototype.getFullAbi = function (user, hexx, adr, func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(adr);
    myControlApi.getFullAbi(user, hexx, adr, function(error, fullAbi) {
        if(!error) { 
            this.userName = user;
            this.userNameHr = hex;
            this.controlApisAdr = adr;
            this.controlApisFullAbi = fullAbi;
            func(true);
        } else {
            console.log("error: " + error);
        }
    } );
}

ZSCUser.prototype.keepOnline = function(func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(this.admAdr);

    myControlApi.keepOnline(this.userName, this.userNameHr, function(error, ret) {
        if(!error) func(ret);
        else console.log("error: " + error);
    } );
}

ZSCUser.prototype.applyForUser = function(type, hashLogId, func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(this.admAdr);

    myControlApi.applyForUser(this.userNameHr, type, function(error, ret) {
        if(!error) { 
            this.type = type;
            bF_showHashResult(ret, hashLogId, func);
        } else { 
            console.log("error: " + error);
        }
    } );
}

ZSCUser.prototype.getUserStatusFromAdm = function(func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(this.admAdr);

    myControlApi.getUserStatus(this.userNameHr,
        function(error, ret) {
            if(!error) { 
                this.userStatus = ret;
                func(ret);
            } else { 
                console.log("error: " + error);
             }
        } );
}

ZSCUser.prototype.getUserTypeFromAdm = function(func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(this.admAdr);

    myControlApi.getUserType(this.userNameHr,
        function(error, ret) {
            if(!error) { 
                this.userType = ret;
                func(ret);
            } else { 
                console.log("error: " + error);
             }
        } );
}

