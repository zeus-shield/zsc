/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotOwned(acount, adr, abi) {
    this.userType;
    this.robotNos = 0;
    this.itemTags = [];

    //default paras: "id", "status", "rare", "spLev"
    //others: "ctg", "name", "minedSP", "rewardSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spEft", "spExtra", "rrEft", "rrExtra", "upProb", "upEft", "upExtra", "upPrice", "price", "seller"     
    this.robotParaBrief = ["spMax"];
    this.robotParaAll   = ["ctg", "name", "minedSP", "rewardSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spEft", "spExtra", "rrEft", "rrExtra", "upProb", "upEft", "upExtra", "upPrice", "price", "seller"];

    this.robotParaBriefValues = [];
    this.robotParaDetailValues = [];

    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCRobotOwned.prototype.getRobotNos = function() { return this.robotNos;}

ZSCRobotOwned.prototype.getRobotParaBriefValue  = function(para, isFromWei, index) { 
    if (isFromWei) {
        return bF_fixedNumberFromWei(this.robotParaBriefValues[index].get(para, 4);
    } else {
        return this.robotParaBriefValues[index].get(para);
    }
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

ZSCRobotOwned.prototype.transferToOther = function(hashId, dest, roobtId) { 
    var gm = this;
    var myErc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.transfer(dest, roobtId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.createGen0Robot = function(hashId, func) { 
    var gm = this;
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.createRobot(
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.enhanceMinerRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.upgradeUnitSpLev(robotId,
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
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.publishUnit(robotId, priceInEther, 
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.cancelSellingMinerRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.cancelSell(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}
    
ZSCRobotOwned.prototype.activeMinerRobot = function(hashId, robotId, tokenType, rewardType, func) {
    var callBack = func;
    var gm = this;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.activeUnit(robotId, tokenType, rewardType,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.claimReward = function(hashId, robotId, tokenType, func) {
    var callBack = func;
    var gm = this;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.claimReward(robotId, tokenType,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}


////////////////////////
ZSCRobotOwned.prototype.loadUserAllRobotBriefs = function(func) {
    var gm = this;
    var callback = func;

    gm.isBriefParas = isBrief;
    gm.numRobots(gm, function(gm) {
        if (gm.robotNos == 0) {
            callback();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.robotNos; ++i) {
                gm.loadRobotBrieInfoByIndex(gm, i, function(gm, index, robotInfo) {
                    gm.parserRobotBrieInfo(gm, index, robotInfo);
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
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.numUserUnits(
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

ZSCRobotOwned.prototype.loadRobotBrieInfoByIndex = function(gm, isBrief, index, func) {
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.getUserUnitInfoByIndex(Number(index), gm.robotParaBrief, 
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

ZSCRobotOwned.prototype.parserRobotBrieInfo = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");
    var paraNos    = newsids.length;

    gm.robotParaBriefValues[index] = new Map()

    for (var i = 0; i < paraNos; ++i) {
        var pair = newsids[i]
        gm.robotParaBriefValues[index].set(pair.split("=")[0], pair.split("=")[1]);
    }
}

////////////////////////
ZSCRobotOwned.prototype.loadUserSingleRobotDetail = function(index, func) {
    var gm = this;
    var callback = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.getUserUnitInfoByIndex(
        Number(index), gm.robotParaAll, 
        {from: gm.account},
        function(error, robotInfo) { 
            if(!error) {
                gm.parserSingleRobotDetailInfo(gm, info);
                callback(); 
            } else { 
                console.log("error: " + error);
            }
        }
    );
}

ZSCRobotOwned.prototype.parserSingleRobotDetailInfo = function(gm, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");
    var paraNos    = newsids.length;

    gm.robotParaDetailValues = new Map()

    for (var i = 0; i < paraNos; ++i) {
        var pair = newsids[i]
        gm.robotParaDetailValues.set(pair.split("=")[0], pair.split("=")[1]);
    }
}

  