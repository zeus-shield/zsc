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

ZSCPos.prototype.numMiningInfo = function(isReward, func) {
    this.myControlApi.numStakerMining(this.userName, true, 
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                if (isReward) {
                    this.rewardNos = result.toString(10);
                } else {
                    this.spUsedNos = result.toString(10);
                }
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCPos.prototype.getMiningInfoByIndex = function(isReward, index, func) {
    this.myControlApi.getStakerMiningInfoByIndex(this.userName, true, index,
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                this.parserMiningInfo(isReward, info, index);
                func(index);
            } else {
                console.log("error: " + error);
            }
        });
}


ZSCPos.prototype.parserMiningInfo = function(isReward, info, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var timeInfo  = newsids[0];
    var amountInfo = newsids[1];

    if (isReward) {
        this.rewardTimes[index] = timeInfo.split("=")[1];
        this.rewardAmounts[index] = amountInfo.split("=")[1];
    } else {
        this.spUsedTimes[index] = timeInfo.split("=")[1];
        this.spUsedAmounts[index] = amountInfo.split("=")[1];    
    }

    return true;
}

ZSCPos.prototype.loadPosInfoHtml = function(isReward, elementId)  {
    var timeMoment;
    var inputTag;
    var amount;
    var sender;
    var receiver;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'

    if (isReward) {
        text += '<tr>'
        text += '   <td>Reward time</td> <td>Reward amount</td>'
        text += '</tr>'
        for (var i = 0; i < this.tmpNos; ++i) {
            text += '<tr>'
            text += '   <td>' + this.rewardTimes[i] + '</td>'
            text += '   <td>' + this.rewardAmounts[i]  + '</td>'
            text += '</tr>'
        }
    } else {
        text += '<tr>'
        text += '   <td>SP used time</td> <td>SP used amount</td>'
        text += '</tr>'
        for (var i = 0; i < this.tmpNos; ++i) {
            text += '<tr>'
            text += '   <td>' + this.spUsedTimes[i] + '</td>'
            text += '   <td>' + this.spUsedAmounts[i]  + '</td>'
            text += '</tr>'
        }
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

