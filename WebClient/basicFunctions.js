/*
Copyright (c) 2018 ZSC Dev Team
*/

var bF_userName ;
var bF_userNameHr ;
var bF_controlApisAdr;
var bF_controlApisAbi;

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

function bf_configureClient(user, hr, adr, abi) {
    bF_userName = user;
    bF_userNameHr = hr;
    bF_controlApisAdr = adr;
    bF_controlApisAbi = abi;
}

function bF_getUsername() {    
    return uF_userName;
}

function bF_getUsernameHr() {    
    return uF_userNameHr;
}

function bF_getControlApisAdr() {    
    return bF_controlApisAdr;
}

function bF_getControlApisAbi() {    
    return bF_controlApisAbi;
}


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

