/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCElement(userName, controlApisAdvAbi, controlApisAdvAdr) {
    this.userName = userName;
    this.enName;
    this.parameNos = 0;
    this.ethBalance = 0;
    this.nodeAddress = 0;
    this.parameterNames = [];
    this.parameterValues = [];
    this.myControlApi = web3.eth.contract(controlApisAdvAbi).at(controlApisAdvAdr);
}

ZSCElement.prototype = new ZSCClient();

ZSCElement.prototype.setElementName = function(nm) {this.enName = nm;}

ZSCElement.prototype.getElementName = function() { return this.enName;}

ZSCElement.prototype.doesElementExisit = function(func) {
    this.myControlApi.doesElementExist(this.userName, this.enName, 
        function(error, ret){ 
            if(!error) func(ret);  
            else  console.log("error: " + error);
        });
}

ZSCElement.prototype.loadParameterNamesAndvalues = function(func) {
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

ZSCElement.prototype.numParameters = function(func) {
    this.myControlApi.numElementParameters(this.userName, this.enName, 
        {from: this.getAccount()},
        function(error, num){ 
            if(!error) { 
                this.parameNos = num.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCElement.prototype.loadParameterNames = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterNameByIndex(i, function(index, para) {
            uF_parameters[index] = para;
            if (index == this.parameNos - 1) {
                func();
            }
        });
    } 
} 

ZSCElement.prototype.loadParameterNameByIndex = function(index, func) {
    this.myControlApi.getElementParameterNameByIndex(this.userName, this.enName, index, 
        {from: this.getAccount()},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCElement.prototype.loadParameterValues = function(func) {
    for (var i = 0; i < this.parameNos; ++i) {
        loadParameterValueByIndex(i, function(index, value) {
            if (index == this.parameNos - 1) {
                func(index);
            }
        });
    } 
} 

ZSCElement.prototype.loadParameterValueByIndex = function(index, func){ 
    this.myControlApi.getElementParameter(this.userName, this.enName, this.getParameterName(index), 
        {from: this.getAccount()},
        function(error, value){ 
            if(!error) {
                this.parameterValues[index] = value;
                func(index, value);
            } else { 
                console.log("error: " + error);
            }
        });
}


ZSCElement.prototype.setElementParameter = function(logID, hr) {
    var myControlApi =  this.myControlApi;

    var info = "";
    var count = 0;

    for (var i = 0; i < uF_parameters.length; ++i) {
        var value = document.getElementById(this.parameterNames[i]).value;
        if (value != this.parameterValues[i]) {
            count ++;
            this.parameterValues[i] = value;

            info += "{<" + this.parameterNames[i] + ">" + "<" + value + ">}";
        }
    }

    if (count > 0) {
        myControlApi.setElementMultipleParameters(hr, info,  
            {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(55000)}, 
            function(error, result){ 
                if(!error) bF_showHashResult(logID, result, function(){});
                else console.log("error: " + error);
        });
    }
} 


ZSCElement.prototype.loadParametersHtml = function(elementId, funcName) {
    var functionInput = funcName + "('SubmitChangesHash')";
   
    var text ="";
    text += '<div class="well">';
   
    for (var i = 0; i < this.parameNos; ++i) {
        text += '   <text>' + this.parameterNames[i] + ': </text>'
        text += '   <input type="text" id="' + this.parameterValues[i] + '"></input>'
    }
    text += '</div>'
    text += '   <button type="button" onClick="' + functionInput + '">Submit Changes</button>'
    text += '   <text id="SubmitChangesHash"></text>'
    text += '</div>'

    document.getElementById(elementId).innerHTML = text;  
}

