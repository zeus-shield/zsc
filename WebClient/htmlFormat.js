/*
Copyright (c) 2018 ZSC Dev Team
*/

function hF_loadLoginDiv(elementId) {
    var functionInput = "checkUser('controlApisAdvAdr', 'userName', 'password')";
    var text = ''
    text += '<div class="well">'
    text += '   <text>Login ZSC system</text><br><br>'
    text += '   <text>ZSC platform address </text> <br>'
    text += '   <input type="text" id="controlApisAdvAdr"></input> <br> <br>'
    text += '   <text>User Name </text> <br>' 
    text += '   <input type="text" id="userName"></input> <br>' 
    text += '   <text>Password</text> <br> '
    text += '   <input type="password" id="password" ></input> <br> <br> '
    text += '   <button type="button" onClick="' + functionInput + '">Enter</button>'
    text += '</div>'
    document.getElementById(elementId).innerHTML = text;  
}

function hF_loadButtonForEnablingElement(elementId) {
    var functionInput = "uF_creatProvider('CreateProvider', 'CreateProviderHash')";
    var text = '<text>Enable the user in ZSC blockchain system</text>'
    text += '<div class="well">'
    text += '    <button type="button" onClick="' + functionInput + '">Enable User</button>'
    text += '    <text id="CreateProviderHash"></text>'
    text += '</div>'
    document.getElementById(elementId).innerHTML = text;  
}
