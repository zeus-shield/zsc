
/*
Copyright (c) 2018 ZSC Dev Team
*/

function checkWeb3Account(callback) {
    var userAccount = web3.eth.coinbase;
    var tag = true;
    if (userAccount == "null" || userAccount == null) {
        tag = false;
    } 

   if(tag){
        console.log(userAccount);
        callback(userAccount);
    } else {
        console.log(userAccount);
        var wait_callback = function(){
            checkeWeb3Account(callback);
        };
        setTimeout(wait_callback, 200);
    }
}


function getHeaderPara(str) {
    var userAccount = web3.eth.coinbase;
    var tag = true;
    if (userAccount == "null" || userAccount == null) {
        tag = false;
    } 

   if(tag){
        console.log(userAccount);
        callback(userAccount);
    } else {
        console.log(userAccount);
        var wait_callback = function(){
            checkeWeb3Account(callback);
        };
        setTimeout(wait_callback, 200);
    }
}

function ZSCInclude(userType) {
    this.userType = userType;
}

ZSCInclude.prototype.loadPosHeader = function() {
    var text = '<table align="center" style="width:650px">'
    text += ' <tr>'
    text += '  <td align="center"><a href="index.php"> [Home] </a></td>'
    text += '  <td align="center"><a href="user_wallet.php' + this.headerPara() + '"> [User-wallet] </a></td>'
    text += '  <td align="center"><a href="pos_robot_enhance.php' + this.headerPara() + '"> [Manage-robot]</a></td>'
    text += '  <td align="center"><a href="pos_robot_mine.php' + this.headerPara() + '"> [PoS-mining] </a></td>'
    text += '  <td align="center"><a href="pos_robot_selling.php' + this.headerPara() + '"> [Selling-robot] </a></td>'
    text += '  <td align="center"><a href="pos_robot_market.php' + this.headerPara() + '"> [Robot-market] </a></td>'
    text += ' </tr>';
    text += '</table>'
    return text;
}

ZSCInclude.prototype.loadInsuraProviderHeader = function() {
    var text = '<table align="center" style="width:650px">'
    text += ' <tr>'
    text += '  <td align="center"><a href="index.php"> [Home] </a></td>'
    text += '  <td align="center"><a href="user_profile.php' + this.headerPara() + '"> [User-profile] </a></td>'
    text += '  <td align="center"><a href="user_wallet.php' + this.headerPara() + '"> [User-wallet] </a></td>'
    text += '  <td align="center"><a href="insura_tmp.php' + this.headerPara() + '"> [Templats]</a></td>'
    text += '  <td align="center"><a href="insura_agr_provider.php' + this.headerPara() + '"> [Agreements]</a></td>'
    text += '  <td align="center"><a href="insura_agr_all.php' + this.headerPara() + '"> [Market]</a></td>'
    text += ' </tr>'
    text += '</table>';
    return text;
    }

ZSCInclude.prototype.loadInsuraReceiverHeader = function() {
    var text = '<table align="center" style="width:650px">'
    text += ' <tr>'
    text += '  <td align="center"><a href="index.php"> [Home] </a></td>'
    text += '  <td align="center"><a href="user_profile.php' + this.headerPara() + '"> [User-profile] </a></td>'
    text += '  <td align="center"><a href="user_wallet.php' + this.headerPara() + '"> [User-wallet] </a></td>'
    text += '  <td align="center"><a href="insura_agr_receiver.php' + this.headerPara() + '"> [Agreements]</a></td>'
    text += '  <td align="center"><a href="insura_agr_all.php' + this.headerPara() + '"> [Market]</a></td>'
    text += ' </tr>'
    text += '</table>';
    return text;
}

ZSCInclude.prototype.loadAlert = function() {
    var text = "<i>Needs to install MetaMask extension</i>"
    text +=    "<i> (需要安装MetaMask插件才能显示登录框以及其他相关页面)</i><br>>"
    text +=    "<i>Both the FireFox and Chrome browsers are recommended</i>"
    text +=    "<i> (推荐使用火狐或者Chrome浏览器)</i>";  
    return text;
}

ZSCInclude.prototype.headerPara = function() {
    return "?userType=" + this.userType;
}

ZSCInclude.prototype.loadHeader = function() {
    if (this.userType == "provider") {
        return this.loadInsuraProviderHeader();

    } else if (this.userType == "receiver") {
        return this.loadInsuraReceiverHeader();

    } else if (this.userType == "staker") {
        return this.loadPosHeader();

    } else {
        return 'user type:' + this.userType;
    }
}



