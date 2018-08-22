/*
Copyright (c) 2018 ZSC Dev Team
*/

export const bF = {
    bF_getEthAccount() {
        //console.log(web3.eth.accounts[0])
        var account = web3.eth.accounts[0];
        //if (account == undefined) alert("Need to login in MetaMask!!");
        return account;
    },

    bF_getGasPrice() {
        return 20 * 1000000000; //30 * gwei
    },

    bF_getGasLimit() {
    },
    bF_fixedNumberFromWei(value, n) {
    }
}