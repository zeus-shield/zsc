/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCHtml() {
    this.pageHeaderId;
    this.pageBodyId;
}


ZSCHtml.prototype.setHtmlCotentIds = function(hearderId, bodyId) {
    this.pageBodyId = bodyId;
    this.pageHeaderId = hearderId;
}

ZSCHtml.prototype.setHtmlContent = function(elementId, text) {
    document.getElementById(elementId).innerHTML = text;  
}

ZSCHtml.prototype.loadPageHeader = function(funcName) {
    var funcPrefix = funcName + "(";
    var funcSuffix = ")";
    var text = ''
    text += '<div class="well">'
    text += '   <button type="button" onClick="' + funcPrefix + "'apply'" + funcSuffix + '">Apply for user</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'wallet'" + funcSuffix + '">Wallate</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'profile'" + funcSuffix + '">Profile</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'templates'" + funcSuffix + '">Templates</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'agreements'" + funcSuffix + '">Agreements</button>'
    text += '</div>'
    this.setHtmlContent(this.hearderId, text);  
}


ZSCHtml.prototype.loadWaitingApproval = function(funcName) {
    var func;
    var hashLogId;
    var text = '<text>Enable the user in ZSC blockchain system</text>'

    functionInput = funcName + "()";
    text += '<div class="well">'
    text += '    <text value="Applied as' + this.type + '></text>'
    text += '    <button type="button" onClick="' + functionInput + '">Refresh</button>'
    text += '</div>'
    
    this.setHtmlContent(this.pageBodyId, text);  
}


//////////
ZSCHtml.prototype.loadPageBody = function(tag, funcs, extra) {
    var text;
    switch(tag) {
        case "login": 
            text = this.loadLogin(funcs[0]); 
            break;
        case "welecom": 
            text = this.loadWelcome(); 
            break;
        case "apply": 
            text = this.loadButtonForEnablingElement(funcs[0]); 
            break;
        case "wallet": 
            text = this.loadWallet(funcs[0], funcs[1], funcs[2], extra);
            break;
        case "transaction": 
            text = this.loadTransaction(extra);
            break;
        case "profile": 
            text = this.loadParameters(funcs[0], extra);
            break;
    }
    document.getElementById(this.pageBodyId).innerHTML = text; 
} 

ZSCHtml.prototype.loadLogin = function(funcName) {
    var functionInput = funcName + "('AdmAdvAdr', 'userName')";
    var text = ''
    text += '<div class="well">'
    text += '   <text>Login ZSC system</text><br><br>'
    text += '   <text>ZSC platform address </text> <br>'
    text += '   <input class="form-control"  type="text" id="AdmAdvAdr" value="0x1ac03ee2171d22aa7b7d68231018f7169ba2d8ac"></input> <br> <br>'
    text += '   <text>User Name </text> <br>' 
    text += '   <input type="text" id="userName" value="test"></input> <br>' 
    text += '   <button type="button" onClick="' + functionInput + '">Enter</button>'
    text += '</div>'
    this.setHtmlContent(this.pageBodyId, text);  
}

ZSCHtml.prototype.loadWelcome = function() {
    var text = ''
    text += '<div class="well">'
    text += '   <text>Welcome to the ZSC testing platform</text>'
    text += '</div>'
    return text; 
}

ZSCHtml.prototype.loadButtonForEnablingElement = function(funcName) {
    var text = '<text>Enable the user in ZSC blockchain system</text>'

    var functionInput = funcName + "('provider', 'AppleForProviderHash')";
    text += '<div class="well">'
    text += '    <button type="button" onClick="' + functionInput + '">Enable as provider</button>'
    text += '    <text id="AppleForProviderHash"></text><br><br>'

    functionInput = funcName + "('receiver', 'AppleForReceiverHash')";
    text += '    <button type="button" onClick="' + functionInput + '">Enable as receiver</button>'
    text += '    <text id="AppleForReceiverHash"></text><br><br>'

    functionInput = funcName + "('staker', 'AppleForStakerHash')";
    text += '    <button type="button" onClick="' + functionInput + '">Enable as staker</button>'
    text += '    <text id="AppleForStakerHash"></text>'
    text += '</div>'
    
    this.setHtmlContent(this.pageBodyId, text);  
}

