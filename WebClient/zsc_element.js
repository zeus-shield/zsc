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
    this.account = web3.eth.accounts[0];
    this.contractAdr = controlApisAdvAdr;
    this.contractAbi = JSON.parse(controlApisAdvAbi);
}

ZSCElement.prototype.setUserType = function(type) {this.userType = type;}

ZSCElement.prototype.setElementName = function(nm) {this.enName = nm;}

ZSCElement.prototype.getElementName = function() { return this.enName;}

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
        gm.loadParameterNames(gm, function(gm) {
            gm.loadParameterValues(gm, function(gm, index){
                if (index == gm.parameNos - 1) {
                    callBack();
                }
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

ZSCElement.prototype.loadParameterNames = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    for (var i = 0; i < gm.parameNos; ++i) {
        gm.loadParameterNameByIndex(gm, i, function(index, para) {
            gm.parameterNames[index] = para;
            if (index == gm.parameNos - 1) {
                func(gm, index);
            }
        });
    } 
} 

ZSCElement.prototype.loadParameterNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getElementParameterNameByIndex(gm.userName, gm.enName, index, 
        {from: gm.account},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCElement.prototype.loadParameterValues = function(gm, func) {
    var callBack = func;
    for (var i = 0; i < gm.parameNos; ++i) {
        gm.loadParameterValueByIndex(gm, i, function(gm, index) {
            if (index == gm.parameNos - 1) {
                callBack(gm, index);
            }
        });
    } 
} 

ZSCElement.prototype.loadParameterValueByIndex = function(gm, index, func){ 
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getElementParameter(gm.userName, gm.enName, gm.parameterNames[index], 
        {from: gm.account},
        function(error, value){ 
            if(!error) {
                gm.parameterValues[index] = web3.toUtf8(value);
                if (index == gm.parameNos - 1) {
                     callBack(gm, index);
                }
            } else { 
                console.log("error: " + error);
            }
        });
}


ZSCElement.prototype.setElementParameter = function(logID, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    var info = "";
    var count = 0;

    for (var i = 0; i < gm.parameNos; ++i) {
        var value = document.getElementById(gm.parameterNames[i]).value;
        if (value != gm.parameterValues[i]) {
            count ++;
            gm.parameterValues[i] = value;

            info += "{<" + gm.parameterNames[i] + ">" + "<" + value + ">}";
        }
    }

    if (count > 0) {
        myControlApi.setElementMultipleParameters(gm.userName, gm.enName, info,  
            {from:gm.account, gas: 9000000},
            function(error, result){ 
                if(!error) bF_showHashResult(logID, result, callBack);
                else console.log("error: " + error);
        });
    }
} 


ZSCElement.prototype.loadParametersHtml = function(elementId, type, funcName) {
    var functionInput = funcName + "('SubmitChangesHash')";
    var titlle;

    if (type == "profile") {
        titlle = "user [" + this.userName + "] profile: "
    } else {
        titlle = "entity [" + this.enName + "] details: "
    }
   
    var text ="";
    text += '<div class="well"> <text>' + titlle + ' </text></div>';
    text += '<div class="well">';
    text += '<table align="center" style="width:600px;min-height:30px">'

    var paraName;

    for (var i = 0; i < this.parameNos; ++i) {
        paraName = this.parameterNames[i];
        if (paraName == "duration") {
            paraName += " (seconds) [>=60]";
        } else if (paraName == "price") {
            paraName += " [>0]";
        } else if (paraName == "insurance") {
            paraName += " (locked for claim) [>0]";
        }
        text += '<tr>'
        text += '  <td> <text>' + paraName + ': </text> </td>'
        text += '  <td> <input type="text" id="' + this.parameterNames[i] + '" value="' + this.parameterValues[i] + '"></input> </td>'
        text += '</tr>'
    }
    text += '</table></div>'
    if (type == "agreement-provider") {
        text += '<div>'
        text += '   <button type="button" onClick="' + functionInput + '">Back</button>'
        text += '</div>'
    } else if (type == "agreement-all") {
        if (this.userT)
        text += '<div>'
        text += '   <button type="button" onClick="' + functionInput + '">Back</button>'
        text += '</div>'
    } else {
        text += '<div>'
        text += '   <button type="button" onClick="' + functionInput + '">Submit Changes</button>'
        text += '   <text id="SubmitChangesHash"></text>'
        text += '</div>'
    }

    document.getElementById(elementId).innerHTML = text;  
}


