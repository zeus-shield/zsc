/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCShowUserTmps(adr, abi) {
    this.userName;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCShowUserTmps.prototype = new ZSCJsBase();

ZSCShowUserTmps.prototype.setUserName = function(userName) {
    this.userName = userName;
    this.setModuleType("userTemplates");
}

ZSCShowUserTmps.prototype.loadUserAgrs = function(func) {
    this.numUserTmps(function() {
        for (var i = 0; i < this.tmpNos; ++i) {
            this.getTmpNameByIndex(i, function(index){
                if (indx == this.tmpNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCShowUserTmps.prototype.numUserTmps= function(func) {
    this.myControlApi.numTemplates(this.userName,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.tmpNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserTmps.prototype.getTmpNameByIndex = function(index, func) {
    this.myControlApi.getTemplateNameByIndex(this.userName, index,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.tmpNames[index] = result;
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCShowUserTmps.prototype.loadUserTmpsHtml = function(funcName, elementId)  {
    var funcPrefix = funcName + '('; 
    var funcSuffix = ')"';

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Index</text></td> <td><text>Template Name</text></td>  '
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><button type="button" onClick="' + showPrefix + "'" + this.userName + "', '" + i + "'" + showSuffix + '">Details</button>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.tmpNames[i] + '</text></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}
