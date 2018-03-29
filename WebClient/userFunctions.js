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

function uF_showHashResult(elementID, hash) {
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
function uf_getEthAccount() {
    //console.log(web3.eth.accounts[0])
    var account = web3.eth.accounts[0];
    //if (account == undefined) alert("Need to login in MetaMask!!");
    return account;
}

function uf_getGasPrice(limit) {
    return limit * 1000000000; //limits * gwei
}

function uf_getGasLimit(limit) {
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

function uF_getSingleParameter(node, index, func){  
    var myControlApi = uf_getControlApi();
    myControlApi.getElementParameter(node, uF_parameters[index], {from: uf_getEthAccount()},
         function(error, value){ 
            if(!error) { 
                func(index, value);
            }  
            else  console.log("error: " + error);
        });
}

function uF_loadElementParameterValues(node, num, func) {
    for (var i = 0; i < num; ++i) {
        uF_getSingleParameter(node, i, function(index, value) {
            uF_parameterValue[index] = value;
            if (index == num - 1)
                func(index);
        });
    } 
} 


function uF_setElementParameter(nodeId, logID) {
    var myControlApi = uf_getControlApi();
    var nodeName = document.getElementById(nodeId).innerText;
    var hr = document.getElementById(nodeId + "Hr").innerText;

    var info = "";
    var count = 0;

    for (var i = 0; i < uF_parameters.length; ++i) {
        var value = document.getElementById(uF_parameters[i]).value;
        if (value != uF_parameterValue[i]) {
            count ++;
            uF_parameterValue[i] = value;

            info += "{<" + uF_parameters[i] + ">" + "<" + value + ">}";
        }
    }

    if (count > 0) {
        myControlApi.setElementMultipleParameters(1, nodeName, hr, info,  
           {from: uf_getEthAccount(), gasPrice: uf_getGasPrice(1), gas : uf_getGasLimit(55000)}, 
           function(error, result){ 
            if(!error) uF_showHashResult(logID, result);
            else console.log("error: " + error);
        });
    }
} 



