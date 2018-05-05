/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCAgreement(nm, abi, adr) {
    this.userName = nm;
    this.agrNos = 0;
    this.agrName = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCViewAgreement.prototype = new ZSCClient();

ZSCAgreement.prototype.getUserName = function() {return this.userName;}

ZSCAgreement.prototype.loadAgreements = function(func) {
    this.numAgreements(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getAgrNameByIndex(i, function(index){
                if (indx == this.agrNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCAgreement.prototype.numAgreements= function(func) {
    this.myControlApi.numAgreements(this.userName,
        {from: this.getAccount(), gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrNos = result.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreement.prototype.getAgrNameByIndex = function(index, func) {
    this.myControlApi.getAgreementNameByIndex(this.userName, index,
        {from: this.getAccount(), gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrName[index] = web3.toUtf8(result);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreement.prototype.submitPublishAgreement = function(index, func) {
    this.myControlApi.submitPublishAgreement(this.userName, this.agrNames[index] ,
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
            if(!error) {
                func(result);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreement.prototype.confirmPublishAgreement = function(index, func) {
    this.myControlApi.confirmPublishAgreement(this.userName, this.agrNames[index] ,
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
            if(!error) {
                func(result);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCAgreement.prototype.loadAgreementsHtml = function(elementId, func1, func2, func3)  {
    var showPrefix = func1 + "('"; 
    var showSuffix = "')";

    var publishPrefix = func2 + "('"; 
    var publishSuffix = "')";

    var confirmPrefix = func3 + "('"; 
    var confirmSuffix = "')";

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Index</td> <td>Agreement name</td> <td> </td> <td> </td> <td> </td>'
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.agrName[i] + '</text></td>'
        text += '   <td><button type="button" onClick="' + showPrefix + this.agrNames[i] + showSuffix + '">Details</button></td>'
        text += '   <td><button type="button" onClick="' + publishPrefix + i + publishSuffix + '">Publish</button></td>'
        text += '   <td><button type="button" onClick="' + confirmPrefix + i + confirmSuffix + '">Confirm Publish</button></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}
