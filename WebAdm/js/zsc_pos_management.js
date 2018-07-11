/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPosMangement(adr, abi) {
    this.vpuNos = 0;
    this.vpuUser = [];
    this.vpuActivated = [];
    this.vpuBuyable = [];
    this.vpuLevel = [];
    this.vpuPrice = [];

    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(700);
}

ZSCPosMangement.prototype = new ZSCJsBase();




    
