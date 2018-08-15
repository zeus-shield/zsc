/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementReceiver(account, adr, abi) {
    this.agrNos = 0;
    this.agrNames = [];
    this.balance = [];
    this.status = [];
    this.itemTags = [];
    this.account = account;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}
ZSCAgreementReceiver.prototype.getAgrNos = function() {return this.agrNos;}
ZSCAgreementReceiver.prototype.getAgrName = function(index) {return this.agrNames[index];}
ZSCAgreementReceiver.prototype.getAgrBalance = function(index) {return this.balance[index];}
ZSCAgreementReceiver.prototype.getAgrStatus = function(index) {return this.status[index];}

ZSCAgreementReceiver.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCAgreementReceiver.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCAgreementReceiver.prototype.loadAgreements = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.numAgreements(gm, function(gm) {
        if (gm.agrNos == 0) {
            callBack();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.agrNos; ++i) {
                gm.getAgrNameByIndex(gm, i, function(gm, j){
                    gm.getAgrBalance(gm, j, function(gm, index) {
                        gm.getAgrStatus(gm, j, function(gm, index) {
                            if (gm.checkAllItemTags(gm) == true) {
                                callBack()
                            }
                            /*if (index == gm.agrNos - 1) {
                                callBack();
                            }*/
                        });
                    });
                });
            }
        }
    });
}

ZSCAgreementReceiver.prototype.numAgreements= function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numAgreements(
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.agrNos = result.toString(10);
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementReceiver.prototype.getAgrNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getAgreementNameByIndex(index,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.agrNames[index] = web3.toUtf8(result);
                callBack(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementReceiver.prototype.getAgrBalance = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getElementBalance(gm.agrNames[index], "ZSC",
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.balance[index] = result.toString(10);
                //gm.itemTags[index] = true;
                callBack(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementReceiver.prototype.getAgrStatus = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getElementParameter(gm.agrNames[index], "status",
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.status[index] = web3.toUtf8(result);
                gm.itemTags[index] = true;
                callBack(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementReceiver.prototype.claimInsurance = function(hashLogId, elementName, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.claimInsurance( elementName,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(hashLogId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

