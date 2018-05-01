/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCBlock(nm, abi, adr) {
    this.userName = nm;
    this.totalBlockNos;
    this.minedBlockNos;
    this.poolIndex;
    this.blockSizes = [];
    this.blockTxNos = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCBlock.prototype = new ZSCClient();

ZSCBlock.prototype.getUserName = function() {return this.userName;}

ZSCBlock.prototype.getTotalBlockNos = function() {return this.totalBlockNos;}

ZSCBlock.prototype.getMinedBlockNos = function() {return this.minedBlockNos;}

ZSCBlock.prototype.loadBlocks = function(poolIndex, func) {
    this.poolIndex = poolIndex;
    this.numBlocks(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getBlockInfoByIndex(i, function(index){
                if (indx == this.agrNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCBlock.prototype.numBlocks = function(func) {
    this.myControlApi.numBlockInfo(this.userName, this.poolIndex, 
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                parserBlockNosInfo(result);
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCBlock.prototype.getBlockInfoByIndex = function(blockIndex, func) {
    this.myControlApi.getBlockInfoByIndex(this.userName, this.poolIndex, blockIndex,
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                parserBlockInfo(result, blockIndex);
                func(blockIndex);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCBlock.prototype.parserBlockNosInfo = function(info) {

}

ZSCBlock.prototype.parserBlockInfo = function(info, index) {

}
