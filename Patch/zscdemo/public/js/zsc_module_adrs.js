/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCModuleAdrs(nm, abi, adr) {
    this.adrName = [];
    this.adrValue = [];
    this.userName = nm;
    this.userType;
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
}