ZSCHtml.prototype.loadWallets = function(func1, func2, func3, extra)  {
    var funcPrefix = func1 + "('"; 
    var funcSuffix = "')";
    var walletObj = extra;
    var symbol;
    var adr;
    var balance;
    var hashId;

    var showTransPrefix = func2 + "('";
    var showTransSuffix = "')";

    var enableWalletPrefix = func3 + "('";
    var enableWalletSuffix = "')";

    var text ="";
    text += '<div class="well">';
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>Symbol</text></td> <td><text>Balance</text></td>  <td><text>Address</text></td>  <td><text>Sent To</text></td> <td>Amount</td> <td></td> '
    text += '</tr>'

    for (var i = 0; i < walletObj.getTokenNos(); ++i) {
        symbol = walletObj.getTokenSymbol(i);
        adr = walletObj.getTokenAddress(i);
        balance = walletObj.getTokenBalance(i);
        hashId = symbol + "Hash";
        sentoId = symbol + "Dest";
        amountId = symbol + "Amount";
        text += '<tr>'
        text += '   <td><text>' + symbol + '</text></td>'
        text += '   <td><text>' + balance + '</text></td>'
        text += '   <td><text>' + adr  + '</text></td>'   
        if (walletObj.getTokenStatus() == "false") {
            text += '   <td><button type="button" onClick="' + enableWalletPrefix + symbol + "', '" + hashId + "'" + showTransSuffix + '">Enable</button></td>'
        } else {
            text += '   <td><input id="' + sentoId + '"></input> <td>'   
            text += '   <td><input id="' + amountId + '"></input> <td>'
            text += '   <td><button type="button" onClick="' + funcPrefix + sentoId + "', '" + amountId + "', '" + hashId + "'" + funcSuffix + '">Transfer</button></td>'
            text += '   <td><button type="button" onClick="' + showTransPrefix + symbol, "', '" + hashId + "'" + showTransSuffix + '">Show</button></td>'
        }
        text += '   <td><text id="'+ hashId + '"></text></td>'
        text += '</tr>'
    }
    text += '</div>'

    return text;
}

ZSCHtml.prototype.loadTransaction = function(extra)  {
    var transObj = extra;
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

    for (var i = 0; i < walletObj.getTransactionNos(); ++i) {
        timeMoment = transObj.getTimeMoment(i);
        inputTag   = inputTag.getInputTag(i);
        amount     = amount.getAmount(i);
        sender     = sender.getSender(i);
        receiver   = receiver.getReceiver(i);

        text += '<tr>'
        text += '   <td><text>' + timeMoment + '</text></td>'
        text += '   <td><text>' + inputTag + '</text></td>'
        text += '   <td><text>' + amount  + '</text></td>'
        text += '   <td><text>' + sender  + '</text></td>'
        text += '   <td><text>' + receiver  + '</text></td>'
        text += '</tr>'
    }
    text += '</div>'
    return text;
}

function loadParameters(funcName, extra) {
    var functionInput = funcName + "('SubmitChangesHash')";
    var elementObj = extra;
    var parameterNos = elementObj.getParameterNos();
   
    var text ="";
    text += '<div class="well">';
   
    for (var i = 0; i < parameterNos; ++i) {
        text += '   <text>' + elementObj.getParameterName(i) + ': </text>'
        text += '   <input type="text" id="' + elementObj.getParameterValue(i) + '"></input>'
    }
    text += '</div>'
    text += '   <button type="button" onClick="' + functionInput + '">Submit Changes</button>'
    text += '   <text id="SubmitChangesHash"></text>'
    text += '</div>'
    return text;
}


