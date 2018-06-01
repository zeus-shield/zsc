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

ZSCHtml.prototype.loadPageHeader = function(funcName, doesUserApplied) {
    var funcPrefix = funcName + "(";
    var funcSuffix = ")";
    var text;

    text = '<div class="well">'

    if (doesUserApplied == false) {
        text += '   <button type="button" onClick="' + funcPrefix + "'apply-provider' " + funcSuffix + '">Apply for provider</button> <br><br>'
        text += '   <button type="button" onClick="' + funcPrefix + "'apply-receiver' " + funcSuffix + '">Apply for receiver</button> <br><br>'
    } else {
        text += '   <button type="button" onClick="' + funcPrefix + "'wallet'" + funcSuffix + '">Wallate</button>'
        text += '   <button type="button" onClick="' + funcPrefix + "'profile'" + funcSuffix + '">Profile</button>'
        text += '   <button type="button" onClick="' + funcPrefix + "'template'" + funcSuffix + '">Templates</button>'
        text += '   <button type="button" onClick="' + funcPrefix + "'agreement'" + funcSuffix + '">Agreements</button>'
    }
    text += ' <br><text id="ApplyForProviderHash"></text>'
    text += '</div>'
    this.setHtmlContent(this.pageHeaderId, text);  
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
ZSCHtml.prototype.loadPageBody = function(tag, func) {
    var text;
    switch(tag) {
        case "login": 
            text = this.loadLogin(func); 
            break;
        case "welecome": 
            text = this.loadWelcome(); 
            break;
        case "apply": 
            text = this.loadButtonForEnablingElement(func); 
            break;
    }
    this.setHtmlContent(this.pageBodyId, text);  
} 

ZSCHtml.prototype.loadLogin = function(funcName) {
    var functionInput = funcName + "('AdmAdvAdr', 'UserName')";
    text =  '<div class="well">'
    text += '   <text>Login ZSC system</text><br><br>'
    text += '   <text>ZSC platform address </text> <br>'
    text += '   <input class="form-control"  type="text" id="AdmAdvAdr" value="0xc7e03da56e2be02cbdca9e7a7cf6148df7eaae97"></input> <br> <br>'
    text += '   <text>User Name </text> <br>' 
    text += '   <input type="text" id="UserName" value="test"></input> <br>' 
    text += '   <button type="button" onClick="' + functionInput + '">Enter</button>'
    text += '</div>'
    
    return text;
}

ZSCHtml.prototype.loadWelcome = function() {
    var text = '<div class="well">'
    text += '   <text>Welcome to the ZSC testing platform</text>'
    text += '</div>'
    return text; 
}



