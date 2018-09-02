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
    this.account = web3.eth.accounts[0];
    this.myAdmAdv = web3.eth.contract(this.getLoginAbi()).at(this.admAdr);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}
ZSCUser.prototype.getUserName = function () { return this.userName; }
ZSCUser.prototype.getUserNameHr = function () { return this.userNameHr; }
ZSCUser.prototype.getUserStatus = function () { return this.userStatus; }
ZSCUser.prototype.getUserType = function () { return this.userType; }
ZSCUser.prototype.getControlApisAdr = function () { return this.controlApisAdr; }
ZSCUser.prototype.getControlApisFullAbi = function () { return this.controlApisFullAbi; }
