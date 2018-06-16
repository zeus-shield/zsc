/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementReceiver(nm, abi, adr) {
    this.userName = nm;
    this.tmpName;
    this.agrNos = 0;
    this.agrNames = [];
    this.balance = [];
    this.itemTags = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice(20);
    this.gasLimit = bF_getGasLimit(743);
}

ZSCAgreementReceiver.prototype.getUserName = function() {return this.userName;}

ZSCAgreementReceiver.prototype.setTemplateName = function(name) {this.tmpName = name;}

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
                        if (gm.checkAllItemTags(gm) == true) {
                            callBack()
                        }
                        /*if (index == gm.agrNos - 1) {
                            callBack();
                        }*/
                    });
                });
            }
        }
    });
}

ZSCAgreementReceiver.prototype.numAgreements= function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numAgreements(gm.userName, 
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
    
    myControlApi.getAgreementNameByIndex(gm.userName,  index,
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
    
    myControlApi.getElementBalance(gm.userName, gm.agrNames[index], "ZSC",
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.balance[index] = result.toString(10);
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
    
    myControlApi.claimInsurance(gm.userName, elementName,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(hashLogId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreementReceiver.prototype.loadAgreementsHtml = function(elementId, funcShowPara)  {
    var funcShowParaPrefix = funcShowPara + "('"; 
    var funcShowParaSuffix = "')";

    var titlle = "provider [" + this.userName + "] - published agreements: "

    var text ="";
    text += '<div class="well">';
    text += '<div class="well"> <text>' + titlle + ' </text></div>';
    text += '<table align="center" style="width:600px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Name</td> <td>Balance </td> <td>Details </td>'
    text += '</tr>'
    text += '<tr> <td>---</td> <td>---</td> <td>---</td> </tr>'

    for (var i = 0; i < this.agrNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + this.agrNames[i]  + '</text></td>'
        text += '   <td><text>' + this.balance[i]  + '</text></td>'
        text += '   <td><button type="button" onClick="' + funcShowParaPrefix + this.agrNames[i] + funcShowParaSuffix + '">Show</button></td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td>  </tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

