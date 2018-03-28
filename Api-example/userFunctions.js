
var uF_parameters = [];
var uF_parameterValue = [];
var uF_eth_account;
var uF_controlApisAdvAdr = "";
var uF_controlApisAdvAbi = "";

function uf_getEthAccount() {
    //console.log(web3.eth.accounts[0])
    var account = web3.eth.accounts[0];
    //if (account == undefined) alert("Need to login in MetaMask!!");
    return account;
}

function uf_getGasLimit(limit) {
    return limit * 100;
}

function uf_getControlApi(controlApiAdr) {
    var myContract = web3.eth.contract(uF_controlApisAdvAbi);
    return myContract.at(uF_controlApisAdvAdr);
}



