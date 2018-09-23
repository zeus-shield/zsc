/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotOwned(acount, adr, abi) {
    this.userType;

    //default paras: "id",  "rare", "spLev"
    this.robotDetailParaNames ["status", "name",  "price", "seller", "posToken", "minedSP", "rewardSP", "lastSP", "rrMineDay", "rrRewardDay", "spCur", "spMax", "spBase", "mineStart", "mineEnd", "spBirth", "spExtra", "rrBirth", "rrExtra", "rrLevEft", "upProb", "upBirth", "upExtra", "upPrice"];
    this.robotDetailParaValues = [];

    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCRobotOwned.prototype.getRobotDetailParaValue  = function(para, index, tag) { 
    return bF_robotParaValue(this.robotDetailParaValues[index].get(para), tag);
}

ZSCRobotOwned.prototype.upgradeMinerRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.upgradeUnitSpLev(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, callBack);
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.transferToOther = function(hashId, dest, roobtId, func) { 
    var gm = this;
    var callBack = func;
    var myErc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.transfer(dest, roobtId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, callBack);
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
            if(!error) bF_showHashResult(hashId, result, callBack);
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
            if(!error) bF_showHashResult(hashId, result, callBack);
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
            if(!error) bF_showHashResult(hashId, result, callBack);
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.claimReward = function(hashId, robotId, func) {
    var callBack = func;
    var gm = this;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.claimReward(robotId, 
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, callBack);
            else console.log("error: " + error);
        });
}


  