/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUserManagement(admAdr, abi) {
    this.admAdvAdr = admAdr;
    this.admAdvAbi = abi;
    this.userName = [];
    this.userPass = [];
    this.userStatus = [];
    this.userType = [];
    this.userId = [];
    this.userNodeAdr = [];
    this.userEthAdr = [];
    this.userZscAdr = [];
    this.userActived = [];
    this.userNos = 0;
    this.account = web3.eth.accounts[0];
    this.myAdmAdv = web3.eth.contract(abi).at(admAdr);
    this.phpCallback;
}

ZSCUserManagement.prototype = new ZSCJsBase();

ZSCUserManagement.prototype.addUser = function(userNameId, passWordId, hashId){
    var userName = document.getElementById(userNameId).value; 
    var passWord = document.getElementById(passWordId).value; 
    this.myAdmAdv.addUser(userName, passWord,
        {from: this.account, gas: 9000000},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
    });
}  

//ZSCUserMangement.prototype.setUserActiveStatus = (username, status, elementId, function() {}


ZSCUserManagement.prototype.loadUsers = function(phpFunc) {
    this.phpCallback = phpFunc;
    this.numUsers(this, function(gm) {
        gm.loadUserInfos();
    });
}

ZSCUserManagement.prototype.numUsers = function(gm, func) {
    this.myAdmAdv.numUsers(
        {from: this.account},
        function(error, num){ 
            if(!error) { 
                gm.userNos = num.toString(10); 
                func(gm);
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCUserManagement.prototype.loadUserInfos = function() {
    for (var i = 0; i < this.userNos; ++i) {
        this.loadUserInfoByIndex(this, i, function(gm, index, userInfo) {
                gm.parserUserInfo(index, userInfo);
                if (index == gm.userNos - 1) {
                    gm.phpCallback();
                 }
            });
    } 
} 

ZSCUserManagement.prototype.loadUserInfoByIndex = function(gm, index, func) {
    this.myAdmAdv.getUserInfoByIndex(index, 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                var ret = para;
                func(gm, index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCUserManagement.prototype.parserUserInfo = function(index, info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");

    var userName    = newsids[0];
    var userPass    = newsids[1];
    var userActived = newsids[2];
    var userStatus  = newsids[3];
    var userType    = newsids[4];
    var userId      = newsids[5];
    var userNodeAdr = newsids[6];
    var userEthAdr  = newsids[7];
    var userZscAdr  = newsids[8];

    this.userName[index]    = userName.split("=")[1];
    this.userPass[index]    = userPass.split("=")[1];
    this.userActived[index] = userActived.split("=")[1];
    this.userStatus[index]  = userStatus.split("=")[1];
    this.userType[index]    = userType.split("=")[1];
    this.userId[index]      = "0x" + userId.split("=")[1];
    this.userNodeAdr[index] = "0x" + userNodeAdr.split("=")[1];
    this.userEthAdr[index]  = "0x" + userEthAdr.split("=")[1];
    this.userZscAdr[index]  = "0x" + userZscAdr.split("=")[1];
}

ZSCUserManagement.prototype.loadUserManagementHtml = function(showDetails, setStatus, elementId) {
    var showPrefix = showDetails + "('"; 
    var showSuffix = "')";

    var setStatusPrefix = setStatus + "('"; 
    var setStatusSuffix = "')";

    /*
    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>user info</td> <td>adrs</td> <td>operations</td> <td>details</td>  '
    text += '</tr> '
    text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> </tr>'

    for (var i = 0; i < this.userNos; ++i) {
        var hashId = this.userName[i] + "Hash"
        text += '</tr>';
        text += '   <td><text>   name: ' + this.userName[i]    + '</text><br>'
        text += '       <text>actived: ' + this.userActived[i] + ' </text><br>'
        text += '       <text>   type: ' + this.userType[i]    + ' </text><br>'
        text += '       <text> status: ' + this.userStatus[i]  + ' </text>'
        text += '   </td>'
        text += '   <td><text>   id: ' + this.userId[i]      + ' </text><br>'
        text += '       <text> node: ' + this.userNodeAdr[i] + ' </text><br>'
        text += '       <text id="'+ hashId + '"> log: </text>'
        text += '   </td>'
        text += '   <td><button type="button" onClick="' + setStatusPrefix + "'" + name + "', '" + ",'true'," + hashId + "'"  + setStatusSuffix + '">Active</button><br>'
        text += '       <button type="button" onClick="' + setStatusPrefix + "'" + name + "', '" + ",'false',"+ hashId + "'" + setStatusSuffix + '">Deactive</button>'
        text += '   </td>'
        text += '   <td><button type="button" onClick="' + showPrefix + "'wallets', '" + name + "', '" + hashId + "'" + showSuffix + '">Wallets</button><br>'
        text += '       <button type="button" onClick="' + showPrefix + "'templates', '" + name + "', '" + hashId + "'" + showSuffix + '">Templates</button><br>'
        text += '       <button type="button" onClick="' + showPrefix + "'agreements', '" + name + "', '" + hashId + "'" + showSuffix + '">Agreements</button>'
        text += '   </td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> </tr>'
    }
    */

    var text = ' <text id="ButtonHashId"> </text>'
    text += '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>name</td> <td>pass</td> <td>actived</td> <td>type</td> <td>status</td>  <td>active</td>  <td>deactive</td>  <td>detail</td> '
    text += '</tr> '
    text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td>  </tr>'

    var hashId = "ButtonHashId";
    for (var i = 0; i < this.userNos; ++i) {
        text += '</tr>';
        text += '   <td><text> ' + this.userName[i]    + '</text></td>'
        text += '   <td><text> ' + this.userPass[i] + ' </text></td>'
        text += '   <td><text> ' + this.userActived[i] + ' </text></td>'
        text += '   <td><text> ' + this.userType[i]    + ' </text></td>'
        text += '   <td><text> ' + this.userStatus[i]  + ' </text></td>'
        text += '   <td><button type="button" onClick="' + setStatusPrefix + this.userName[i] + "', 'true', '"  + hashId + setStatusSuffix + '">Active</button></td>'
        text += '   <td><button type="button" onClick="' + setStatusPrefix + this.userName[i] + "', 'false', '" + hashId + setStatusSuffix + '">Deactive</button></td>'
        text += '   <td><button type="button" onClick="' + showPrefix + showSuffix + '">Details</button></td>'
        text += '</tr>'
        text += '<tr> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> <td>---</td> </tr>'
    }
    document.getElementById(elementId).innerHTML = text;  
}

ZSCUserManagement.prototype.setUserActiveState = function(userName, status, hashId) {
    var tag;
    if (status == "false") tag = false;
    else tag = true;
    this.myAdmAdv.setUserActiveState(userName, tag, {from: this.account, gas: 9000000},
        function(error, result) { 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);})
             else console.log("error: " + error);
        });
}

