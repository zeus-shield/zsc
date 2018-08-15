/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementProvider(account, adr, abi) {
    this.tmpName;
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

ZSCAgreementProvider.prototype.setTmpName = function(name) {this.tmpName = name;}
ZSCAgreementProvider.prototype.getTmpName = function() {return this.tmpName;}
ZSCAgreementProvider.prototype.getAgrNos = function() {return this.agrNos;}
ZSCAgreementProvider.prototype.getAgrName = function(index) {return this.agrNames[index];}
ZSCAgreementProvider.prototype.getAgrBalance = function(index) {return bF_fixedNumberFromWei(this.balance[index], 4); }
ZSCAgreementProvider.prototype.getAgrStatus = function(index) {return this.status[index];}

ZSCAgreementProvider.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCAgreementProvider.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCAgreementProvider.prototype.loadAgreements = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.numAgreements(gm, function(gm) {
        if (gm.agrNos == 0) {
            callBack();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.agrNos; ++i) {
                gm.getAgreementNameByIndex(gm, i, function(gm, j){
                    gm.getAgreementBalance(gm, j, function(gm, index) {
                        gm.getAgreementStatus(gm, j, function(gm, index) {
                            if (gm.checkAllItemTags(gm) == true) {
                                callBack()
                            }
                        
                            /*
                            if (index == gm.agrNos - 1) {
                                callBack();
                            }
                            */
                        });
                    });
                });
            }
        }
    });
}

ZSCAgreementProvider.prototype.numAgreements = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numElementChildren(gm.tmpName,
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

ZSCAgreementProvider.prototype.getAgreementNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getElementChildNameByIndex(gm.tmpName, index,
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

ZSCAgreementProvider.prototype.getAgreementBalance = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getElementBalance(gm.agrNames[index], "TestZSC",
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.balance[index] = result.toString(10);
                callBack(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementProvider.prototype.getAgreementStatus = function(gm, index, func) {
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

ZSCAgreementProvider.prototype.publishAgreement = function(logId, agrName, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    //createElementNode(bytes32 _factoryType, bytes32 _userName, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
    myControlApi.publishAgreement(agrName, "TestZSC",
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(logId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}


ZSCAgreementProvider.prototype.claimReward = function(hashLogId, elementName, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.claimInsurance(elementName, "TestZSC",
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(hashLogId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

