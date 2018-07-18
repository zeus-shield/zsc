/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotOwned(acount, adr, abi) {
    this.userType;
    this.robotNos = 0;
    this.robotIds = [];
    this.itemTags = [];
    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotOwned.prototype.getUserName = function() {return this.userName;}
ZSCRobotOwned.prototype.getRobotId = function(index) { return this.robotIds[index];}


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








  