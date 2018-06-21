/*
Copyright (c) 2018 ZSC Dev Team
*/

//class zscWallet
function ZSCModuleAdrs(nm, abi, adr) {
    this.adrName = [];
    this.adrValue = [];
    this.userName = nm;
    this.userType;
    this.account = web3.eth.accounts[0];
    this.contractAdr = adr;
    this.contractAbi = JSON.parse(abi);
}

ZSCModuleAdrs.prototype.setUserName = function(nm) {this.userName = nm; }

ZSCModuleAdrs.prototype.setUserType = function(type) {this.userType = type;}

ZSCModuleAdrs.prototype.getModuleAdrs = function(func) {  
    var gm = this;
    var callBack = func;
    var myControlApi = web3.eth.contract(gm.contractAbi).at(gm.contractAdr);
    myControlApi.getModuleAddresses({from: gm.account},
        function(error, result){ 
        if(!error) {
            gm.parserAdrInfo(gm, result);
            callBack();
        } else {
            console.log("error: " + error);
        }
    });
}

ZSCModuleAdrs.prototype.parserAdrInfo = function(gm, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    for (var i = 0; i < 10; ++i) {
        gm.adrName[i]  = newsids[i].split("=")[0];
        gm.adrValue[i] = "0x" + newsids[i].split("=")[1];
    }
    gm.adrName[0] = "TestZSC-Token";
}

ZSCModuleAdrs.prototype.loadModuleAdrsHtml = function(elementId)  {
    var titlle = this.userType + " [" + this.userName + "] - wallet info"

    text = '<div class="well"> <text> ' + titlle + ' </text></div>';

    text += '<div class="well">';
    text += '<table align="center" style="width:600px;min-height:30px">'
    text += '<tr>'
    text += '   <td>ZSC Module Name</td> <td> Address </td> '
    text += '</tr>'
    text += '<tr> <td>---</td> <td>---</td></tr>'

    for (var i = 0; i < 10; ++i) {
        text += '<tr>'
        text += '   <td><text>' + this.adrName[i]  + '</text></td>'
        text += '   <td><text> <a href="https://rinkeby.etherscan.io/address/' + this.adrValue[i] + '" target="_blank" >' + this.adrValue[i] + '</a></text></td>'
        text += '</tr>'
    }
    text += '</table></div>'
    text += '</div>'

    document.getElementById(elementId).innerHTML = text;  
}


