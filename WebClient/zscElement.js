/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function zscElement(nm, abi, adr) {
    this.name = nm;
    this.contractAbi = abi;
    this.contractAdr = adr;
    this.parameNos = 0;
    this.ethBalance = 0;
    this.nodeAddress = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.binedElements = [];
    this.tid = []; 
}
zscElement.prototype.getName = function() { return this.name;}

zscElement.prototype.activeTid = function(index, func, time) { this.tid[index] = setInterval(func, time);}

zscElement.prototype.deactiveTid = function(index) { clearInterval(this.tid[index]);}

zscElement.prototype.getEthBalance = function() { return this.ethBalance;}

zscElement.prototype.getAddress = function() { return this.nodeAddress;}

zscElement.prototype.setParameterName = function(index, para) { this.parameterNames[index] = para; }

zscElement.prototype.getParameterName = function(index) { return this.parameterNames[index]; }

zscElement.prototype.setParameterValue = function(index, value) { this.parameterValues[index] = value; }

zscElement.prototype.getParameterValue = function(index) { return this.parameterValues[index]; }

zscElement.prototype.numBindedElements = function() { return this.binedElements.length; }

zscElement.prototype.getBindedElementName = function() { return this.binedElements[index]; }

zscElement.prototype.getContractApi = function() { return web3.eth.contract(this.contractAbi).at(this.contractAdr);}

zscElement.prototype.loadEthBalance = function(func) {
    var myControlApi = this.getContractApi();

    myControlApi.getElementEthBalance(this.name, function(error, balance){ 
        if(!error) {
            this.ethBalance = balance;  
            myControlApi.getElementAddress(this.name, function(error, address){ 
                if(!error) { this.nodeAddress = address; func(); }
                else console.log("error: " + error);
            });
        }
    });
}

zscElement.prototype.loadParameterNamesAndvalues = function {
    this.parameNos = 0;
    this.activeTid(0, loadParameterNames, 1000);
    this.numParameters();
    this.loadParameterNames();
}

zscElement.prototype.numParameters = function() {
    var myControlApi = this.getContractApi();
    myControlApi.numElementParameters(this.name, {from: uF_getEthAccount()},
         function(error, num){ 
            if(!error) { 
                this.parameNos = num.toString(10); 
            } else {
                console.log("error: " + error);
            }
         });
}

zscElement.prototype.loadParameterNames = function() {
    if (this.parameNos == 0) return;
    this.deactiveTid(0);

    for (var i = 0; i < this.parameNos; ++i) {
    } 
}



