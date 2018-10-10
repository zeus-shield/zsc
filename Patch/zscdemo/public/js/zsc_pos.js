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

ZSCPos.prototype = new ZSCClient();

ZSCPos.prototype.getUserName = function() {return this.userName;}

ZSCPos.prototype.getRewardNos = function() {return this.rewardNos;}

ZSCPos.prototype.getSPUsedNos = function() {return this.spUsedNos;}

ZSCPos.prototype.getRewardTime = function(index) {return this.rewardTimes[index];}

ZSCPos.prototype.getRewardAmount = function(index) {return this.rewardAmounts[index];}

ZSCPos.prototype.getSPUsedTime = function(index) {return this.spUsedTimes[index];}

ZSCPos.prototype.getSPUsedAmount = function(index) {return this.spUsedAmounts[index];}

ZSCPos.prototype.loadRewardHistory = function(func) {
    this.numMiningInfo(true, function() {
        for (var i = 0; i < this.rewardNos; ++i) {
            this.getRewardInfo(true, i, function(index){
                if (indx == this.rewardNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCPos.prototype.loadSpUsedHistory = function(func) {
    this.numMiningInfo(false, function() {
        for (var i = 0; i < this.spUsedNos; ++i) {
            this.getRewardInfo(false, i, function(index){
                if (indx == this.spUsedNos - 1) {
                    func();
                }
            });
        }
    });
}