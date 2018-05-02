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
    this.minedStatus = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCBlock.prototype = new ZSCClient();

ZSCBlock.prototype.getUserName = function() {return this.userName;}

ZSCBlock.prototype.getTotalBlockNos = function() {return this.totalBlockNos;}

ZSCBlock.prototype.getMinedBlockNos = function() {return this.minedBlockNos;}

ZSCBlock.prototype.loadAllBlocks = function(poolIndex, func) {
    this.poolIndex = poolIndex;
    this.numAllBlocks(function() {
        for (var i = 0; i < this.agrNos; ++i) {
            this.getBlockInfoByIndex(i, function(index){
                if (indx == this.agrNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCBlock.prototype.numAllBlocks = function(func) {
    this.myControlApi.numBlockInfo(this.userName, this.poolIndex, false, 
        {from: this.getAccount()},
        function(error, result){ 
            if(!error) {
                if (isMined) {
                    this.minedBlockNos = result;
                } else {
                    this.totalBlockNos = result;
                }
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

ZSCBlock.prototype.parserBlockInfo = function(info, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var blockSizeInfo  = newsids[0];
    var blockTxNosInfo = newsids[1];
    var minedStatusInfo = newsids[2];

    this.blockSizes[index] = blockSizeInfo.split("=")[1];
    this.blockTxNos[index] = blockTxNosInfo.split("=")[1];
    this.minedStatus[index] = minedStatusInfo.split("=")[1];

    return true;
}

ZSCBlock.prototype.loadBlockInfoHtml = function(isReward, elementId)  {
    var timeMoment;
    var inputTag;
    var amount;
    var sender;
    var receiver;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>SP used time</td> <td>SP used amount</td>'
    for (var i = 0; i < this.tmpNos; ++i) {
        text += '<tr>'
        text += '   <td>' + this.spUsedTimes[i] + '</td>'
        text += '   <td>' + this.spUsedAmounts[i]  + '</td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

