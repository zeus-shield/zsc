7/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCJsBase() {
    this.moduleType;
}

ZSCJsBase.prototype.setModuleType = function(type){
    this.moduleType = type;
}

ZSCJsBase.prototype.getModuleType = function(type){
    return this.moduleType;
}

ZSCJsBase.prototype.showHashResult = function(elementID, hash, func){
    web3.eth.getTransactionReceipt(hash, 
    function(error, result){ 
        if(!error) {
            var show;
            if (result == null) {
                show =  "(pending)" + hash ;
                this.showHashResult(elementID, hash, func);
            } else {
                if (result.status == 0) {
                    show = "(failure)" + hash;
                } else {
                    show = "(succeeded)" + hash ;
                    func();
                }
            }
            document.getElementById(elementID).innerText = show;
        } else {
            console.log("error: " + error);
        }
    });
} 
