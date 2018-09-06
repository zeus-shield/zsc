/*
Copyright (c) 2018 ZSC Dev Team
*/
import {
    bF
} from '../common/basicFunctions';
//class 
export default class ZSCRobotOwned {
    constructor(acount, adr, abi) {
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
        this.robotRewardRatio = [];
        this.robotRewards = [];
        this.account = acount;
        this.contractAdr = adr;
        this.contractAbi = JSON.parse(abi);
        this.gasPrice = bF.bF_getGasPrice();
        this.gasLimit = bF.bF_getGasLimit();
        this.fromSystemWalletTag = true;
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
    getMaxSP(index) {
        return bF.bF_fixedNumberFromWei(this.robotMaxSP[index], 4);
    }
    getCurSP(index) {
        return bF.bF_fixedNumberFromWei(this.robotCurSP[index], 4);
    }
    getEnhanceProb(index) {
        return this.robotEnhanceProb[index];
    }
    getMineStart(index) {
        return this.secondsToDate(this.robotMineStart[index]);
    }
    getMineEnd(index) {
        return this.secondsToDate(this.robotMineEnd[index]);
    }
    getPriceToEnhance(index) {
        return bF.bF_fixedNumberFromWei(this.robotPrceToEnhance[index], 4);
    }
    getPriceToCreate(index) {
        return bF.bF_fixedNumberFromWei(this.robotPrceToCreate[index], 4);
    }
    getPriceForSale(index) {
        return bF.bF_fixedNumberFromWei(this.robotPrceForSale[index], 4);
    }
    getRewardRatio(index) {
        return this.robotRewardRatio[index];
    }
    loadRobotInfoByIndex(gm, index, func) {
    }
    parserRobotInfo(gm, index, info) {
    }
}