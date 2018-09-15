/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotOwned(acount, adr, abi) {
    this.userType;
    this.robotNos = 0;
    this.itemTags = [];
    this.robotIds = [];
    this.robotLevs = [];
    this.robotMaxSP = [];
    this.robotCurSP = [];
    this.robotEnhanceProb = [];
    this.robotMineStart = [];
    this.robotMineEnd = [];
    this.robotPrceToEnhance = [];
    this.robotPrceToCreate = [];
    this.robotPrceForSale = [];
    this.robotRewardRatio = [];
    this.robotRewards = [];
    this.robotExtraSP = [];
    this.robotExtraProb = [];
    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCRobotOwned.prototype.getRobotNos = function() { return this.robotNos;}
ZSCRobotOwned.prototype.getRobotId  = function(index) { return this.robotIds[index];}
ZSCRobotOwned.prototype.getRobotLev = function(index) { return this.robotLevs[index];}
ZSCRobotOwned.prototype.getMaxSP = function(index) { return bF_fixedNumberFromWei(this.robotMaxSP[index], 4);}
ZSCRobotOwned.prototype.getCurSP = function(index) { return bF_fixedNumberFromWei(this.robotCurSP[index], 4);}
ZSCRobotOwned.prototype.getEnhanceProb = function(index) { return this.robotEnhanceProb[index];}
ZSCRobotOwned.prototype.getMineStart = function(index) { return this.secondsToDate(this.robotMineStart[index]);}
ZSCRobotOwned.prototype.getMineEnd = function(index) { return this.secondsToDate(this.robotMineEnd[index]);}
ZSCRobotOwned.prototype.getPriceToEnhance = function(index) { return bF_fixedNumberFromWei(this.robotPrceToEnhance[index], 4); }
ZSCRobotOwned.prototype.getPriceToCreate = function(index) { return bF_fixedNumberFromWei(this.robotPrceToCreate[index], 4); }
ZSCRobotOwned.prototype.getPriceForSale = function(index) { return bF_fixedNumberFromWei(this.robotPrceForSale[index], 4);}
ZSCRobotOwned.prototype.getRewardRatio = function(index) { return this.robotRewardRatio[index];}
ZSCRobotOwned.prototype.getExtraSP = function(index) { return this.robotExtraSP[index];}
ZSCRobotOwned.prototype.getExtraProb = function(index) { return this.robotExtraProb[index];}
ZSCRobotOwned.prototype.miningable = function(index) { return (this.robotMineStart[index] == 0);}

ZSCRobotOwned.prototype.getRewards = function(index) { 
    return bF_fixedNumberFromWei(this.robotRewards[index], 4);
}

ZSCRobotOwned.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.robotNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCRobotOwned.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.robotNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCRobotOwned.prototype.secondsToDate = function(secs) {
    if (secs == 0) return "~";
    var curdate = new Date(null);
    curdate.setTime(secs * 1000);
    return (curdate.toLocaleString());
}

ZSCRobotOwned.prototype.takeOutToOwner = function(hashId, roobtId) { 
    var gm = this;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.takeOutToOwner(roobtId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.transferToOther = function(hashId, dest, roobtId) { 
    var gm = this;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.transferToOther(dest, roobtId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.createGen0Robot = function(hashId, func) { 
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.createMinerRobot(
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.enhanceMinerRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.enhanceMinerRobot(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.publishMinerRobot = function(hashId, robotId, price, func) {
    var gm = this;
    var callBack = func;

    var priceInEther = web3.toWei(price, 'ether');
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.publishMinerRobot(robotId, priceInEther, 
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.cancalSellingMinerRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.cancalSellingMinerRobot(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}
    
ZSCRobotOwned.prototype.activeMinerRobot = function(hashId, robotId, tokenType, rewardType, func) {
    var callBack = func;
    var gm = this;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.activeMinerRobot(robotId, tokenType, rewardType,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.claimReward = function(hashId, robotId, tokenType, func) {
    var callBack = func;
    var gm = this;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.claimReward(robotId, tokenType,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.loadUserRobots = function(func) {
    var gm = this;
    var callback = func;

    gm.numRobots(gm, function(gm) {
        if (gm.robotNos == 0) {
            callback();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.robotNos; ++i) {
                gm.loadRobotInfoByIndex(gm, i, function(gm, index, robotInfo) {
                    gm.parserRobotInfo(gm, index, robotInfo);
                    if (gm.checkAllItemTags(gm) == true) {
                        callback();
                    }
                });
            } 
        }
    });
}

ZSCRobotOwned.prototype.numRobots = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numUserMinerRobot(
        {from: gm.account},
        function(error, num){ 
            if(!error) { 
                gm.robotNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCRobotOwned.prototype.loadRobotInfoByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getUserMinerRobotInfoByIndex(gm.fromSystemWalletTag, Number(index), 
        {from: gm.account},
        function(error, robotInfo){ 
            if(!error) {
                gm.itemTags[index] = true;
                func(gm, index, robotInfo);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCRobotOwned.prototype.parserRobotInfo = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var robotId        = newsids[0];
    var lev            = newsids[1];
    var mineStart      = newsids[2];
    var mineEnd        = newsids[3];
    var curSP          = newsids[4];
    var rewardRatio    = newsids[5];
    var priceForSale   = newsids[6];
    var maxSP          = newsids[7];
    var enhanceProb    = newsids[8];
    var priceToEnhance = newsids[9];
    var priceToCreate  = newsids[10];
    var rewards        = newsids[11];
    //var extraSp        = newsids[12];
    //var extraProb      = newsids[13];

    gm.robotIds[index]           = robotId.split("=")[1];
    gm.robotLevs[index]          = lev.split("=")[1];
    gm.robotMineStart[index]     = mineStart.split("=")[1];
    gm.robotMineEnd[index]       = mineEnd.split("=")[1];
    gm.robotCurSP[index]         = curSP.split("=")[1];
    gm.robotRewardRatio[index]   = rewardRatio.split("=")[1];
    gm.robotPrceForSale[index]   = priceForSale.split("=")[1];
    gm.robotMaxSP[index]         = maxSP.split("=")[1];
    gm.robotEnhanceProb[index]   = enhanceProb.split("=")[1];
    gm.robotPrceToEnhance[index] = priceToEnhance.split("=")[1];
    gm.robotPrceToCreate[index]  = priceToCreate.split("=")[1];
    //gm.robotRewards[index]       = extraSp.split("=")[1];
    //gm.robotExtraProb[index]     = extraProb.split("=")[1];
}

  