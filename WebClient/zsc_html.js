/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscElement
function ZSCHtml() {
}

ZSCHtml.prototype.setHtmlContent(elementId, text) {
    document.getElementById(elementId).innerHTML = text;  
}

ZSCHtml.prototype.loadLogin = function(funcName, elementId) {
    var funcLoad = funcName + "('AdmAdvAdr', 'userName')";
    var text = ''
    text += '<div class="well">'
    text += '   <text>Login ZSC system</text><br><br>'
    text += '   <text>ZSC platform address </text> <br>'
    text += '   <input class="form-control"  type="text" id="AdmAdvAdr" value="0x1ac03ee2171d22aa7b7d68231018f7169ba2d8ac"></input> <br> <br>'
    text += '   <text>User Name </text> <br>' 
    text += '   <input type="text" id="userName" value="test"></input> <br>' 
    text += '   <button type="button" onClick="' + funcLoad + '">Enter</button>'
    text += '</div>'
    this.setHtmlContent(elementId, text);  
}

ZSCHtml.prototype.loadButtonForEnablingElement = function(funcName, elementId) {
    var func;
    var hashLogId;
    var text = '<text>Enable the user in ZSC blockchain system</text>'

    functionInput = funcName + "('provider', 'AppleForProviderHash')";
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

    
    this.setHtmlContent(elementId, text);  
}


ZSCHtml.prototype.loadPageHeader = function(funcName, elementId) {
    var funcPrefix = funcName + "(";
    var funcSuffix = ")";
    var text = ''
    text += '<div class="well">'
    text += '   <button type="button" onClick="' + funcPrefix + "'wallet'" + funcSuffix + '">Wallate</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'profile'" + funcSuffix + '">Profile</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'templates'" + funcSuffix + '">Templates</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'agreements'" + funcSuffix + '">Agreements</button>'
    text += '</div>'
    this.setHtmlContent(elementId, text);  
}


