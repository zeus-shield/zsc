/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotOwned(acount, adr, abi) {
    this.userType;
    this.robotNos = 0;
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
    this.itemTags = [];
    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotOwned.prototype.getRobotNos = function() { return this.robotNos;}
ZSCRobotOwned.prototype.getRobotId  = function(index) { return this.robotIds[index];}
ZSCRobotOwned.prototype.getRobotLev = function(index) { return this.robotLevs[index];}
ZSCRobotOwned.prototype.getMaxSP = function(index) { return this.robotMaxSP[index];}
ZSCRobotOwned.prototype.getCurSP = function(index) { return this.robotCurSP[index];}
ZSCRobotOwned.prototype.getEnhanceProb = function(index) { return this.robotEnhanceProb[index];}
ZSCRobotOwned.prototype.getMineStart = function(index) { return this.robotMineStart[index];}
ZSCRobotOwned.prototype.getMineEnd = function(index) { return this.robotMineEnd[index];}
ZSCRobotOwned.prototype.getPrceToEnhance = function(index) { return this.robotPrceToEnhance[index];}
ZSCRobotOwned.prototype.getPrceToCreate = function(index) { return this.robotPrceToCreate[index];}
ZSCRobotOwned.prototype.getPrceForSale = function(index) { return this.robotPrceForSale[index];}

ZSCRobotOwned.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.userNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCRobotOwned.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.userNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCRobotOwned.prototype.createGen0Robot = function(func) { 
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.createMinerRobot(
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCRobotOwned.prototype.enhanceMinerRobot = function(robotId, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.enhanceMinerRobot(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                func();
            } else {
                console.log("error: " + error);
            }
        });
}
    
ZSCRobotOwned.prototype.activeMinerRobot = function(robotId, rewardType, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.activeMinerRobot(robotId, rewardType,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) {
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCRobotOwned.prototype.loadUsers = function(phpFunc) {
    this.phpCallback = phpFunc;
    this.numUsers(this, function(gm) {
        gm.resetAllItemTags(gm);
       if (gm.userNos == 0) {
            gm.phpCallback();
        } else {
            gm.loadUserInfos();
        }
    });
}

  