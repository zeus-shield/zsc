/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPosManagement(adr, abi) {
    this.levelNos = 0;
    this.levelTags = [];
    this.levelMaxSP = [];
    this.levelEnhanceProb = [];
    this.levelPriceToEnhance = [];
    this.itemTags = [];

    this.tradeTag;
    this.dayInSecs;  
    this.createPrice; 
    this.minePerDay;  
    this.rewardPerDay;
    this.tokenUri;    

    this.mineTypeNos = 0;
    this.mineTypeDuration = [];
    this.mineTypeRRLevEft = [];
    this.mineTypeActived = [];
    this.mineTypeTags = [];

    this.unitCtgNos = 0;
    this.unitCtgTypes = [];
    this.unitCtgNames = [];
    this.unitCtgRares = [];
    this.unitCtgSPEftMin = [];
    this.unitCtgSPEftMax = [];
    this.unitCtgRREftMin = [];
    this.unitCtgRREftMax = [];
    this.unitCtgUPEftMin = [];
    this.unitCtgUPEftMax = [];
    this.unitCtgTags = [];

    this.account = web3.eth.accounts[0];
    this.myPosManager = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
}

ZSCPosManagement.prototype.getLevelNos = function() {return this.levelNos;}
ZSCPosManagement.prototype.getLevelMaxSP = function(index) {return web3.fromWei(this.levelMaxSP[index], 'ether');}
ZSCPosManagement.prototype.getLevelUpProb = function(index) {return this.levelEnhanceProb[index];}
ZSCPosManagement.prototype.getLevelUpPrice= function(index) {return web3.fromWei(this.levelPriceToEnhance[index], 'ether');}

ZSCPosManagement.prototype.getMineTypeNos = function() {return this.mineTypeNos;}
ZSCPosManagement.prototype.getMineTypeDuration = function(index) {return this.mineTypeDuration[index];}
ZSCPosManagement.prototype.getMineTypeRRLevEft = function(index) {return this.mineTypeRRLevEft/100;}
ZSCPosManagement.prototype.getMineTypeActivated = function(index) {return (this.mineTypeActived[index] == 1);}

ZSCPosManagement.prototype.getCtgNos = function() {return this.unitCtgNos;}
ZSCPosManagement.prototype.getCtgType = function(index) {return this.unitCtgTypes[index]}    
ZSCPosManagement.prototype.getCtgName = function(index) {return this.unitCtgNames[index]}    
ZSCPosManagement.prototype.getCtgRare = function(index) {return this.unitCtgRares[index]}    
ZSCPosManagement.prototype.getCtgSPEftMin = function(index) {return this.unitCtgSPEftMin[index]} 
ZSCPosManagement.prototype.getCtgSPEftMax = function(index) {return this.unitCtgSPEftMax[index]} 
ZSCPosManagement.prototype.getCtgRREftMin = function(index) {return this.unitCtgRREftMin[index]} 
ZSCPosManagement.prototype.getCtgRREftMax = function(index) {return this.unitCtgRREftMax[index]} 
ZSCPosManagement.prototype.getCtgUPEftMin = function(index) {return this.unitCtgUPEftMin[index]} 
ZSCPosManagement.prototype.getCtgUPEftMax = function(index) {return this.unitCtgUPEftMax[index]} 

