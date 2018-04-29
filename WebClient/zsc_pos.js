/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPos(nm, abi, adr) {
    this.userName = nm;
    this.rewardNos;
    this.rewardTime = [];
    this.rewardAmount = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCPos.prototype.getUserName = function() {return this.userName;}

ZSCPos.prototype.getRewardNos = function() {return this.rewardNos;}

ZSCPos.prototype.getRewardTime = function(index) {return this.rewardTime[index];}

ZSCPos.prototype.getRewardAmount = function(index) {return this.rewardAmount[index];}

ZSCPos.prototype.loadRewardHistory = function(func) {
    this.numRewards(function() {
        for (var i = 0; i < this.rewardNos; ++i) {
            this.getRewardInfo(i, function(index){
                if (indx == this.rewardNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCTemplate.prototype.numRewards = function(func) {
   
}

ZSCTemplate.prototype.getRewardInfo = function(index, func) {
}
