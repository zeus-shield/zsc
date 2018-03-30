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
    text += '   <button type="button" onClick="' + funcPrefix + 1 + funcSuffix + '">List Profile</button>'
    text += '   <button type="button" onClick="' + funcPrefix + 2 + funcSuffix + '">List Template</button>'
    text += '   <button type="button" onClick="' + funcPrefix + 3 + funcSuffix + '">List Agreement</button>'
    text += '</div>'
    document.getElementById(elementId).innerHTML = text;  
}

/*tag:
logon, wallet, profile, templates, agreements
*/
function hF_loadPageBody(elementId, tag) {
    switch(tag) {
        case "logon": 
            hF_loadWelcome(elementId); 
            break;
        case "wallet": 
            hF_loadWallet(elementId);
            break;
    }
} 

function hF_loadWelcome(elementId) {
    var text = ''
    text += '<div class="well">'
    text += '   <text>Welcome to the ZSC testing platform</text>'
    text += '</div>'
    document.getElementById(elementId).innerHTML = text; 
}


function hF_loadWallet(elementId) {
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

    document.getElementById(elementId).innerHTML = text;  
}




