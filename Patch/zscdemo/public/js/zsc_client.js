/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCClient() {
}

ZSCClient.prototype.getAccount = function() {
    var account = web3.eth.accounts[0];
    return account;
}