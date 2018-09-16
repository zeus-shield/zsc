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

    this.ratioNos = 0;
    this.ratioType = [];
    this.ratioValue = [];
    this.ratioTags = [];

    this.account = web3.eth.accounts[0];
    this.myPosManager = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
}

ZSCPosManagement.prototype.getLevelNos = function() {return this.levelNos;}
ZSCPosManagement.prototype.getLevelMaxSP = function(index) {return web3.fromWei(this.levelMaxSP[index], 'ether');}
ZSCPosManagement.prototype.getLevelEnhanceProb = function(index) {return this.levelEnhanceProb[index];}
ZSCPosManagement.prototype.getLevelPriceToEnhance = function(index) {return web3.fromWei(this.levelPriceToEnhance[index], 'ether');}
ZSCPosManagement.prototype.getLevelPriceToCreate = function(index) {return web3.fromWei(this.levelPriceToCreate[index], 'ether');}

ZSCPosManagement.prototype.getRatioNos = function() {return this.ratioNos;}
ZSCPosManagement.prototype.getRatioType = function(index) {return this.ratioType[index];}
ZSCPosManagement.prototype.getRatioValue = function(index) {return this.ratioValue[index];}

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

ZSCPosManagement.prototype.downscaledDay = function(hashID, scale) {
    this.myPosManager.downscaledDay(scale, 
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
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setLevelInfo = function(hashID, level, maxStakePoint, enhanceProb, priceToEnhance, priceToCreate) {
    this.myPosManager.setLevelInfo(
        level, web3.toWei(maxStakePoint, 'ether'), enhanceProb, 
        web3.toWei(priceToEnhance, 'ether'), web3.toWei(priceToCreate, 'ether'),
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
ZSCPosManagement.prototype.resetAllRatioTags = function(gm) {
    for (var i = 0; i < gm.ratioNos; ++i) {
        gm.ratioTags[i] = false;
    }
}

ZSCPosManagement.prototype.checkAllRatioTags = function(gm) {
    for (var i = 0; i < gm.ratioNos; ++i) {
        if (gm.ratioTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCPosManagement.prototype.loadRatioInfos = function(func) {
    var gm = this;
    var callback = func;

    gm.numRatios(gm, function(gm) {
        gm.resetAllRatioTags(gm);
       if (gm.ratioNos == 0) {
            callback();
        } else {
            gm.loadRatios(gm, function(){
                callback();
            });
        }
    });
}

ZSCPosManagement.prototype.numRatios = function(gm, func) {
    gm.myPosManager.numRatios(
        {from: gm.account},
        function(error, num){ 
            if(!error) { 
                gm.ratioNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCPosManagement.prototype.loadRatios = function(gm, func) {
    var callback = func;
    for (var i = 0; i < gm.ratioNos; ++i) {
        gm.loadRatioInfoByIndex(gm, i, function(gm, index, userInfo) {
            gm.parserRatioInfo(gm, index, userInfo);
            if (gm.checkAllRatioTags(gm) == true) {
                func();
            }
        });
    } 
} 

ZSCPosManagement.prototype.loadRatioInfoByIndex = function(gm, index, func) {
    gm.myPosManager.getRatioInfoStr(index, 
        {from: gm.account},
        function(error, para){ 
            if(!error) {
                var ret = para;
                gm.ratioTags[index] = true;
                func(gm, index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCPosManagement.prototype.parserRatioInfo = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var ratioType          = newsids[0];
    var ratioValue    = newsids[1];

    gm.ratioType[index]  = ratioType.split("=")[1];
    gm.ratioValue[index] = ratioValue.split("=")[1];
}
