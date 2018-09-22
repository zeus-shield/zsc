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
    this.unitCtgProbWeights = [];

    this.unitCtgSPBirthMin = [];
    this.unitCtgSPBirthMax = [];
    this.unitCtgRRBirthMin = [];
    this.unitCtgRRBirthMax = [];
    this.unitCtgUPBirthMin = [];
    this.unitCtgUPBirthMax = [];
    this.unitCtgTags = [];

    this.account = web3.eth.accounts[0];
    this.myPosManager = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();

    this.multipleValue = 10000;
}

ZSCPosManagement.prototype.getLevelNos = function() {return this.levelNos;}
ZSCPosManagement.prototype.getLevelMaxSP = function(index) {return web3.fromWei(this.levelMaxSP[index], 'ether');}
ZSCPosManagement.prototype.getLevelUpProb = function(index) {return this.levelEnhanceProb[index]/this.multipleValue;}
ZSCPosManagement.prototype.getLevelUpPrice= function(index) {return web3.fromWei(this.levelPriceToEnhance[index], 'ether');}

ZSCPosManagement.prototype.getMineTypeNos = function() {return this.mineTypeNos;}
ZSCPosManagement.prototype.getMineTypeDuration = function(index) {return this.mineTypeDuration[index];}
ZSCPosManagement.prototype.getMineTypeRRLevEft = function(index) {return this.mineTypeRRLevEft/this.multipleValue;}
ZSCPosManagement.prototype.getMineTypeActivated = function(index) {return (this.mineTypeActived[index] == 1);}

ZSCPosManagement.prototype.getCtgNos = function() {return this.unitCtgNos;}
ZSCPosManagement.prototype.getCtgType = function(index) {return this.unitCtgTypes[index]}    
ZSCPosManagement.prototype.getCtgName = function(index) {return this.unitCtgNames[index]}    
ZSCPosManagement.prototype.getCtgRare = function(index) {return this.unitCtgRares[index]}   
ZSCPosManagement.prototype.getCtgProbWeight = function(index) {return this.unitCtgProbWeights[index]}   

ZSCPosManagement.prototype.getCtgSPBirthMin = function(index) {return web3.fromWei(this.unitCtgSPBirthMin[index], 'ether');} 
ZSCPosManagement.prototype.getCtgSPBirthMax = function(index) {return web3.fromWei(this.unitCtgSPBirthMax[index], 'ether');} 
ZSCPosManagement.prototype.getCtgRRBirthMin = function(index) {return this.unitCtgRRBirthMin[index]} 
ZSCPosManagement.prototype.getCtgRRBirthMax = function(index) {return this.unitCtgRRBirthMax[index]} 
ZSCPosManagement.prototype.getCtgUPBirthMin = function(index) {return this.unitCtgUPBirthMin[index]} 
ZSCPosManagement.prototype.getCtgUPBirthMax = function(index) {return this.unitCtgUPBirthMax[index]} 

ZSCPosManagement.prototype.getTradeTag = function() {return (this.tradeTag == 1);}
ZSCPosManagement.prototype.getDayInSeconds = function() {return this.dayInSecs;}
ZSCPosManagement.prototype.getCreatePrice = function() {return web3.fromWei(this.createPrice, 'ether');}
ZSCPosManagement.prototype.getMinePerDay = function() {return this.minePerDay/this.multipleValue;}
ZSCPosManagement.prototype.getRewardPerDay = function() {return this.rewardPerDay/this.multipleValue;}
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
    this.myPosManager.setMineType(durationInDays, rrLevEft * this.multipleValue, tag,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setPosRatio = function(hashID, mineRatio, rewardRatio) {
    this.myPosManager.setPosRatio(mineRatio * this.multipleValue, rewardRatio * this.multipleValue,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setLevelInfo = function(hashID, level, maxStakePoint, priceToEnhance, upgradeProb) {
    this.myPosManager.setLevelInfo(
        level, 
        web3.toWei(maxStakePoint, 'ether'), 
        web3.toWei(priceToEnhance, 'ether'), 
        upgradeProb * this.multipleValue, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setRareThreshold = function(hashID, RThresh, SRThresh, SSRThresh) {
    this.myPosManager.setRareThreshold(
        RThresh * this.multipleValue, SRThresh * this.multipleValue, SSRThresh * this.multipleValue,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){window.location.reload(true);});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setUnitCategory = function(hashID, ctgName, unitName, rareValue, probWeight, spBirthMin, spBirthMax, rrBirthMin, rrBirthMax, upProbBirthMin, upProbBirthMax) {
    this.myPosManager.setUnitCategory(
        ctgName, unitName, rareValue, probWeight,
        web3.toWei(spBirthMin, 'ether'), 
        web3.toWei(spBirthMax, 'ether'),
        rrBirthMin * this.multipleValue, 
        rrBirthMax * this.multipleValue,
        upProbBirthMin * this.multipleValue, 
        upProbBirthMax * this.multipleValue,
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
    var mineTypeRRLevEft = newsids[2];

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

    var unitCtgTypes       = newsids[0];
    var unitCtgNames       = newsids[1];
    var unitCtgRares       = newsids[2];
    var unitCtgProbWeights = newsids[3];
    var unitCtgSPBirthMin    = newsids[4];
    var unitCtgSPBirthMax    = newsids[5];
    var unitCtgRRBirthMin    = newsids[6];
    var unitCtgRRBirthMax    = newsids[7];
    var unitCtgUPBirthMin    = newsids[8];
    var unitCtgUPBirthMax    = newsids[9];


    gm.unitCtgTypes[index]        = unitCtgTypes.split("=")[1];
    gm.unitCtgNames[index]        = unitCtgNames.split("=")[1];
    gm.unitCtgRares[index]        = unitCtgRares.split("=")[1];
    gm.unitCtgProbWeights[index]  = unitCtgProbWeights.split("=")[1];
    gm.unitCtgSPBirthMin[index]     = unitCtgSPBirthMin.split("=")[1];
    gm.unitCtgSPBirthMax[index]     = unitCtgSPBirthMax.split("=")[1];
    gm.unitCtgRRBirthMin[index]     = unitCtgRRBirthMin.split("=")[1] / gm.multipleValue;
    gm.unitCtgRRBirthMax[index]     = unitCtgRRBirthMax.split("=")[1] / gm.multipleValue;
    gm.unitCtgUPBirthMin[index]     = unitCtgUPBirthMin.split("=")[1] / gm.multipleValue;
    gm.unitCtgUPBirthMax[index]     = unitCtgUPBirthMax.split("=")[1] / gm.multipleValue;
}