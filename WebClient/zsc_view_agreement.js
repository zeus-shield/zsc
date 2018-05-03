/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCViewAgreement(nm, abi, adr) {
    this.userName = nm;
    this.agrNos = 0;
    this.agrNames = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCViewAgreement.prototype = new ZSCClient();

ZSCViewAgreement.prototype.getUserName = function() {return this.userName;}

ZSCViewAgreement.prototype.loadAllAgreements = function(func) {
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

ZSCViewAgreement.prototype.numAllAgreements= function(func) {
    this.myControlApi.numElements(this.userName, 5, 
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                this.agrNos = result.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCViewAgreement.prototype.getFactoryAgrNameByIndex = function(index, func) {
    this.myControlApi.getElementNameByIndex(this.userName, 5, index,
        {from: this.getAccount(), gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrNames[index] = web3.toUtf8(result);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCViewAgreement.prototype.purchaseAgreement = function(index, func) {
    this.myControlApi.purchaseAgreement(this.userName, this.agrNames[index] ,
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(20)}, 
        function(error, result){ 
            if(!error) {
                func(result);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCViewAgreement.prototype.loadAllAgreementsHtml = function(elementId, func1, func2)  {
    var showPrefix = func1 + "('"; 
    var showSuffix = "')";

    var purchasePrefix = func2 + "('"; 
    var purchaseSuffix = "')";

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Index</td> <td>Agreement name</td>'
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.agrNames[i] + '</text></td>'
        text += '   <td><button type="button" onClick="' + showPrefix + this.agrNames[i] + showSuffix + '">Details</button></td>'
        text += '   <td><button type="button" onClick="' + purchasePrefix + this.agrNames[i] + purchaseSuffix + '">Purchase</button></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}
