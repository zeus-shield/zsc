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
}