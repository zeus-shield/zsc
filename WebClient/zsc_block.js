/*
Copyright (c) 2018 ZSC Dev Team
*/

function ZSCBlock(nm, abi, adr) {
    this.userName = nm;
    this.totalBlockNos;
    this.minedBlockNos;
    this.blockSizes = [];
    this.blockTxNos = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCBlock.prototype = new ZSCClient();

ZSCBlock.prototype.getUserName = function() {return this.userName;}

ZSCBlock.prototype.getTotalBlockNos = function() {return this.totalBlockNos;}

ZSCBlock.prototype.getMinedBlockNos = function() {return this.minedBlockNos;}

ZSCBlock.prototype.loadBlocks = function(func) {
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

ZSCBlock.prototype.numBlocks= function(func) {

}

ZSCBlock.prototype.getBlockInfoByIndex = function(index, func) {

}
