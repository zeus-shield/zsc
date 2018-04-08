/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZscUserMangement(adr, abi) {
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

ZscUserMangement.prototype.addUser = function(userNameId, hashId, func){
    var userName = document.getElementById(userNameId).value; 
    this.myControlApi.addUser(userName, {from: this.account, gas: 9000000},
    function(error, result){ 
        if(!error) sF_showHashResult(hashId, result);
        else console.log("error: " + error);
    });
}  

ZscUserMangement.prototype.loadUsers = function(func) {
    this.numUsers(function() {
        this.loadUserInfos(function(index){
            if (index == this.parameNos - 1) {
                func();
            }
        });
    });
}

ZscUserMangement.prototype.numUsers = function(func) {
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

ZscUserMangement.prototype.loadUserInfos = function(func) {
    for (var i = 0; i < this.userNos; ++i) {
        loadUserNameByIndex(i, function(index, userInfo) {
                this.parserUserInfo(userInfo);
                if (index == this.userNos - 1) {
                    func();
                 }
            });
    } 
} 

ZscUserMangement.prototype.loadUserInfoByIndex = function(index, func) {
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

ZscUserMangement.prototype.parserUserInfo = function(info) {
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

ZscUserMangement.prototype.loadUserManagementHtml = function(funcName, elementId) {
    var funcPrefix = funcName + "('"; 
    var funcSuffix = "')'";

    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td><text>user name</text></td>  <td><text>user type</text></td>  <td><text>user status</text></td>  <td><text>user id</text></td> <td><text>user zsc wallet</text></td>'
    text += '</tr><tr>'

    for (var i = 0; i < this.userNos; ++i) {
        text += '   <td><text>' + this.userName[i]    + '</text></td>'
        text += '   <td><text>' + this.userStatus[i]  + '</text></td>'
        text += '   <td><text>' + this.userType[i]    + '</text></td>'
        text += '   <td><text>' + this.userId[i]      + '</text></td>'
        text += '   <td><text>' + this.userNodeAdr[i] + '</text></td>'
        text += '   <button type="button" onClick="' + funcPrefix + this.userName[i] + funcSuffix + '">Show</button>'
    }
    text += '</tr>'
    document.getElementById(elementId).innerHTML = text;  
}


