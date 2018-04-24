/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTemplate(nm, abi, adr) {
    this.userName = nm;
    this.tmpNos = 0;
    this.tmpName = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

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
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrNos = result;
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTemplate.prototype.getTmpNameByIndex = function(index, func) {
    this.myControlApi.getTemplateNameByIndex(this.userName, index,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) {
                this.agrName[index] = result;
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}
