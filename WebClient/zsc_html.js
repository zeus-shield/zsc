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
ZSCHtml.prototype.loadPageBody = function(tag, funcName, extra) {
    var text;
    switch(tag) {
        case "login": 
            text = this.loadLogin(funcName); 
            break;
        case "welecom": 
            text = this.loadWelcome(); 
            break;
        case "apply": 
            text = this.loadButtonForEnablingElement(funcName); 
            break;
        case "wallet-eth": 
            text = this.loadWalletEth(funcName);
            break;
        case "wallet-erc20": 
            text = this.loadWallet(tag, funcName);
            break;
        case "profile": 
            text = this.loadParameters(funcName, extra);
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

ZSCHtml.prototype.loadWalletEth = function(funcName)  {
    var functionInput = funcName + "('wallet-eth', DestAddress', 'EthAmount', 'TransferEthHash')";
    var text ="";
    text += '<div class="well">';
    text += '   <text>' + "TestETH: " + web3.fromWei(balance) + ': </text><br>'
    text += '   <text>' + "Address: " + address + ': </text><br><br>'
    text += '   <text>Destination Address</text>  <input id="DestAddress"></input> <br>'
    text += '   <text>Eth Amount</text> <input id="EthAmount"></input> <br><br>'   
    text += '   <button type="button" onClick="' + functionInput + '">Transfer ETH</button>'
    text += '   <text id="TransferEthHash"></text>'
    text += '</div>'
    return text;
}

ZSCHtml.prototype.loadWalletErc20 = function(funcName)  {
    var functionInput = funcName + "('wallet-erc20', 'DestAddress', 'EthAmount', 'TransferEthHash')";
    var text ="";
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


