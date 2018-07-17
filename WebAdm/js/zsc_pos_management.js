/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCPosManagement(adr, abi) {
    this.robotNos = 0;
    this.robotLevel = [];
    this.account = web3.eth.accounts[0];
    this.myPosManager = web3.eth.contract(abi).at(adr);
    this.gasPrice = cC_getGasPrice(20);
    this.gasLimit = cC_getGasLimit(700);
}

ZSCPosManagement.prototype.downscaledDay = function(hashID, scale) {
    this.myPosManager.downscaledDay(scale, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setGen0RobotMaxNos = function(hashID, nos) {
    this.myPosManager.setGen0RobotNos(nos, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setRewardRatio = function(hashID,  durationInDays, ratio_0_10000) {
    this.myPosManager.setRewardRatio(durationInDays, ratio_0_10000,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 

ZSCPosManagement.prototype.setMaxStakerPoint = function(hashID, level, maxStakePoint, enhanceProb) {
    this.myPosManager.setMaxStakerPoint(level, maxStakePoint, enhanceProb, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashID, result, function(){});
            else console.log("error: " + error);
        });
} 
