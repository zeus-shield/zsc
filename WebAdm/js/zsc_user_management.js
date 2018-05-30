/*
Copyright (c) 2018 ZSC Dev Team
*/
function ZSCUserManagement(admAdr, abi) {
    this.admAdvAdr = admAdr;
    this.admAdvAbi = abi;
    this.userName = [];
    this.userStatus = [];
    this.userType = [];
    this.userId = [];
    this.userNodeAdr = [];
    this.userEthAdr = [];
    this.userZscAdr = [];
    this.userNos = 0;
    this.account = web3.eth.accounts[0];
    this.myAdmAdv = web3.eth.contract(abi).at(admAdr);
}

ZSCUserManagement.prototype = new ZSCJsBase();

ZSCUserManagement.prototype.addUser = function(userNameId, hashId, func){
    var userName = document.getElementById(userNameId).value; 
    this.myAdmAdv.addUser(userName, {from: this.account, gas: 9000000},
    function(error, result){ 
        if(!error) cC_showHashResultTest(hashId, result, function(){console.log("ok");});
        else console.log("error: " + error);
    });
}  

//ZSCUserMangement.prototype.setUserActiveStatus = (username, status, elementId, function() {}


ZSCUserManagement.prototype.loadUsers = function(func) {
    this.numUsers(this, function(gm) {
        gm.loadUserInfos(function(index){
            if (index == gm.parameNos - 1) {
                func();
            }
        });
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

ZSCUserManagement.prototype.loadUserInfos = function(func) {
    for (var i = 0; i < this.userNos; ++i) {
        this.loadUserInfoByIndex(this, i, function(gm, index, userInfo) {
                gm.parserUserInfo(userInfo);
                if (index == gm.userNos - 1) {
                    func(index);
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

ZSCUserManagement.prototype.parserUserInfo = function(info) {
    var len        = info.length;
    var offset     = info.indexOf("?");
    var newsidinfo = info.substr(offset,len)
    var newsids    = newsidinfo.split("&");
    var index      = this.userNos;

    var userName    = newsids[0];
    var userStatus  = newsids[1];
    var userType    = newsids[2];
    var userId      = newsids[3];
    var userNodeAdr = newsids[4];
    var userEthAdr  = newsids[5];
    var userZscAdr  = newsids[6];

    this.userName[index]    = userName.split("=")[1];
    this.userStatus[index]  = userStatus.split("=")[1];
    this.userType[index]    = userType.split("=")[1];
    this.userId[index]      = userId.split("=")[1];
    this.userNodeAdr[index] = userNodeAdr.split("=")[1];
    this.userEthAdr[index]  = userEthAdr.split("=")[1];
    this.userZscAdr[index]  = userZscAdr.split("=")[1];
    this.userNos++;
}

ZSCUserManagement.prototype.loadUserManagementHtml = function(showDetails, approve, setStatus, elementId) {
    var showPrefix = showDetails + "('"; 
    var showSuffix = "')";

    var approvePrefix = approve + "('"; 
    var approveSuffix = "')";

    var setStatusPrefix = setStatus + "('"; 
    var setStatusSuffix = "')";

    var text = '<table align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>user name</td>  <td>user type</td>  <td>user status</td>  <td>user id</td> <td>node adr</td> <td>eth adr</td> <td>zsc adr</td> <td>operations</td> <td>user info</td>  <td>log</td>  '
    text += '</tr>'

    for (var i = 0; i < this.userNos; ++i) {
        var name = this.userName[i];
        var hashId = this.userName[i] + "Hash"
        text += '</tr>';
        text += '   <td><button type="button" onClick="' + showPrefix + "'" + name + "', '" + hashId + "'" + showSuffix + '">Approve</button>'
        text += '   <td><text>' + names    + '</text></td>'
        text += '   <td><text>' + this.userType[i]    + '</text></td>'
        text += '   <td><text>' + this.userStatus[i]  + '</text></td>'
        text += '   <td><text>' + this.userId[i]      + '</text></td>'
        text += '   <td><text>' + this.userNodeAdr[i] + '</text></td>'
        text += '   <td><text>' + this.userEthAdr[i]  + '</text></td>'
        text += '   <td><text>' + this.userZscAdr[i]  + '</text></td>'
        text += '   <td><button type="button" onClick="' + setStatusPrefix + "'" + name + "', '" + ",'true'," + hashId + "'"  + setStatusSuffix + '">Active</button>'
        text += '       <button type="button" onClick="' + setStatusPrefix + "'" + name + "', '" + ",'false',"+ hashId + "'" + setStatusSuffix + '">Deactive</button>'
        text += '   </td>'
        text += '   <td><button type="button" onClick="' + showPrefix + "'wallets', '" + name + "', '" + hashId + "'" + showSuffix + '">Wallets</button>'
        text += '       <button type="button" onClick="' + showPrefix + "'templates', '" + name + "', '" + hashId + "'" + showSuffix + '">Templates</button>'
        text += '       <button type="button" onClick="' + showPrefix + "'agreements', '" + name + "', '" + hashId + "'" + showSuffix + '">Agreements</button>'
        text += '   </td>'
        text += '   <td><text id="'+ hashId + '"></text></td>'
        text += '</tr>'
    }
    document.getElementById(elementId).innerHTML = text;  
}

ZSCUserManagement.prototype.setUserStatus = function(userName, status, func) {
    this.myAdmAdv.setUserStatus(userName, status, {from: this.account, gas: 9000000},
        function(error, result) { 
            if(!error) cC_showHashResult(hashId, result, func)
             else console.log("error: " + error);
        });
}

