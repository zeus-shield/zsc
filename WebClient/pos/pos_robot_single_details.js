/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotSingleDetails(acount, adr, abi) {
    this.userType;

    //default paras: "id",  "rare", "spLev"
    this.robotDetailParaNames = ["status", "name",  "sellPrice", "seller", "posToken", "minedSP", "rewardSP", "lastSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spBirth", "spExtra", "rrBirth", "rrExtra", "rrLevEft", "upProb", "upBirth", "upExtra", "upPrice"];
    this.robotDetailParaValues = [];

    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCRobotSingleDetails.prototype.getUserAccount = function() {
    return this.account;
}

ZSCRobotSingleDetails.prototype.getRobotDetailParaValue  = function(para, tag) { 
    return bF_robotParaValue(this.robotDetailParaValues.get(para), tag);
}

ZSCRobotSingleDetails.prototype.upgradeMinerRobot = function(hashId, robotId, func) {
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

ZSCRobotSingleDetails.prototype.transferToOther = function(hashId, dest, roobtId, func) { 
    var gm = this;
    var callBack = func;
    var myErc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.transfer(dest, roobtId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotSingleDetails.prototype.publishMinerRobot = function(hashId, robotId, price, func) {
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

ZSCRobotSingleDetails.prototype.cancelSellingMinerRobot = function(hashId, robotId, func) {
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
    
ZSCRobotSingleDetails.prototype.activeMinerRobot = function(hashId, robotId, tokenType, rewardType, func) {
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

ZSCRobotSingleDetails.prototype.claimReward = function(hashId, robotId, func) {
    var callBack = func;
    var gm = this;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.claimReward(robotId, 
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotSingleDetails.prototype.purchaseSellingRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.purchaseUnit(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

////////////////////////
ZSCRobotSingleDetails.prototype.loadSingleRobotDetails = function(robotId, func) {
    var gm = this;
    var callback = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.getUnitInfoById(Number(robotId), gm.robotDetailParaNames, 
        {from: gm.account},
        function(error, info) { 
            if(!error) {
                gm.parserSingleRobotDetailInfo(gm, info);
                callback(); 
            } else { 
                console.log("error: " + error);
            }
        }
    );
}

ZSCRobotSingleDetails.prototype.parserSingleRobotDetailInfo = function(gm, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset + 1,len)
    var newsids    = newsidinfo.split("&");
    var paraNos    = newsids.length;

    gm.robotDetailParaValues = new Map()

    for (var i = 0; i < paraNos; ++i) {
        var pair = newsids[i]
        gm.robotDetailParaValues.set(pair.split("=")[0], pair.split("=")[1]);
    }
}

  