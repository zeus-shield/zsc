/*
Copyright (c) 2018 ZSC Dev Team
*/

function uF_loadButtonForEnablingElement(elementId) {
    var functionInput = "uF_creatProvider('CreateProvider', 'CreateProviderHash')";
    var text = '<text>Enable the user in ZSC blockchain system</text>'
    text += '<div class="well">'
    text += '    <button type="button" onClick="' + functionInput + '">Enable User</button>'
    text += '    <text id="CreateProviderHash"></text>'
    text += '</div>'
    document.getElementById(elementId).innerHTML = text;  
}
