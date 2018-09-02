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
        return this.tokenAddress;
    }
    getTokenNos() {
        return this.tokenNos;
    }
    getTokenSymbol(index) {
        return this.tokenSymbol[index];
    }
    getTokenBalance(index) {
        return web3.fromWei(this.tokenBalance[index], 'ether');
    }
    getTokenLocked(index) {
        return web3.fromWei(this.tokenLocked[index], 'ether');
    }
    resetAllItemTags(gm) {
        for (var i = 0; i < gm.tokenNos; ++i) {
            gm.itemTags[i] = false;
        }
    }
    checkAllItemTags(gm) {
        for (var i = 0; i < gm.tokenNos; ++i) {
            if (gm.itemTags[i] == false) {
                return false;
            }
        }
        return true;
    }
    submitTransferValue(tokenSymbol, destAddress, amount, hashId, func) {
    }
    enableUserWallet(hashId, func) {
    }
    /*
    "info?status=", "symbol=", "adr=", "balance=",
    */
    parserTokenBalanceInfoByIndex(gm, urlinfo, index) {
    }
}