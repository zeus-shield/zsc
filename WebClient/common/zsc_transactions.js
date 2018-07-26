/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTransactions(nm, abi, adr) {
    this.userName = nm;
    this.transNos;
    this.tokenSymbol;
    this.timeMoments = [];
    this.inputTags = [];
    this.txHash = [];
    this.amounts = [];
    this.senders = [];
    this.receivers = [];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
    this.account = web3.eth.accounts[0];
    this.gasPrice = bF_getGasPrice();
    this.gasLimit = bF_getGasLimit();
}

ZSCTransactions.prototype.getUserName = function() {return this.userName;}

ZSCTransactions.prototype.setTokenSymbol = function(symbol) {this.tokenSymbol = symbol;}

ZSCTransactions.prototype.getTokenSymbol = function() { return this.tokenSymbol;}

ZSCTransactions.prototype.loadTransactions = function(func) {
    var gm = this;
    var callBack = func;

    gm.numTransactions(gm, function(gm) {
        if (gm.transNos == 0) {
            callBack();
        } else {
            for (var i = 0; i < gm.transNos; ++i) {
                gm.loadTransactionInfoByIndex(gm, i, function(index){
                    if (index == gm.transNos - 1) {
                        callBack();
                    }
                });
            }
        }
    });
}

ZSCTransactions.prototype.numTransactions = function(gm, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.numUserTransactions(gm.userName, gm.tokenSymbol, 
        {from: gm.account},
        function(error, result){ 
            if(!error) {
                gm.transNos = result.toString(10);
                callBack(gm);
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTransactions.prototype.loadTransactionInfoByIndex = function(gm, index, func) {
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);

    myControlApi.getUserTransactionByIndex(gm.userName, gm.tokenSymbol, index,
        {from: gm.account, gas: gm.gas},
        function(error, result){ 
            if(!error) {
                gm.parserTransactionInfoByIndex(gm, result, index)
                callBack(index);
            } else {
                console.log("error: " + error);
            }
        });
}

/*
"info?time=",
"input=",    
"tx=",       
"amout=",    
"sender=",   
"receiver=", 
*/
ZSCTransactions.prototype.parserTransactionInfoByIndex = function(gm, urlinfo, index) {
    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len = urlinfo.length;
    var offset = urlinfo.indexOf("?");
    var newsidinfo = urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var timeInfo     = newsids[0];
    var inputInfo    = newsids[1];
    var txInfo       = newsids[2];
    var amountInfo   = newsids[3];
    var senderInfo   = newsids[4];
    var receiverInfo = newsids[5];

    gm.timeMoments[index] = timeInfo.split("=")[1];
    gm.inputTags[index]   = inputInfo.split("=")[1];
    gm.txHash[index]      = txInfo.split("=")[1];
    gm.amounts[index]     = amountInfo.split("=")[1];
    gm.senders[index]     = senderInfo.split("=")[1];
    gm.receivers[index]   = receiverInfo.split("=")[1];
    return true;
}

ZSCTransactions.prototype.loadTransactionsHtml = function(elementId)  {
    var timeMoment;
    var inputTag;
    var amount;
    var sender;
    var receiver;

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Time</text></td> <td><text>Does Input</text></td>  <td><text>Amount</text></td>  <td><text>Sender/Receiver</text></td>'
    text += '</tr>'
    text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td>  </tr>'

    for (var i = 0; i < this.transNos; ++i) {
        timeMoment = this.timeMoments[i];
        inputTag   = this.inputTags[i];
        amount     = web3.fromWei(this.amounts[i], 'ether');
        sender     = this.senders[i];
        receiver   = this.receivers[i];

        text += '<tr>'
        text += '   <td><text>' + timeMoment + '</text></td>'
        text += '   <td><text>' + inputTag + '</text></td>'
        text += '   <td><text>' + amount  + '</text></td>'
        text += '   <td><text>Sender:   0x' + sender  + '</text><br>'
        text += '       <text>Receiver: 0x' + receiver  + '</text></td>'
        text += '</tr>' 
        text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td>  </tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

