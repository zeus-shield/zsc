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
    this.itemTags = [];
    this.userNos = 0;
    this.account = web3.eth.accounts[0];
    this.myAdmAdv = web3.eth.contract(abi).at(admAdr);
    this.gasPrice = cC_getGasPrice();
    this.gasLimit = cC_getGasLimit();
}

ZSCUserManagement.prototype = new ZSCJsBase();

ZSCUserManagement.prototype.resetAllItemTags = function(gm) {
    for (var i = 0; i < gm.userNos; ++i) {
        gm.itemTags[i] = false;
    }
}

ZSCUserManagement.prototype.checkAllItemTags = function(gm) {
    for (var i = 0; i < gm.userNos; ++i) {
        if (gm.itemTags[i] == false) {
            return false;
        }
    }
    return true;
}

ZSCUserManagement.prototype.addUser = function(userNameId, passWordId, hashId){
    var userName = document.getElementById(userNameId).value; 
    var passWord = document.getElementById(passWordId).value; 
    this.myAdmAdv.addUser(userName, passWord,
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
    });
}  

ZSCUserManagement.prototype.addUserRandom = function(prefixId, suffixLenId, passLenId, hashId){
    var prefix    = document.getElementById(prefixId).value; 
    var suffixLen = document.getElementById(suffixLenId).value; 
    var passLen   = document.getElementById(passLenId).value; 

    this.myAdmAdv.addUserRandom(prefix, suffixLen, passLen, 
        {from: this.account, gasPrice: this.gasPrice, gas: this.gasLimit},
        function(error, result){ 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);});
            else console.log("error: " + error);
    });
}  

ZSCUserManagement.prototype.loadUsers = function(phpFunc) {
    this.phpCallback = phpFunc;
    this.numUsers(this, function(gm) {
        gm.resetAllItemTags(gm);
       if (gm.userNos == 0) {
            gm.phpCallback();
        } else {
            gm.loadUserInfos();
        }
    });
}

ZSCUserManagement.prototype.numUsers = function(gm, func) {
    this.myAdmAdv.numUsers(
        "123456",
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
            if (gm.checkAllItemTags(gm) == true) {
                gm.phpCallback();
            }
        });
    } 
} 

ZSCUserManagement.prototype.loadUserInfoByIndex = function(gm, index, func) {
    var gm = this;
    gm.myAdmAdv.getUserInfoByIndex(
        "123456",
        index, 
        {from: this.account},
        function(error, para){ 
            if(!error) {
                var ret = para;
                gm.itemTags[index] = true;
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
    var userStatus  = newsids[1];
    var userType    = newsids[2];
    var userNodeAdr = newsids[3];
    var userEthAdr  = newsids[4];

    this.userName[index]    = userName.split("=")[1];
    this.userStatus[index]  = userStatus.split("=")[1];
    this.userType[index]    = userType.split("=")[1];
    this.userNodeAdr[index] = "0x" + userNodeAdr.split("=")[1];
    this.userEthAdr[index]  = "0x" + userEthAdr.split("=")[1];
}

ZSCUserManagement.prototype.loadUserManagementHtml = function(setStatus, elementId) {
    var setStatusPrefix = setStatus + "('"; 
    var setStatusSuffix = "')";
    var hashId = "ButtonHashId";

    var text = ' <text id="ButtonHashId"> </text>'
    text += '<table id="ZSCUserInfoBody" align="center" style="width:800px;min-height:30px">'
    text += '<tr>'
    text += '   <td>index </td> <td>name</td> <td>type</td> <td>status</td> <td>node/creator</td> <td>active</td>  <td>deactive</td> '
    text += '</tr> '
    text += '<tr> <td>---------</td> <td>---------</td> <td>---------</td> <td>---------</td>'
    text += '<td>------------------------------------------------------------</td>'
    text += '<td>---</td> <td>---</td>   </tr>'

    for (var i = 0; i < this.userNos; ++i) {
        text += '<tr>';
        text += '   <td><text> ' + i + '</text></td>'
        text += '   <td><text> ' + this.userName[i]    + '</text></td>'
        text += '   <td><text> ' + this.userType[i]    + ' </text></td>'
        text += '   <td><text> ' + this.userStatus[i]  + ' </text></td>'
        text += '   <td><text>' + this.userNodeAdr[i]  + ' </text><br>'
        text += '       <text>' + this.userEthAdr[i]  + ' </text></td>'
        text += '   <td><button type="button" onClick="' + setStatusPrefix + this.userName[i] + "', 'true', '"  + hashId + setStatusSuffix + '">Active</button></td>'
        text += '   <td><button type="button" onClick="' + setStatusPrefix + this.userName[i] + "', 'false', '" + hashId + setStatusSuffix + '">Deactive</button></td>'
        text += '</tr> '
    }
    text += '</table>';
    document.getElementById(elementId).innerHTML = text;  
}

ZSCUserManagement.prototype.setUserActiveState = function(userName, status, hashId) {
    var tag;
    if (status == "false") tag = false;
    else tag = true;
    this.myAdmAdv.setUserActiveState(userName, tag, {from: this.account, gas: 7430000},
        function(error, result) { 
            if(!error) cC_showHashResultTest(hashId, result, function() {window.location.reload(true);})
             else console.log("error: " + error);
        });
}

ZSCUserManagement.prototype.exportUserInfo = function() {
    var downloadLink;
    var dataType = 'application/vnd.ms-excel';
    var tableSelect = document.getElementById("ZSCUserInfoBody");
    var tableHTML = tableSelect.outerHTML.replace(/ /g, '%20');
    
    // Specify file name
    filename = "userinfos"?"userinfos"+'.xls':'excel_data.xls';
    
    // Create download link element
    downloadLink = document.createElement("a");
    
    document.body.appendChild(downloadLink);
    
    if(navigator.msSaveOrOpenBlob){
        var blob = new Blob(['\ufeff', tableHTML], {
            type: dataType
        });
        navigator.msSaveOrOpenBlob( blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
        // Setting the file name
        downloadLink.download = filename;
        
        //triggering the function
        downloadLink.click();
    }
}

