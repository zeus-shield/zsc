/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTemplate(nm, abi, adr) {
    this.userName = nm;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.tmpChildrenNos = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCPos.prototype = new ZSCClient();

ZSCTemplate.prototype.getUserName = function() {return this.userName;}

ZSCTemplate.prototype.getTmpName = function(index) { return this.tmpName[index];}

ZSCTemplate.prototype.loadTempates = function(func) {
    this.numTemplates(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getTmpNameByIndex(i, function(j){
                this.numTmpChildrenNos(j, function(index) {
                    if (indx == this.agrNos - 1) {
                        func();
                    }
                });
            });
        }
    });
}

ZSCTemplate.prototype.numTemplates= function(func) {
    this.myControlApi.numTemplates(this.userName,
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

ZSCTemplate.prototype.getTmpNameByIndex = function(index, func) {
    this.myControlApi.getTemplateNameByIndex(this.userName, index,
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                this.tmpNames[index] = web3.toUtf8(result);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.numTmpChildrenNos = function(index, func) {
    this.myControlApi.numElementChildren(this.userName, this.tmpNames[index],
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                this.tmpChildrenNos[index] = result.toString(10);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}

/* zsc API:
   function createElement(bytes32 _userName, uint _typeInUint, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) 
*/

ZSCTemplate.prototype.enableAsAgreement = function(index, func) {
    this.myControlApi.createElement(this.userName, 5, this.tmpNames[i] + "-agr-" + this.tmpChildrenNos[index], this.tmpNames[i], 0,
        {from: this.getAccount(), gasPrice: this.getGasPrice(1), gas : this.getGasLimit(55000)},
        function(error, result){ 
            if(!error) {
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.loadTemplatesHtml = function(elementId, funcSetPara, funcPublish)  {
    var funcSetParaPrefix = funcSetPara + "('"; 
    var funcSetParaSuffix = "')";

    var funcPublishPrefix = funcPublish + "('";
    var funcPublishSuffix = "')";

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Index</td> <td>Template name</td> <td>Template details</td> <td>Publish Template</td>'
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.tmpNames[i]  + '</text></td>'
        text += '   <td><button type="button" onClick="' + funcSetParaPrefix + this.tmpNames[i] + funcSetParaSuffix + '">Show</button></td>'
        text += '   <td><button type="button" onClick="' + funcPublishPrefix + i + funcPublishSuffix + '">Publish</button></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

