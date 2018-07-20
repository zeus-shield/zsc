/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotMarket(account, adr, abi) {
    this.robotNos = 0;
    this.robotIds = [];
    this.robotLevs = [];
    this.robotMaxSP = [];
    this.robotSeller = [];
    this.robotPrceForSale = [];
   
    this.itemTags = [];
    this.account = account;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotMarket.prototype.getRobotNos = function() { return this.robotNos;}
ZSCRobotMarket.prototype.getRobotId  = function(index) { return this.robotIds[index];}
ZSCRobotMarket.prototype.getRobotLev = function(index) { return this.robotLevs[index];}
ZSCRobotMarket.prototype.getRobotSeller = function(index) { return this.robotSeller[index];}
ZSCRobotMarket.prototype.getMaxSP = function(index) { return bF_fixedNumberFromWei(this.robotMaxSP[index], 4); }
ZSCRobotMarket.prototype.getPriceForSale = function(index) { return bF_fixedNumberFromWei(this.robotPrceForSale[index], 4); }

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

ZSCRobotMarket.prototype.purchaseSellingRobot = function(hashId, robotId, func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.purchaseMinerRobot(robotId,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
        });
}

ZSCRobotMarket.prototype.loadRobotsInMarket = function(func) {
    var gm = this;
    var callback = func;

    gm.numRobotsInMarket(gm, function(gm) {
        gm.resetAllItemTags(gm);
       if (gm.robotNos == 0) {
            callback();
        } else {
            gm.loadSellingRobots(gm, function(){
                callback();
            });
        }
    });
}

ZSCRobotMarket.prototype.numRobotsInMarket = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.numSellingMinerRobot({from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.robotNos = result.toString(10); 
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCRobotMarket.prototype.loadSellingRobots = function(gm, func) {
    var callback = func;
    for (var i = 0; i < gm.robotNos; ++i) {
        gm.loadSellingRobotInfoByIndex(gm, i, function(gm, index, info) {
            gm.parserSellingRobotInfo(gm, index, info);
            if (gm.checkAllItemTags(gm) == true) {
                func();
            }
        });
    } 
} 

ZSCRobotMarket.prototype.loadSellingRobotInfoByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getSellingMinerRobotInfoByIndex(index, 
        {from: gm.account},
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

ZSCRobotMarket.prototype.parserSellingRobotInfo = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var robotId = newsids[0];   
    var lev     = newsids[1];  
    var maxSP   = newsids[2]; 
    var price   = newsids[3]; 
    var seller  = newsids[4];

    gm.robotIds[index]          = robotId.split("=")[1];
    gm.robotLevs[index]        = lev.split("=")[1];
    gm.robotMaxSP[index]       = maxSP.split("=")[1];
    gm.robotPrceForSale[index] = price.split("=")[1];
    gm.robotSeller[index]      = seller.split("=")[1];
}

