/*
Copyright (c) 2018 ZSC Dev Team
*/

function hF_loadLogin(elementId) {
    var funcLoad = "checkUser('controlApisAdvAdr', 'userName', 'password')";
    var text = ''
    text += '<div class="well">'
    text += '   <text>Login ZSC system</text><br><br>'
    text += '   <text>ZSC platform address </text> <br>'
    text += '   <input class="form-control"  type="text" id="controlApisAdvAdr" value="0x1ac03ee2171d22aa7b7d68231018f7169ba2d8ac"></input> <br> <br>'
    text += '   <text>User Name </text> <br>' 
    text += '   <input type="text" id="userName" value="test"></input> <br>' 
    text += '   <text>Password</text> <br> '
    text += '   <input type="password" id="password" value="aaa"></input> <br> <br> '
    text += '   <button type="button" onClick="' + funcLoad + '">Enter</button>'
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


function hF_loadPageHeader(elementId) {
    var funcPrefix = "loadPageBody(";
    var funcSuffix = ")";
    var text = ''
    text += '<div class="well">'
    text += '   <button type="button" onClick="' + funcPrefix + "'wallet'" + funcSuffix + '">Wallate</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'profile'" + funcSuffix + '">Profile</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'templates'" + funcSuffix + '">Templates</button>'
    text += '   <button type="button" onClick="' + funcPrefix + "'agreements'" + funcSuffix + '">Agreements</button>'
    text += '</div>'
    document.getElementById(elementId).innerHTML = text;  
}

/*tag:
logon, wallet, profile, templates, agreements
*/
function hF_loadPageBody(elementId, tag) {
    var text;
    switch(tag) {
        case "logon": 
            text = hF_loadWelcome(); 
            break;
        case "wallet": 
            text = hF_loadWallet();
            break;
        case "profile": 
            text = hF_loadParameters("user");
            break;
    }
    document.getElementById(elementId).innerHTML = text; 
} 

////////////////////////////////////

function hF_loadWelcome() {
    var text = ''
    text += '<div class="well">'
    text += '   <text>Welcome to the ZSC testing platform</text>'
    text += '</div>'
    return text;
}


function hF_loadWallet() {
    var functionInput = "uF_withdrawEth('DestAddress', 'EthAmount', 'TransferEthHash')";
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

function hF_loadParameters(type) {
    var functionInput = "uF_withdrawEth('DestAddress', 'EthAmount', 'TransferEthHash')";
    var parameterNos = uF_numParameters(type);
   
    var text ="";
    text += '<div class="well">';
   
    for (var i = 0; i < parameterNos; ++i) {
        text += '   <text>' + uF_getParameterName(type, i) + ': </text>'
        text += '   <input type="text" id="' + uF_getParameterValue(type, i) + '"></input>'
    }
    text += '</div>'
    return text;
}




