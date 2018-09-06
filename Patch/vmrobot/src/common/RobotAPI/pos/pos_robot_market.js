/*
Copyright (c) 2018 ZSC Dev Team
*/
import {
    bF
} from '../common/basicFunctions'
//class 
export default class ZSCRobotMarket {
    constructor(account, adr, abi) {
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
        this.gasPrice = bF.bF_getGasPrice();
        this.gasLimit = bF.bF_getGasLimit();
    }
    getRobotNos() {
        return this.robotNos;
    }
    getRobotId(index) {
        return this.robotIds[index];
    }
    getRobotLev(index) {
        return this.robotLevs[index];
    }
    getRobotSeller(index) {
        return this.robotSeller[index];
    }
    getMaxSP(index) {
        return bF.bF_fixedNumberFromWei(this.robotMaxSP[index], 4);
    }
    getPriceForSale(index) {
        return bF.bF_fixedNumberFromWei(this.robotPrceForSale[index], 4);
    }
    resetAllItemTags(gm) {
        for (var i = 0; i < gm.robotNos; ++i) {
            gm.itemTags[i] = false;
        }
    }
    checkAllItemTags(gm) {
        for (var i = 0; i < gm.robotNos; ++i) {
            if (gm.itemTags[i] == false) {
                return false;
            }
        }
        return true;
    }
    purchaseSellingRobot(hashId, robotId, func) {
    }
    loadRobotsInMarket(func) {
    }
    numRobotsInMarket(gm, func) {
    }
    loadSellingRobots(gm, func) {
    }
    loadSellingRobotInfoByIndex(gm, index, func) {
    }
    parserSellingRobotInfo(gm, index, info) {
        var len = info.length;
        var offset = info.indexOf("?");
        var newsidinfo = info.substr(offset, len);
        var newsids = newsidinfo.split("&");
        var robotId = newsids[0];
        var lev = newsids[1];
        var maxSP = newsids[2];
        var price = newsids[3];
        var seller = newsids[4];
    }
}