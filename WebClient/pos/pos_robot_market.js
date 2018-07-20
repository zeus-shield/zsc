/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotMarket(account, adr, abi) {
    this.robotNos = 0;
    this.robotIds = [];
    this.robotLevs = [];
    this.robotMaxSP = [];
    this.robotPrceForSale = [];
   
    this.itemTags = [];
    this.account = account;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotOwned.prototype.getRobotNos = function() { return this.robotNos;}
ZSCRobotOwned.prototype.getRobotId  = function(index) { return this.robotIds[index];}
ZSCRobotOwned.prototype.getRobotLev = function(index) { return this.robotLevs[index];}
ZSCRobotOwned.prototype.getMaxSP = function(index) { return web3.fromWei(this.robotMaxSP[index], 'ether');}
ZSCRobotOwned.prototype.getPrceForSale = function(index) { return web3.fromWei(this.robotPrceForSale[index], 'ether');}

ZSCRobotMarket.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.robotNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCRobotMarket.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.robotNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCRobotMarket.prototype.loadRobotsInMarket = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    gm.numSellingMinerRobot(gm, function(gm) {
       if (gm.robotNos == 0) {
            callBack();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.robotNos; ++i) {
            }
        }
    });
}

ZSCRobotMarket.prototype.numRobotsInMarket = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.numRobotsInMarket({from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.robotNos = result.toString(10); 
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}