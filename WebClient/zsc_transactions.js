/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCTransactions(nm, abi, adr) {
    this.userName = nm;
    this.nos;
    this.tokenSymbol;
    this.timeMoments = [];
    this.inputTags = [];
    this.txHash = [];
    this.amounts = [];
    this.senders = [];
    this.receivers = [];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCPos.prototype = new ZSCClient();

ZSCTransactions.prototype.getUserName = function() {return this.userName;}

ZSCTransactions.prototype.setTokenSymbol = function(symbol) {return this.tokenSymbol = symbol;}

ZSCTransactions.prototype.getTokenSymbol = function() { return this.tokenSymbol;}

ZSCTransactions.prototype.loadTransactions = function(func) {
    this.numTransactions(function() {
        for (var i = 0; i < this.walletNos; ++i) {
            this.loadTransactionInfoByIndex(i, function(index){
                if (indx == this.walletNos - 1) {
                    func();
                }
            });
        }
    });
}

ZSCTransactions.prototype.numTransactions = function(func) {
    this.myControlApi.numUserTransactions(this.userName, this.tokenSymbol, 
        {from: this.getAccount(), gas: this.getGasLimit(20)},
        function(error, result){ 
            if(!error) {
                this.walletNos = result.toString(10);
                func();
            } else {
                console.log("error: " + error);
            }
        });
}

ZSCTransactions.prototype.loadTransactionInfoByIndex = function(index, func) {
    this.myControlApi.getUserTransactionByIndex(this.userName, this.tokenSymbol, index,
        {from: this.getAccount(), gas: this.getGasLimit(20)},
        function(error, result){ 
            if(!error) {
                parserTransactionInfoByIndex(result, index)
                func(index);
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
ZSCTransactions.prototype.parserTransactionInfoByIndex = function(urlinfo, index) {
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

    this.timeMoments[index] = timeInfo.split("=")[1];
    this.inputTags[index]   = inputInfo.split("=")[1];
    this.txHash[index]      = txInfo.split("=")[1];
    this.amounts[index]     = amountInfo.split("=")[1];
    this.senders[index]     = senderInfo.split("=")[1];
    this.receivers[index]   = receiverInfo.split("=")[1];
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
    text += '   <td><text>Time</text></td> <td><text>Does Input</text></td>  <td><text>Amount</text></td>  <td><text>Sender</text></td> <td>Receiver</td>'
    text += '</tr>'

    for (var i = 0; i <     this.nos; ++i) {
        timeMoment = this.timeMoments[i];
        inputTag   = this.inputTags[i];
        amount     = this.amounts[i];
        sender     = this.enders[i];
        receiver   = this.receivers[i];

        text += '<tr>'
        text += '   <td><text>' + timeMoment + '</text></td>'
        text += '   <td><text>' + inputTag + '</text></td>'
        text += '   <td><text>' + amount  + '</text></td>'
        text += '   <td><text>' + sender  + '</text></td>'
        text += '   <td><text>' + receiver  + '</text></td>'
        text += '</tr>'
    }
    text += '</table></div>'

    document.getElementById(elementId).innerHTML = text;  
}

