/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTemplate(account, adr, abi) {
    this.userType;
    this.tmpNos = 0;
    this.tmpNames = [];
    this.tmpChildrenNos = [];
    this.itemTags = [];
    this.account = account;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCTemplate.prototype.getTmpName = function(index) { return this.tmpNames[index];}
ZSCTemplate.prototype.getTmpChildrenNos = function(index) { return this.tmpChildrenNos[index];}
ZSCTemplate.prototype.setUserType = function(type) {this.userType = type;}
ZSCTemplate.prototype.getTmpNos = function(type) { return this.tmpNos;}

ZSCTemplate.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCTemplate.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.agrNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCTemplate.prototype.loadTempates = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    gm.numTemplates(gm, function(gm) {
        if (gm.tmpNos == 0) {
            callBack();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.tmpNos; ++i) {
                gm.getTmpNameByIndex(gm, i, function(gm, j){
                    gm.numTmpChildrenNos(gm, j, function(gm, index) {
                        if (gm.checkAllItemTags(gm) == true) {
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

    myControlApi.numTemplates(
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tmpNos = result.toString(10);
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.getTmpNameByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.getTemplateNameByIndex(index,
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tmpNames[index] = web3.toUtf8(result);
                func(gm, index);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.numTmpChildrenNos = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.numElementChildren(gm.tmpNames[index],
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.tmpChildrenNos[index] = result.toString(10);
                gm.itemTags[index] = true;
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

    var tmpName = "-tmp-" + this.tmpNos
    
    //createElement(bytes32 _userName, bytes32 _factoryType, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
    myControlApi.createElementNode("template", gm.userName, tmpName, "null", 
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult(logId, result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.enableAsAgreement = function(tmpIndex, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    var agrName = gm.tmpNames[tmpIndex] + "-agr-" + gm.tmpChildrenNos[tmpIndex];
    var extra = gm.tmpNames[tmpIndex];

    //createElementNode(bytes32 _factoryType, bytes32 _userName, bytes32 _enName, bytes32 _extraInfo, address _extraAdr) public returns (address) {
    myControlApi.createElementNode("agreement", gm.userName, agrName, extra,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                bF_showHashResult("CreateNewAgreementHash", result, callBack);
            } else {
                console.log("error: " + error);
            }
        });
}

