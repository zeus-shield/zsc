/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTemplate(nm, abi, adr) {
    this.userName = nm;
    this.userType;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.tmpChildrenNos = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCTemplate.prototype.getUserName = function() {return this.userName;}

ZSCTemplate.prototype.getTmpName = function(index) { return this.tmpName[index];}

ZSCTemplate.prototype.setUserType = function(type) {this.userType = type;}

ZSCTemplate.prototype.loadTempates = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.numTemplates(gm, function(gm) {
        if (gm.tmpNos == 0) {
            callBack();
        } else {
            for (var i = 0; i < gm.tmpNos; ++i) {
                gm.getTmpNameByIndex(gm, i, function(gm, j){
                    gm.numTmpChildrenNos(gm, j, function(gm, index) {
                        if (index == gm.tmpNos - 1) {
                            callBack();
                        }
                    });
                });
            }
        }
    });
}