ZSCPosManagement.prototype.getTradeTag = function() {return (this.tradeTag == 1);}
ZSCPosManagement.prototype.getDayInSeconds = function() {return this.dayInSecs;}
ZSCPosManagement.prototype.getCreatePrice = function() {return web3.fromWei(this.createPrice, 'ether');}
ZSCPosManagement.prototype.getMinePerDay = function() {return this.minePerDay/100;}
ZSCPosManagement.prototype.getRewardPerDay = function() {return this.rewardPerDay/100;}
ZSCPosManagement.prototype.getTokenUri = function() {return this.tokenUri;}


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
    this.myPosManager.setCreatePrice(web3.toWei(createPrice, 'ether'), 
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

ZSCPosManagement.prototype.setMineType = function(hashID,  durationInDays, rrLevEft, tag) {
    this.myPosManager.setMineType(durationInDays, rrLevEft, tag,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setPosRatio = function(hashID, mineRatio, rewardRatio) {
    this.myPosManager.setPosRatio(mineRatio * 100, rewardRatio * 100,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setLevelInfo = function(hashID, level, maxStakePoint, priceToEnhance, enhanceProb) {
    this.myPosManager.setLevelInfo(
        level, 
        web3.toWei(maxStakePoint, 'ether'), 
        web3.toWei(priceToEnhance, 'ether'), 
        enhanceProb, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setUnitCategory = function(hashID, ctgName, unitName, rare, spEftMin, spEftMax, rrEftMin, rrEftMax, upProbEftMin, upProbEftMax) {
    this.myPosManager.setUnitCategory(
        ctgName, unitName, rare, 
        spEftMin, spEftMax,
        rrEftMin * 100, rrEftMax * 100,
        upProbEftMin * 100, upProbEftMax * 100,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
}

//////////////
ZSCPosManagement.prototype.loadBaseSettings = function(func) {
    var gm = this;
    var callback = func;

    gm.myPosManager.getBaseSettings(
        {from: gm.account},
        function(error, info){ 
            if(!error) {
                gm.parserBaseSettingsStr(gm, info);  
                callback();
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCPosManagement.prototype.parserBaseSettingsStr = function(gm, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var tradeTag      = newsids[0];
    var dayInSecs     = newsids[1];
    var createPrice   = newsids[2];
    var minePerDay    = newsids[3];
    var rewardPerDay  = newsids[4];
    var tokenUri      = newsids[5];

    gm.tradeTag     = tradeTag.split("=")[1];
    gm.dayInSecs    = dayInSecs.split("=")[1]; 
    gm.createPrice  = createPrice.split("=")[1];
    gm.minePerDay   = minePerDay.split("=")[1];;  
    gm.rewardPerDay = rewardPerDay.split("=")[1];;
    gm.tokenUri     = tokenUri.split("=")[1];;    
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

    gm.levelTags[index]           = index;
    gm.levelMaxSP[index]          = levelMaxSP.split("=")[1];
    gm.levelEnhanceProb[index]    = levelEnhanceProb.split("=")[1];
    gm.levelPriceToEnhance[index] = levelPriceToEnhance.split("=")[1];
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
            gm.loadMineTypes(gm, function(){
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

    var mineTypeActived  = newsids[0];
    var mineTypeDuration = newsids[1];
    var mineTypeRRLevEft = newsids[1];

    gm.mineTypeActived[index]  = mineTypeActived.split("=")[1];
    gm.mineTypeDuration[index] = mineTypeDuration.split("=")[1];
    gm.mineTypeRRLevEft[index] = mineTypeRRLevEft.split("=")[1];
}

////////////////////////////
ZSCPosManagement.prototype.resetAllCtgTags = function(gm) {
    for (var i = 0; i < gm.unitCtgNos; ++i) {
        gm.unitCtgTags[i] = false;
    }
}

ZSCPosManagement.prototype.checkllCtgTags = function(gm) {
    for (var i = 0; i < gm.unitCtgNos; ++i) {
        if (gm.unitCtgTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCPosManagement.prototype.loadUnitCategoryInfos = function(func) {
    var gm = this;
    var callback = func;

    gm.numUnitCtgs(gm, function(gm) {
        gm.resetAllCtgTags(gm);
       if (gm.unitCtgNos == 0) {
            callback();
        } else {
            gm.loadUnitCtgs(gm, function(){
                callback();
            });
        }
    });
}

ZSCPosManagement.prototype.numUnitCtgs = function(gm, func) {
    gm.myPosManager.numUnitCatetories(
        {from: gm.account},
        function(error, num){ 
            if(!error) { 
                gm.unitCtgNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCPosManagement.prototype.loadUnitCtgs = function(gm, func) {
    var callback = func;
    for (var i = 0; i < gm.unitCtgNos; ++i) {
        gm.loadUnitCtgByIndex(gm, i, function(gm, index, info) {
            gm.parserUnitCtgStr(gm, index, info);
            if (gm.checkllCtgTags(gm) == true) {
                func();
            }
        });
    } 
} 

ZSCPosManagement.prototype.loadUnitCtgByIndex = function(gm, index, func) {
    gm.myPosManager.getUnitCategoryByIndex(index, 
        {from: gm.account},
        function(error, para){ 
            if(!error) {
                var ret = para;
                gm.unitCtgTags[index] = true;
                func(gm, index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCPosManagement.prototype.parserUnitCtgStr = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var unitCtgTypes    = newsids[0];
    var unitCtgNames    = newsids[1];
    var unitCtgRares    = newsids[2];
    var unitCtgSPEftMin = newsids[3];
    var unitCtgSPEftMax = newsids[4];
    var unitCtgRREftMin = newsids[5];
    var unitCtgRREftMax = newsids[6];
    var unitCtgUPEftMin = newsids[7];
    var unitCtgUPEftMax = newsids[8];


    gm.unitCtgTypes[index]    = unitCtgTypes.split("=")[1];
    gm.unitCtgNames[index]    = unitCtgNames.split("=")[1];
    gm.unitCtgRares[index]    = unitCtgRares.split("=")[1];
    gm.unitCtgSPEftMin[index] = unitCtgSPEftMin.split("=")[1];
    gm.unitCtgSPEftMax[index] = unitCtgSPEftMax.split("=")[1];
    gm.unitCtgRREftMin[index] = unitCtgRREftMin.split("=")[1] / 100;
    gm.unitCtgRREftMax[index] = unitCtgRREftMax.split("=")[1] / 100;
    gm.unitCtgUPEftMin[index] = unitCtgUPEftMin.split("=")[1] / 100;
    gm.unitCtgUPEftMax[index] = unitCtgUPEftMax.split("=")[1] / 100;
}