/*
Copyright (c) 2018 ZSC Dev Team
*/
import {
    bF
} from './basicFunctions'
export default class ZSCLogin {
    constructor(userAccount) {
        this.admAdr = "0x162b40e67f72a8ffc13b24b4f15ac7b98d92e454";
        this.userStatus;
        this.userType;
        this.controlApisAdr;
        this.controlApisFullAbi;
        this.account = userAccount;
        this.myAdmAdv = web3.eth.contract(this.getLoginAbi()).at(this.admAdr);
        this.gasPrice = bF.bF_getGasPrice();
        this.gasLimit = bF.bF_getGasLimit();
    }
}