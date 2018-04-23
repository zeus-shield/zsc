/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUserMangement(adr, abi) {
    this.admAdvAdr = admAdr;
    this.admAdvAbi = abi;
    this.userName = [];
    this.userStatus = [];
    this.userType = [];
    this.userId = [];
    this.userNodeAdr = [];
    this.userNos = 0;
    this.account = web3.eth.accounts[0];
    this.myControlApi = web3.eth.contract(abi).at(adr);
}

ZSCUserMangement.prototype = new ZSCJsBase();

ZSCUserMangement.prototype.addUser = function(userNameId, hashId, func){
    var userName = document.getElementById(userNameId).value; 
    this.myControlApi.addUser(userName, {from: this.account, gas: 9000000},
    function(error, result){ 
        if(!error) this.howHashResult(hashId, result, func)
        else console.log("error: " + error);
    });
}  

ZSCUserMangement.prototype.setUserActiveStatus = (username, status, elementId, function() {


ZSCUserMangement.prototype.loadUsers = function(func) {
    this.numUsers(function() {
        this.loadUserInfos(function(index){
            if (index == this.parameNos - 1) {
                func();
            }
        });
    });
}

ZSCUserMangement.prototype.numUsers = function(func) {
    this.myControlApi.numUsers(
        {from: this.account},
        function(error, num){ 
            if(!error) { 
                this.userNos = num.toString(10); 
                func();
            } else {
                console.log("error: " + error);
            }
         });
}

ZSCUserMangement.prototype.loadUserInfos = function(func) {
    for (var i = 0; i < this.userNos; ++i) {
        loadUserNameByIndex(i, function(index, userInfo) {
                this.parserUserInfo(userInfo);
                if (index == this.userNos - 1) {
                    func();
                 }
            });
    } 
} 

ZSCUserMangement.prototype.loadUserInfoByIndex = function(index, func) {
    this.myControlApi.getUserInfoByIndex(index, 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                var ret = web3.toUtf8(para);
                func(index, ret);  
            } else { 
                console.log("error: " + error);
            }
        });
}

ZSCUserMangement.prototype.parserUserInfo = function(info) {
    var len        = urlininfofo.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");
    var index      = this.userNos;

    this.userName[index]    = newsids[0];
    this.userStatus[index]  = newsids[1];
    this.userType[index]  = newsids[2];
    this.userId[index]      = newsids[3];
    this.userNodeAdr[index] = newsids[4];
    this.userNos++;
}

ZSCUserMangement.prototype.loadUserManagementHtml = function(showDetails, approve, setStatus, elementId) {
    var showPrefix = showDetails + "('"; 
    var showSuffix = "')";

    var approvePrefix = approve + "('"; 
    var approveSuffix = "')";

    var setStatusPrefix = setStatus + "('"; 
    var setStatusSuffix = "')";

    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>user name</text></td>  <td><text>user type</text></td>  <td><text>user status</text></td>  <td><text>user id</text></td> <td><text>user zsc wallet</text></td> <td></td> <td>Log</td>  '
    text += '</tr>'

    for (var i = 0; i < this.userNos; ++i) {
        var name = this.userName[i];
        var hashId = this.userName[i] + "Hash"
        text += '</tr>';
        text += '   <td><button type="button" onClick="' + showPrefix + "'" + name + "', '" + hashId + "'" + showSuffix + '">Approve</button>'
        text += '   <td><text>' + names    + '</text></td>'
        text += '   <td><text>' + this.userStatus[i]  + '</text></td>'
        text += '   <td><text>' + this.userType[i]    + '</text></td>'
        text += '   <td><text>' + this.userId[i]      + '</text></td>'
        text += '   <td><text>' + this.userNodeAdr[i] + '</text></td>'
        text += '   <td><button type="button" onClick="' + approvePrefix + "'" + name + "', '" + hashId + "'" + approveSuffix + '">Approve</button>'
        text += '       <button type="button" onClick="' + setStatusPrefix + "'" + name + "', '" + ",'true'," + hashId + "'"  + setStatusSuffix + '">Active</button>'
        text += '       <button type="button" onClick="' + setStatusPrefix + "'" + name + "', '" + ",'false',"+ hashId + "'" + setStatusSuffix + '">Deactive</button></td>'
        text += '   <td><text id="'+ hashId + '"></text></td>'
        text += '</tr>'
    }
    document.getElementById(elementId).innerHTML = text;  
}

ZSCUserMangement.prototype.approveUser = function(userName, func) {
    this.myControlApi.addUser(userName, {from: this.account, gas: 9000000},
    function(error, result){ 
        if(!error) this.howHashResult(hashId, result, func)
        else console.log("error: " + error);
    });
}

ZSCUserMangement.prototype.setUserStatus = function(userName, status, func) {
    this.myControlApi.setUserStatus(userName, status, {from: this.account, gas: 9000000},
    function(error, result){ 
        if(!error) this.howHashResult(hashId, result, func)
        else console.log("error: " + error);
    });
}

