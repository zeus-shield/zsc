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
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(743);
}

ZSCShowElement.prototype = new ZSCJsBase();

ZSCShowElement.prototype.init = function(userName, enName) {
    this.userName = userName;
    this.enName = enName;
}

ZSCShowElement.prototype.loadParameterNamesAndvalues = function(func) {
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

ZSCShowElement.prototype.loadParameterNames = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterNameByIndex(i, function(index, para) {
            uF_parameters[index] = para;
            if (index == this.parameNos - 1) {
                func();
            }
        });
    } 
} 

ZSCShowElement.prototype.loadParameterNameByIndex = function(index, func) {
    this.myControlApi.getElementParameterNameByIndex(this.name, index, 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCShowElement.prototype.loadParameterValues = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterValueByIndex(i, function(index, value) {
            if (index == this.parameNos - 1) {
                func(index);
            }
        });
    } 
} 

ZSCShowElement.prototype.loadParameterValueByIndex = function(index, func){ 
    this.myControlApi.getElementParameter(this.name, this.parameterNames[index], 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                this.parameterValues[index] = web3.toUtf8(para);
                func(index, value);
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCShowElement.prototype.loadParameterValueHtml = function(elementId) {
    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Parameter name</td> <td>Parameter value</td>'
    text += '</tr>'

    for (var i = 0; i < this.parameNos; ++i) {
        var symbol = this.walletSymbols(i);
        var adr = this.walletAdrs(i);
        var balance = this.walletAdrs(i);
        var enName = this.userName + '+' + symbol;
        text += '<tr>'
        text += '   <td><text>' + this.parameterNames[i] + '</text></td>'
        text += '   <td><text>' + this.parameterValues[i]  + '</text></td>'  
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}


