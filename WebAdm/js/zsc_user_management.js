/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZscUserMangement(adr, abi) {
    this.admAdvAdr = admAdr;
    this.admAdvAbi = abi;
}

ZscUserMangement.prototype.addUser = function(userNameId, hashId, func){
    var userName = document.getElementById(userNameId).value; 
    var myContract = web3.eth.contract(this.admAdvAbi );
    var myControlApi= myContract.at(this.admAdvAdr);
    var account = web3.eth.accounts[0];

    myControlApi.addUser(userName, {from: account, gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashId, result);
        else console.log("error: " + error);
    });
}  



