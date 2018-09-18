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

    this.mineTypeNos = 0;
    this.mineTypeDuration = [];
    this.mineTypeActived = [];
    this.mineTypeTags = [];

    this.account = web3.eth.accounts[0];
    this.myPosManager = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
}

ZSCPosManagement.prototype.getLevelNos = function() {return this.levelNos;}
ZSCPosManagement.prototype.getLevelMaxSP = function(index) {return web3.fromWei(this.levelMaxSP[index], 'ether');}
ZSCPosManagement.prototype.getLevelUpProb = function(index) {return this.levelEnhanceProb[index];}
ZSCPosManagement.prototype.getLevelUpPrice= function(index) {return web3.fromWei(this.levelPriceToEnhance[index], 'ether');}
ZSCPosManagement.prototype.getLevelCreatePrice = function(index) {return web3.fromWei(this.levelPriceToCreate[index], 'ether');}

ZSCPosManagement.prototype.getMineTypeNos = function() {return this.mineTypeNos;}
ZSCPosManagement.prototype.getMineTypeDuration = function(index) {return this.mineTypeDuration[index];}
ZSCPosManagement.prototype.getMineTypeActived = function(index) {return this.mineTypeActived[index];}

ZSCPosManagement.prototype.setTradeableInMarket = function(hashID, tag) {
    this.myPosManager.setPublicTradeable(tag, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setCommonTokenUrl = function(hashID, url) {
    this.myPosManager.setCommenTokenURI(url, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setCreatePrice = function(hashID, createPrice) {
    this.myPosManager.setCreatePrice(url, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.downscaledDay = function(hashID, scale) {
    this.myPosManager.downscaledDay(scale, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setMineType = function(hashID,  durationInDays, tag) {
    this.myPosManager.setMineType(durationInDays, tag,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setPosRatio = function(hashID, mineRatio, rewardRatio) {
    this.myPosManager.setPosRatio(mineRatio, rewardRatio,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setLevelInfo = function(hashID, level, maxStakePoint, enhanceProb, priceToEnhance) {
    this.myPosManager.setLevelInfo(
        level, 
        web3.toWei(maxStakePoint, 'ether'), 
        enhanceProb, 
        web3.toWei(priceToEnhance, 'ether'), 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

//////////////
ZSCPosManagement.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.levelNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCPosManagement.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.levelNos; ++i) {
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
        gm.loadLevelInfoByIndex(gm, i, function(gm, index, userInfo) {
            gm.parserLevelInfo(gm, index, userInfo);
            if (gm.checkAllItemTags(gm) == true) {
                func();
            }
        });
    } 
} 

ZSCPosManagement.prototype.loadLevelInfoByIndex = function(gm, index, func) {
    gm.myPosManager.getLevelInfoStr(index, 
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

    var levelMaxSP          = newsids[0];
    var levelEnhanceProb    = newsids[1];
    var levelPriceToEnhance = newsids[2];
    var levelPriceToCreate  = newsids[3];

    gm.levelTags[index]           = index;
    gm.levelMaxSP[index]          = levelMaxSP.split("=")[1];
    gm.levelEnhanceProb[index]    = levelEnhanceProb.split("=")[1];
    gm.levelPriceToEnhance[index] = levelPriceToEnhance.split("=")[1];
    gm.levelPriceToCreate[index]  = levelPriceToCreate.split("=")[1];
}

////////////////////////////
ZSCPosManagement.prototype.resetAllMineTypeTags = function(gm) {
    for (var i = 0; i < gm.mineTypeNos; ++i) {
        gm.mineTypeTags[i] = false;
    }
}

ZSCPosManagement.prototype.checkAllMineTypeTags = function(gm) {
    for (var i = 0; i < gm.mineTypeNos; ++i) {
        if (gm.mineTypeTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCPosManagement.prototype.loadMineTypeInfos = function(func) {
    var gm = this;
    var callback = func;

    gm.numMineTypes(gm, function(gm) {
        gm.resetAllMineTypeTags(gm);
       if (gm.mineTypeNos == 0) {
            callback();
        } else {
            gm.loadRatios(gm, function(){
                callback();
            });
        }
    });
}

ZSCPosManagement.prototype.numMineTypes = function(gm, func) {
    gm.myPosManager.numMineTypes(
        {from: gm.account},
        function(error, num){ 
            if(!error) { 
                gm.mineTypeNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCPosManagement.prototype.loadMineTypes = function(gm, func) {
    var callback = func;
    for (var i = 0; i < gm.mineTypeNos; ++i) {
        gm.loadMineTypeByIndex(gm, i, function(gm, index, userInfo) {
            gm.parserMineTypeStr(gm, index, userInfo);
            if (gm.checkAllMineTypeTags(gm) == true) {
                func();
            }
        });
    } 
} 

ZSCPosManagement.prototype.loadMineTypeByIndex = function(gm, index, func) {
    gm.myPosManager.getMineTypeStr(index, 
        {from: gm.account},
        function(error, para){ 
            if(!error) {
                var ret = para;
                gm.mineTypeTags[index] = true;
                func(gm, index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCPosManagement.prototype.parserMineTypeStr = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var mineTypeDuration   = newsids[0];
    var mineTypeActived    = newsids[1];

    gm.mineTypeDuration[index] = mineTypeDuration.split("=")[1];
    gm.mineTypeActived[index]  = mineTypeActived.split("=")[1];
}

