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

ZSCAgreement.prototype.loadAgreementsHtml = function(elementId)  {
    var timeMoment;
    var inputTag;
    var amount;
    var sender;
    var receiver;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Index</td> <td>Agreement name</td>'
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.agrName[i] + '</text></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}
