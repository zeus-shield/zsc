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

ZSCRobotOwned.prototype.createGen0Robot = function(hashId, func) { 
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.createMinerRobot(
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotOwned.prototype.enhanceMinerRobot = function(hashId, robotId, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.enhanceMinerRobot(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
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

ZSCRobotOwned.prototype.loadUserRobots = function(func) {
    var gm = this;
    var callback = func;

    gm.numRobots(gm, function(gm) {
        if (gm.robotNos == 0) {
            callback();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.robotNos; ++i) {
                gm.loadRobotInfoByIndex(this, i, function(gm, index, userInfo) {
                    gm.parserUserInfo(index, userInfo);
                    if (gm.checkAllItemTags(gm) == true) {
                        callback();
                    }
                });
            } 
        }
}

ZSCRobotOwned.prototype.numRobots = function(gm, func) {
    gm.myAdmAdv.numUsers(
        {from: this.account},
        function(error, num){ 
            if(!error) { 
                gm.userNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCRobotOwned.prototype.loadRobotInfoByIndex = function(gm, index, func) {
    var gm = this;
    gm.myAdmAdv.getUserInfoByIndex(index, 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                var ret = para;
                gm.itemTags[index] = true;
                func(gm, index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCRobotOwned.prototype.parserUserInfo = function(index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var userName    = newsids[0];
    var userStatus  = newsids[1];
    var userType    = newsids[2];
    var userNodeAdr = newsids[3];
    var userEthAdr  = newsids[4];

    this.userName[index]    = userName.split("=")[1];
    this.userStatus[index]  = userStatus.split("=")[1];
    this.userType[index]    = userType.split("=")[1];
    this.userNodeAdr[index] = "0x" + userNodeAdr.split("=")[1];
    this.userEthAdr[index]  = "0x" + userEthAdr.split("=")[1];
}

  