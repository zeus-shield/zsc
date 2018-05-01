/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTemplate(nm, abi, adr) {
    this.userName = nm;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCPos.prototype = new ZSCClient();

ZSCTemplate.prototype.getUserName = function() {return this.userName;}

ZSCTemplate.prototype.getTmpName = function(index) { return this.tmpName[index];}

ZSCTemplate.prototype.loadTempates = function(func) {
    this.numTemplates(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getTmpNameByIndex(i, function(index){
                if (indx == this.agrNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCTemplate.prototype.numTemplates= function(func) {
    this.myControlApi.numTemplates(this.userName,
        {from: this.getAccount(), gas: this.getGasLimit(20)},
        function(error, result){ 
            if(!error) {
                this.agrNos = result.toString(10);
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.getTmpNameByIndex = function(index, func) {
    this.myControlApi.getTemplateNameByIndex(this.userName, index,
        {from: this.getAccount(), gas: this.getGasLimit(20)},
        function(error, result){ 
            if(!error) {
                this.tmpNames[index] = web3.toUtf8(result);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.loadTemplatesHtml = function(elementId)  {
    var timeMoment;
    var inputTag;
    var amount;
    var sender;
    var receiver;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Index</td> <td>Template name</td>'
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.tmpNames[i]  + '</text></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

