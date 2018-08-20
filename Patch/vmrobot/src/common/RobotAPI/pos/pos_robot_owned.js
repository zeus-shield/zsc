/*
Copyright (c) 2018 ZSC Dev Team
*/
import {
    bF
} from '../common/basicFunctions';
//class 
export default class ZSCRobotOwned {
    constructor(acount, adr, abi) {
    }
    getRobotNos() {
        return this.robotNos;
    }
    getRobotId(index) {
        return this.robotIds[index];
    }
}