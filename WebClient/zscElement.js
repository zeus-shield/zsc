/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function zscElement(nm, abi, adr) {
    this.name = nm;
    this.parameNos = 0;
    this.ethAccount = web3.eth.accounts[0];
    this.ethBalance = 0;
    this.nodeAddress = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.binedElements = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}
zscElement.prototype.getName = function() { return this.name;}

zscElement.prototype.activeTid = function(index, func, time) { this.tid[index] = setInterval(func, time);}

zscElement.prototype.deactiveTid = function(index) { clearInterval(this.tid[index]);}

zscElement.prototype.getEthBalance = function() { return this.ethBalance;}

zscElement.prototype.getAddress = function() { return this.nodeAddress;}

zscElement.prototype.getParameterName = function(index) { return this.parameterNames[index]; }

zscElement.prototype.getParameterValue = function(index) { return this.parameterValues[index]; }

zscElement.prototype.numBindedElements = function() { return this.binedElements.length; }

zscElement.prototype.getBindedElementName = function() { return this.binedElements[index]; }

zscElement.prototype.loadEthBalance = function(func) {
    this.myControlApi.getElementEthBalance(this.name, function(error, balance){ 
        if(!error) {
            this.ethBalance = balance;  
            myControlApi.getElementAddress(this.name, function(error, address){ 
                if(!error) { 
                    this.nodeAddress = address; 
                    func(); 
                } else {
                    console.log("error: " + error);
                }
            });
        }
    });
}

zscElement.prototype.loadParameterNamesAndvalues = function(func) {
    this.numParameters(function() {
        this.loadParameterNames(function() {
            this.loadParameterValues(function(index){
                if (index == this.parameNos - 1) {
                    func();
                }
            });
        }); 
    });
}

zscElement.prototype.numParameters = function(func) {
    this.myControlApi.numElementParameters(this.name, 
        {from: this.ethAccount},
        function(error, num){ 
            if(!error) { 
                this.parameNos = num.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
         });
}

zscElement.prototype.loadParameterNames = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterNameByIndex(i, function(index, para) {
            uF_parameters[index] = para;
            if (index == this.parameNos - 1) {
                func();
            }
        });
    } 
} 

zscElement.prototype.loadParameterNameByIndex = function(index, func) {
    this.myControlApi.getElementParameterNameByIndex(this.name, index, 
        {from: this.ethAccount},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

zscElement.prototype.loadParameterValues = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterValueByIndex(i, function(index, value) {
            if (index == this.parameNos - 1) {
                func(index);
            }
        });
    } 
} 

function loadParameterValueByIndex(index, func){ 
    this.myControlApi.getElementParameter(this.name, this.getParameterName(index), 
        {from: this.ethAccount},
        function(error, value){ 
            if(!error) {
                this.parameterValues[index] = value;
                func(index, value);
            } else { 
                console.log("error: " + error);
            }
        });
}




