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
    loadTokenWallets(func) {
    }
    getUserWalletAddress(gm, func) {
    }
    enableUserWallet(hashId, func) {
    }
    /*
    "info?status=", "symbol=", "adr=", "balance=",
    */
    parserTokenBalanceInfoByIndex(gm, urlinfo, index) {
        var found1 = urlinfo.indexOf("?");
        var found2 = urlinfo.indexOf("=");
        if (found1 == -1 || found2 == -1)
            return false;
        var len = urlinfo.length;
        var offset = urlinfo.indexOf("?");
        var newsidinfo = urlinfo.substr(offset, len);
        var newsids = newsidinfo.split("&");
        var statusInfo = newsids[0];
        var symbolInfo = newsids[1];
        var balanceInfo = newsids[2];
        var lockedInfo = newsids[3];
        gm.tokenStatus[index] = statusInfo.split("=")[1];
        gm.tokenSymbol[index] = symbolInfo.split("=")[1];
        gm.tokenBalance[index] = balanceInfo.split("=")[1];
        gm.tokenLocked[index] = lockedInfo.split("=")[1];
        return true;
    }
}