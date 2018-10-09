/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotAllBreifes(acount, adr, abi) {
    this.userType;
    this.robotOwnerTag; // "user"; "selling"; "holder"
    this.robotNos = 0;
    this.itemTags = [];

    this.robotBriefParaNames ;
    this.robotBriefParaValues = [];

    this.otherHolderAdr = 0x0;

    this.account = acount;
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCRobotAllBreifes.prototype.getRobotNos = function() { return this.robotNos;}

ZSCRobotAllBreifes.prototype.getRobotBriefParaValue = function(para, index, tag) { 
    return bF_robotParaValue(this.robotBriefParaValues[index].get(para), tag);
}

ZSCRobotAllBreifes.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.robotNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCRobotAllBreifes.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.robotNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCRobotAllBreifes.prototype.setRobotBriefParaNames = function(gm, tag, adr) {
    gm.robotOwnerTag = tag;
    gm.otherHolderAdr = adr;

    //default paras: "id",  "rare", "spLev"
    //extra paras
    if (tag == "user") {
        gm.robotBriefParaNames = ["status", "name"];
    } else if (tag == "selling") {
        gm.robotBriefParaNames = ["sellPrice", "name"];
    } else if (tag == "holder") {
        gm.robotBriefParaNames = ["status", "name"];
    } else if (tag == "all") {
        gm.robotBriefParaNames = ["status", "name"];
    } else {
        gm.robotBriefParaNames = ["status", "name"];
    }
}


ZSCRobotAllBreifes.prototype.createGen0Robot = function(hashId, func) { 
    var gm = this;
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    erc721Api.createUnit(true /*if it is random */, 0x0, 0x0,
        {from: gm.account, gasPrice: gm.gasPrice, gas: gm.gasLimit},
        function(error, result){ 
            if(!error) bF_showHashResult(hashId, result, callBack);
            else console.log("error: " + error);
        });
}

////////////////////////
ZSCRobotAllBreifes.prototype.loadAllRobotBriefs = function(tag, otherHolderAdr, func) {
    var gm = this;
    var callback = func;

    gm.setRobotBriefParaNames(gm, tag, otherHolderAdr);
    gm.numRobots(gm, function(gm) {
        if (gm.robotNos == 0) {
            callback();
        } else {
            gm.resetAllItemTags(gm);
            for (var i = 0; i < gm.robotNos; ++i) {
                gm.loadRobotBrieInfoByIndex(gm, i, function(gm, index, robotInfo) {
                    gm.parserRobotBrieInfo(gm, index, robotInfo);
                    if (gm.checkAllItemTags(gm) == true) {
                        callback();
                    }
                });
            } 
        }
    });
}

ZSCRobotAllBreifes.prototype.numRobots = function(gm, func) {
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    if (gm.robotOwnerTag == "all") {
        erc721Api.totalSupply({from: gm.account},
            function(error, num){ 
                if(!error) { 
                    gm.robotNos = num.toString(10); 
                    func(gm);
                } else {
                    console.log("error: " + error);
                }
            });
    } else {
        erc721Api.numUnits(gm.robotOwnerTag, gm.otherHolderAdr, 
            {from: gm.account},
            function(error, num){ 
                if(!error) { 
                    gm.robotNos = num.toString(10); 
                    func(gm);
                } else {
                    console.log("error: " + error);
                }
            });
    }
}

ZSCRobotAllBreifes.prototype.loadRobotBrieInfoById = function(gm, index, func) {
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.getUnitInfoById(Number(index), gm.robotBriefParaNames, 
        {from: gm.account},
        function(error, robotInfo){ 
            if(!error) {
                gm.itemTags[index] = true;
                func(gm, index, robotInfo);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCRobotAllBreifes.prototype.loadRobotBrieInfoByIndex = function(gm, index, func) {
    var callBack = func;
    var erc721Api = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    erc721Api.getUnitInfoByIndex(gm.robotOwnerTag, gm.otherHolderAdr, Number(index), gm.robotBriefParaNames, 
        {from: gm.account},
        function(error, robotInfo){ 
            if(!error) {
                gm.itemTags[index] = true;
                func(gm, index, robotInfo);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCRobotAllBreifes.prototype.parserRobotBrieInfo = function(gm, index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset + 1, len)
    var newsids    = newsidinfo.split("&");
    var paraNos    = newsids.length;

    gm.robotBriefParaValues[index] = new Map()

    for (var i = 0; i < paraNos; ++i) {
        var pair = newsids[i]
        gm.robotBriefParaValues[index].set(pair.split("=")[0], pair.split("=")[1]);
    }
}



  