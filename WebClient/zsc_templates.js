/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTemplate(nm, abi, adr) {
    this.userName = nm;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.tmpChildrenNos = [];
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
}

ZSCTemplate.prototype.getUserName = function() {return this.userName;}

ZSCTemplate.prototype.getTmpName = function(index) { return this.tmpName[index];}

ZSCTemplate.prototype.loadTempates = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.numTemplates(gm, function(gm) {
        if (gm.agrNos == 0) {
            callBack();
        } else {
            for (var i = 0; i < gm.agrNos; ++i) {
                gm.getTmpNameByIndex(gm, i, function(gm, j){
                    gm.numTmpChildrenNos(gm, j, function(gm, index) {
                        if (indx == gm.agrNos - 1) {
                            callBack();
                        }
                    });
                });
            }
        }
    });
}

ZSCTemplate.prototype.numTemplates= function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numTemplates(gm.userName,
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

ZSCTemplate.prototype.getTmpNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getTemplateNameByIndex(gm.userName, index,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                this.tmpNames[index] = web3.toUtf8(result);
                func(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.numTmpChildrenNos = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.numElementChildren(gm.userName, gm.tmpNames[index],
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tmpChildrenNos[index] = result.toString(10);
                func(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

/* zsc API:
   function createElement(bytes32 _userName, uint _typeInUint, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) 
*/

ZSCTemplate.prototype.creatNewTemplate = function(logId, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    var tmpName = gm.userName + "-tmp-" + this.tmpNos
    
    //createElement(bytes32 _userName, bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
    myControlApi.createElementNode("template", gm.userName, tmpName, "null", gm.account,
       {from:gm.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(logId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

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

ZSCTemplate.prototype.loadTemplatesHtml = function(elementId, funcCreateTmp, funcSetPara, funcPublish)  {
    var funcCreateTmpFull = funcCreateTmp + "('CreateNewTemplateHash')"; 

    var funcSetParaPrefix = funcSetPara + "('"; 
    var funcSetParaSuffix = "')";

    var funcPublishPrefix = funcPublish + "('";
    var funcPublishSuffix = "')";

    var text ="";
    text += '<div class="well">';
    text += '   <td><button type="button" onClick="' + funcCreateTmpFull + '">Creat New Template</button></td> <br>'
    text += '   <text id="CreateNewTemplateHash"> </text>'
    text += '</div>';

    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>Index</td> <td>Template name</td> <td>Children Nos.</td> <td>Template details</td> <td>Publish Template</td>'
    text += '</tr>'

    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td><text>' + i + '</text></td>'
        text += '   <td><text>' + this.tmpNames[i]  + '</text></td>'
        text += '   <td><text>' + this.tmpChildrenNos[i]  + '</text></td>'
        text += '   <td><button type="button" onClick="' + funcSetParaPrefix + this.tmpNames[i] + funcSetParaSuffix + '">Show</button></td>'
        text += '   <td><button type="button" onClick="' + funcPublishPrefix + i + funcPublishSuffix + '">Publish</button></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

