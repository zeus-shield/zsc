/*
Copyright (c) 2018 ZSC Dev Team
*/

//class 
function ZSCRobotInit(nm, abi, adr) {
    this.userName = nm;
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit(700);
}

ZSCRobotInit.prototype.getUserName = function() {return this.userName;}

ZSCRobotInit.prototype.getRobotId = function(index) { return this.robotIds[index];}

ZSCRobotInit.prototype.numAllInitialRobots = function(func) {
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    
    myControlApi.numInitialRobots({from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.robotNos = result.toString(10); 
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}