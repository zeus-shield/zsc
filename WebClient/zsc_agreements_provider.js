/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreementProvider(nm, abi, adr) {
    this.userName = nm;
    this.tmpName;
    this.agrNos = 0;
    this.agrNames = [];
    this.balance = [];
    this.itemTags = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCAgreementProvider.prototype.getUserName = function() {return this.userName;}

ZSCAgreementProvider.prototype.setTemplateName = function(name) {this.tmpName = name;}

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
                gm.getAgrNameByIndex(gm, i, function(gm, j){
                    gm.getAgrBalance(gm, j, function(gm, index) {
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
            }
        }
    });
}

ZSCAgreementProvider.prototype.numAgreements = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numElementChildren(gm.userName, gm.tmpName,
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

ZSCAgreementProvider.prototype.getAgrNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getElementChildNameByIndex(gm.userName, gm.tmpName, index,
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

ZSCAgreementProvider.prototype.getAgrBalance = function(gm, index, func) {
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

ZSCAgreementProvider.prototype.publishAgreement = function(agrName, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    //createElementNode(bytes32 _factoryType, bytes32 _userName, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
    myControlApi.publishAgreement(gm.userName, agrName,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult("PublishAgreementHash", result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}


ZSCAgreementProvider.prototype.claimReward = function(hashLogId, elementName, func) {
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

ZSCAgreementProvider.prototype.loadAgreementsHtml = function(elementId, funcPublish, funcSetPara)  {
    var funcSetParaPrefix = funcSetPara + "('"; 
    var funcSetParaSuffix = "')";

    var funcPublishPrefix = funcPublish + "('"; 
    var funcPublishSuffix = "')";

    var titlle = "provider [" + this.userName + "] - published agreements: "

    var text ="";
    text += '<div class="well"> <text>' + titlle + ' </text></div>';
    text += '<div class="well">';    
    text += '<div class="well">';
    text += '<text> Publish agreement: </text> <text id="PublishAgreementHash"> </text>'
    text += '</div>';

    text += '<table align="center" style="width:600px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Name</td> <td>Balance </td> <td>Publish </td> <td>Details </td>'
    text += '</tr>'
    text += '<tr> <td>---</td> <td>---</td> <td>---</td> </tr>'

    for (var i = 0; i < this.agrNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + this.agrNames[i]  + '</text></td>'
        text += '   <td><text>' + this.balance[i]  + '</text></td>'
        text += '   <td><button type="button" onClick="' + funcPublishPrefix + this.agrNames[i] + funcPublishSuffix + '">Publish</button></td>'
        text += '   <td><button type="button" onClick="' + funcSetParaPrefix + this.agrNames[i] + funcSetParaSuffix + '">Show</button></td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td>  </tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

