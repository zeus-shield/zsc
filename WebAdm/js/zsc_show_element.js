/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCShowElement(controlApisAdvAbi, controlApisAdvAdr) {
    this.userName;
    this.enName;
    this.parameNos = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(controlApisAdvAbi).at(controlApisAdvAdr);
}

ZSCShowUserAgrs.prototype = new ZSCJsBase();

ZSCShowElement.prototype.init = function(userName, enName) {
    this.userName = userName;
    this.enName = enName;
}

ZSCShowElement.prototype.loadParameterNamesAndvalues = function(func) {
    this.numParameters(function() {
        this.loadParameterNames(function() {
            
        }); 
    });
}

ZSCShowElement.prototype.numParameters = function(func) {
    this.myControlApi.numElementParameters(this.name, 
        {from: this.account},
        function(error, num){ 
            if(!error) { 
                this.parameNos = num.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
         });
}



