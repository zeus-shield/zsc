/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCClient() {
}

ZSCClient.prototype.getAccount = function() {
    var account = web3.eth.accounts[0];
    return account;
}

ZSCClient.prototype.getGasPrice = function(limit) {
    return limit * 1000000000; //limits * gwei
}

ZSCClient.prototype.getGasLimit = function(limit) {
    return limit * 1000 * 1000; //limits * 1 million
}
