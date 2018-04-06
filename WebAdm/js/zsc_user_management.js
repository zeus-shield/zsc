/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZscUserMangement(adr, abi) {
    this.admAdvAdr = admAdr;
    this.admAdvAbi = abi;
    this.userInfo = [];
    this.userNos = 0;
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZscUserMangement.prototype.addUser = function(userNameId, hashId, func){
    var userName = document.getElementById(userNameId).value; 
    this.myControlApi.addUser(userName, {from: this.account, gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashId, result);
        else console.log("error: " + error);
    });
}  

ZscUserMangement.prototype.loadUsers = function(func) {
    this.numUsers(function() {
        this.loadUserInfos(function(index){
            if (index == this.parameNos - 1) {
                func();
            }
        });
    });
}

ZSCElement.prototype.numUsers = function(func) {
    this.myControlApi.numUsers(
        {from: this.account},
        function(error, num){ 
            if(!error) { 
                this.userNos = num.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCElement.prototype.loadUserInfos = function(func) {
    for (var i = 0; i < this.userNos; ++i) {
        loadUserNameByIndex(i, function(index, para) {
                this.userInfo[index] = para;
                if (index == this.userNos - 1) {
                    func();
                 }
            });
    } 
} 

ZSCElement.prototype.loadUserInfoByIndex = function(index, func) {
    this.myControlApi.getUserInfoByIndex(index, 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}


