/*
Copyright (c) 2018 ZSC Dev Team
*/
import {
    bF
} from './basicFunctions'
//class zscWallet
export default class ZSCWallet {
    constructor(acount, adr, abi) {
        this.userType;
        this.tokenNos = 0;
        this.tokenSymbol = [];
        this.tokenBalance = [];
        this.tokenStatus = [];
        this.tokenLocked = [];
        this.tokenAddress;
        this.itemTags = [];
        this.account = acount;
        this.contractAdr = adr;
        this.contractAbi = JSON.parse(abi);
        this.gasPrice = bF.bF_getGasPrice();
        this.gasLimit = bF.bF_getGasLimit();
    }
    getWalletAddress() {
    }
    getTokenNos() {
    }
}