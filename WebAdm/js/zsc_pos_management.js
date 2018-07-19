/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPosManagement(adr, abi) {
    this.levelNos = 0;
    this.levelTags = [];
    this.levelMaxSP = [];
    this.levelEnhanceProb = [];
    this.levelPriceToEnhance = [];
    this.levelPriceToCreate = [];

    this.itemTags = [];
    this.account = web3.eth.accounts[0];
    this.myPosManager = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(700);
}

ZSCPosManagement.prototype.getLevelNos = function() {return this.levelNos;}
ZSCPosManagement.prototype.getLevelMaxSP = function(index) {return this.levelMaxSP[index];}
ZSCPosManagement.prototype.getLevelEnhanceProb = function(index) {return this.levelEnhanceProb[index];}
ZSCPosManagement.prototype.getLevelPriceToEnhance = function(index) {return web3.fromWei(this.levelPriceToEnhance[index], 'ether');}
ZSCPosManagement.prototype.getLevelPriceToCreate = function(index) {return web3.fromWei(this.levelPriceToCreate[index], 'ether');}

ZSCPosManagement.prototype.downscaledDay = function(hashID, scale) {
    this.myPosManager.downscaledDay(scale, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setGen0RobotMaxNos = function(hashID, nos) {
    this.myPosManager.setGen0RobotNos(nos, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setRewardRatio = function(hashID,  durationInDays, ratio_0_10000) {
    this.myPosManager.setRewardRatio(durationInDays, ratio_0_10000,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setLevelInfo = function(hashID, level, maxStakePoint, enhanceProb, priceToEnhance, priceToCreate) {
    this.myPosManager.setLevelInfo(level, maxStakePoint, enhanceProb, priceToEnhance, priceToCreate,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

//////////////
ZSCPosManagement.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.userNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCPosManagement.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.userNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCPosManagement.prototype.loadLevelInfos = function(func) {
    var gm = this;
    var callback = func;

    gm.numLevels(gm, function(gm) {
        gm.resetAllItemTags(gm);
       if (gm.levelNos == 0) {
            callback();
        } else {
            gm.loadLevels(gm, function(){
                callback();
            });
        }
    });
}

ZSCPosManagement.prototype.numLevels = function(gm, func) {
    gm.myPosManager.numLevels(
        {from: gm.account},
        function(error, num){ 
            if(!error) { 
                gm.levelNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCPosManagement.prototype.loadLevels = function(gm, func) {
    var callback = func;
    for (var i = 0; i < gm.levelNos; ++i) {
        gm.loadUserInfoByIndex(gm, i, function(gm, index, userInfo) {
            gm.parserLevelInfo(gm, index, userInfo);
            if (gm.checkAllItemTags(gm) == true) {
                func();
            }
        });
    } 
} 

ZSCPosManagement.prototype.loadUserInfoByIndex = function(gm, index, func) {
    gm.myPosManager.getLevelInfoByIndex(index, 
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

ZSCPosManagement.prototype.parserLevelInfo = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var levelTags           = newsids[0];
    var levelMaxSP          = newsids[1];
    var levelEnhanceProb    = newsids[2];
    var levelPriceToEnhance = newsids[3];
    var levelPriceToCreate  = newsids[4];

    gm.levelTags[index]           = levelTags.split("=")[1];
    gm.levelMaxSP[index]          = levelMaxSP.split("=")[1];
    gm.levelEnhanceProb[index]    = levelEnhanceProb.split("=")[1];
    gm.levelPriceToEnhance[index] = levelPriceToEnhance.split("=")[1];
    gm.levelPriceToCreate[index]  = levelPriceToCreate.split("=")[1];
}
