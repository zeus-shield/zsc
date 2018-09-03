/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUser(admAdr) {
    this.admAdr = admAdr;
    this.userName;
    this.userNameHr;
    this.userStatus;
    this.userType;
    this.controlApisAdr;
    this.controlApisFullAbi;
    this.account = web3.eth.accounts[0];
    this.myAdmAdv = web3.eth.contract(this.getLoginAbi()).at(this.admAdr);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}
ZSCUser.prototype.getUserName = function () { return this.userName; }
ZSCUser.prototype.getUserNameHr = function () { return this.userNameHr; }
ZSCUser.prototype.getUserStatus = function () { return this.userStatus; }
ZSCUser.prototype.getUserType = function () { return this.userType; }
ZSCUser.prototype.getControlApisAdr = function () { return this.controlApisAdr; }
ZSCUser.prototype.getControlApisFullAbi = function () { return this.controlApisFullAbi; }
ZSCUser.prototype.getLoginAbi = function () {
    return [{ "constant": true, "inputs": [], "name": "getControlApisFullAbi", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getControlApisAdr", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_user", "type": "bytes32" }, { "name": "_pass", "type": "bytes32" }], "name": "tryLogin", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_hexx", "type": "bytes32" }, { "name": "_type", "type": "bytes32" }], "name": "activeByUser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_hexx", "type": "bytes32" }], "name": "getUserType", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_user", "type": "bytes32" }, { "name": "_hexx", "type": "bytes32" }], "name": "keepOnline", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_hexx", "type": "bytes32" }], "name": "getUserStatus", "outputs": [{ "name": "", "type": "bytes32" }], "payable": false, "stateMutability": "view", "type": "function" },{
        "constant": true,
        "inputs": [],
        "name": "numUsers",
        "outputs": [{
            "name": "",
            "type": "uint256"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }, {
        "constant": true,
        "inputs": [{ "name": "_index", "type": "uint256" }],
        "name": "getUserInfoByIndex",
        "outputs": [{
            "name": "",
            "type": "string"
        }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"

    } 
    ];
}
