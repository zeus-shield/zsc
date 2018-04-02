/*
Copyright (c) 2018 ZSC Dev Team
*/
function zscUser() {
    this.userName;
    this.userNameHr;
    this.controlApisAdr;
    this.controlApisFullAbi;
}
zscUser.prototype.setUserName = function(name) { this.userName = name; }
zscUser.prototype.setUserNameHr = function(hr) { this.userNameHr = hr; } 
zscUser.prototype.setControlApisAdr = function(adr) { this.controlApisAdr = adr; } 
zscUser.prototype.setControlApisFullAbi = function(abi) { this.controlApisFullAbi = abi; } 
zscUser.prototype.getUserName = function() { return this.userName; }
zscUser.prototype.getUserNameHr = function() { return this.userNameHr; }
zscUser.prototype.getControlApisAdr = function() { return this.controlApisAdr; }
zscUser.prototype.getControlApisFullAbi = function() { return this.controlApisFullAbi; }
zscUser.prototype.getLoginAbi = function() { return [{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_hexx","type":"bytes32"}],"name":"getFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_pass","type":"bytes32"}],"name":"tryLogin","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}]; }

zscUser.prototype.getFullAbi = function (func){
    var myContract = web3.eth.contract(this.getLoginAbi());
    var myControlApi = myContract.at(adr);
    myControlApi.getFullAbi(this.userName, this.userNameHr, function(error, fullAbi) {
        if(!error) { 
            uF_controlApisAdvFullAbi = fullAbi;
            uF_userName = user;
            uF_userNameHr = hex;
            uF_controlApisAdr = adr;
            func(true);
        } else {
            console.log("error: " + error);
        }
    } );
}

