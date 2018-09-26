/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPos(nm, abi, adr) {
    this.userName = nm;
    this.rewardNos;
    this.rewardTimes = [];
    this.rewardAmounts = [];
    this.spUsedNos;
    this.spUsedTimes = [];
    this.spUsedAmounts = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}