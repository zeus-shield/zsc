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
    getUserName() {
        return this.userName;
    }
    getUserNameHr() {
        return this.userNameHr;
    }
    getUserStatus() {
        return this.userStatus;
    }
    getUserType() {
        return this.userType;
    }
    getControlApisAdr() {
        return this.controlApisAdr;
    }
    getControlApisFullAbi() {
        return this.controlApisFullAbi;
    }
    getLoginAbi() {
        return [{
            "constant": true,
            "inputs": [],
            "name": "getUserType",
            "outputs": [{
                "name": "",
                "type": "bytes32"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getControlApisFullAbi",
            "outputs": [{
                "name": "",
                "type": "string"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getControlApisAdr",
            "outputs": [{
                "name": "",
                "type": "address"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [{
                "name": "_type",
                "type": "bytes32"
            }],
            "name": "tryLogin",
            "outputs": [{
                "name": "",
                "type": "bool"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }, {
            "constant": false,
            "inputs": [{
                "name": "_type",
                "type": "string"
            }],
            "name": "activeByUser",
            "outputs": [],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        }, {
            "constant": true,
            "inputs": [],
            "name": "getUserStatus",
            "outputs": [{
                "name": "",
                "type": "bytes32"
            }],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }];
    }
    tryLogin(userType, func) {
    }
    getAdr(gm, func) {
    }
    getFullAbi(gm, adr, func) {
    }
    getUserStatusFromAdm(func) {
    }
    getUserTypeFromAdm(func) {
        var gm = this;
        var callBack = func;
        var myAdmAdv = web3.eth.contract(gm.getLoginAbi()).at(gm.admAdr);
        myAdmAdv.getUserType(function (error, ret) {
            if (!error) {
                gm.userType = web3.toUtf8(ret);
                callBack(gm.userType);
            } else {
                console.log("error: " + error);
            }
        });
    }
}