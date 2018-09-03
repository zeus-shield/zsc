/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCElement(userName, controlApisAdvAbi, controlApisAdvAdr) {
    this.userName = userName;
    this.userType;
    this.enName;
    this.parameNos = 0;
    this.ethBalance = 0;
    this.nodeAddress = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.nameTags = [];
    this.valueTags = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = controlApisAdvAdr;
    this.contractAbi = JSON.parse(controlApisAdvAbi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCElement.prototype.setUserType = function(type) {this.userType = type;}

ZSCElement.prototype.setElementName = function(nm) {this.enName = nm;}

ZSCElement.prototype.getElementName = function() { return this.enName;}

ZSCElement.prototype.resetAllNameTags = function(gm) {
    for (var i = 0; i < gm.parameNos; ++i) {
        gm.nameTags[i] = false;
    }
}

ZSCElement.prototype.checkAllNameTags = function(gm) {
    for (var i = 0; i < gm.parameNos; ++i) {
        if (gm.nameTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCElement.prototype.resetAllValueTags = function(gm) {
    for (var i = 0; i < gm.parameNos; ++i) {
        gm.valueTags[i] = false;
    }
}

ZSCElement.prototype.checkAllValueTags = function(gm) {
    for (var i = 0; i < gm.parameNos; ++i) {
        if (gm.valueTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCElement.prototype.doesElementExisit = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.doesElementExist(gm.userName, gm.enName, 
        function(error, ret){ 
            if(!error) callBack(ret);  
            else  console.log("error: " + error);
        });
}

ZSCElement.prototype.loadParameterNamesAndvalues = function(func) {
    var gm = this;
    var callBack = func;

    gm.numParameters(gm, function() {
        gm.resetAllNameTags(gm);
        gm.resetAllValueTags(gm);
        gm.loadParameterNames(gm, function(gm) {
            gm.loadParameterValues(gm, function(gm, index){
                callBack();
            });
        }); 
    });
}

ZSCElement.prototype.numParameters = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numElementParameters(gm.userName, gm.enName, 
        {from: gm.account},
        function(error, num){ 
            if(!error) { 
                gm.parameNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}
