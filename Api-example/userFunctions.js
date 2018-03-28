/*
Copyright (c) 2018 ZSC Dev Team
*/

var uF_parameters = [];
var uF_parameterValue = [];
var uF_eth_account;
var uF_controlApisAdvAdr = "";
var uF_controlApisAdvAbi = "";
var uF_userName ;
var uF_userNameHr ;

function uf_getEthAccount() {
    //console.log(web3.eth.accounts[0])
    var account = web3.eth.accounts[0];
    //if (account == undefined) alert("Need to login in MetaMask!!");
    return account;
}

function uf_getGasPrice() {
    return limit * 1000000000; //limits * gwei
}

function uf_getGasLimit() {
    return limit * 1000 * 1000; //limits * 1 million
}

function uf_getControlApi(controlApiAdr) {
    var myContract = web3.eth.contract(uF_controlApisAdvAbi);
    return myContract.at(uF_controlApisAdvAdr);
}

function uF_creatProvider(nodeId, logID) {
    var myControlApi = uf_getControlApi();
    var nodeName = document.getElementById(nodeId).innerText;
    myControlApi.createElement(1, nodeName, nodeName, 
        {from: uf_getEthAccount(), gasPrice: uf_getGasPrice(), gas : uf_getGasLimit(55000)}, 
        function(error, result){ 
            if(!error) registerTransactionShow(logID, result);
            else console.log("error: " + error);
        });
}  

function uF_parserUrlRequest(nodeId) {    
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


function uF_getUsername() {    
    return uF_userName;
}


function uF_getUsernameHr() {    
    return uF_userNameHr;
}






