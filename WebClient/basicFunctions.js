/*
Copyright (c) 2018 ZSC Dev Team
*/

var uF_userName ;
var uF_userNameHr ;

function bF_showHashResult(elementID, hash) {
    web3.eth.getTransactionReceipt(hash, 
    function(error, result){ 
        if(!error) {
            var show;
            if (result == null) {
                show =  "(pending)" + hash ;
                uF_showHashResult(elementID, hash);
            } else {
                if (result.status == 0) {
                    show = "(failure)" + hash;
                } else {
                    show = "(succeeded)" + hash ;
                }
            }
            document.getElementById(elementID).innerText = show;
        } else {
            console.log("error: " + error);
        }
    });
}

function bf_getEthAccount() {
    //console.log(web3.eth.accounts[0])
    var account = web3.eth.accounts[0];
    //if (account == undefined) alert("Need to login in MetaMask!!");
    return account;
}

function bf_getGasPrice(limit) {
    return limit * 1000000000; //limits * gwei
}

function bf_getGasLimit(limit) {
    return limit * 1000 * 1000; //limits * 1 million
}

function bF_parserUrlRequest(nodeId) {    
    var urlinfo=window.location.href; 

    var found1 = urlinfo.indexOf("?");
    var found2 = urlinfo.indexOf("=");

    if (found1 == -1 || found2 == -1) return false;

    var len=urlinfo.length;
    var offset=urlinfo.indexOf("?");
    var newsidinfo=urlinfo.substr(offset,len)
    var newsids = newsidinfo.split("&");

    var userInfo = newsids[0];
    var hrInfo = newsids[1];

    var user = userInfo.split("=")[1];
    var hr = hrInfo.split("=")[1];

    uF_userName = user;
    uF_userNameHr = hr;

    return true;
}  


function bF_getUsername() {    
    return uF_userName;
}


function bF_getUsernameHr() {    
    return uF_userNameHr;
}
