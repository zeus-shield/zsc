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
    }
    getRobotId(index) {
    }
}