/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreement(nm, abi, adr) {
    this.userName = nm;
    this.tmpName;
    this.agrNos = 0;
    this.agrNames = [];
    this.balance = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCAgreement.prototype.getUserName = function() {return this.userName;}

ZSCAgreement.prototype.setTemplateName = function(name) {this.tmpName = name;}

ZSCAgreement.prototype.loadAgreements = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.numAgreements(gm, function(gm) {
        if (gm.agrNos == 0) {
            callBack();
        } else {
            for (var i = 0; i < gm.agrNos; ++i) {
                gm.getAgrNameByIndex(gm, i, function(gm, j){
                    callBack();
                    gm.getAgrBalance(gm, j, function(gm, index) {
                        if (index == gm.agrNos - 1) {
                            callBack();
                        }
                    });
                });
            }
        }
    });
}
