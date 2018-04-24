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

ZSCAgreement.prototype.getAgreStatus = function(index) { return this.tokenStatus[index];}

ZSCAgreement.prototype.getAgrName = function(index) { return this.tokenSymbol[index];}

ZSCAgreement.prototype.getAgrAddress = function(index) { return this.tokenAddress[index];}

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

ZSCAgreement.prototype.getAgrNameByIndex = function(index, func) {
    this.myControlApi.getAgreementNameByIndex(this.userName, index,
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
