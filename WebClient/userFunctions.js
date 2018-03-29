/*
Copyright (c) 2018 ZSC Dev Team
*/

var uF_parameters = [];
var uF_parameterValue = [];
var uF_eth_account;

var uF_controlApisAdvAbiLogin = [{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_hexx","type":"bytes32"}],"name":"getFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_pass","type":"bytes32"}],"name":"tryLogin","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}];

function uF_getFullAbi(user, hex, adr, func){
    var myContract = web3.eth.contract(uF_controlApisAdvAbiLogin);
    var myControlApi = myContract.at(adr);
    myControlApi.getFullAbi(user, pass, function(error, fullAbi) {
        if(!error) { 
            bf_configureClient(user, hex, adr, fullAbi)
            func(hexx);
        } else {
            console.log("error: " + error);
        }
    } );
}

function uF_login(user, pass, adr, func){
    var myContract = web3.eth.contract(uF_controlApisAdvAbiLogin);
    var myControlApi = myContract.at(adr);
    myControlApi.tryLogin(user, pass, function(error, hexx) {
        if(!error) {
            if (hexx == 0x0) func(hexx);
            else uF_getFullAbi(user, hex, adr, func);
        } else console.log("error: " + error);
    } );
}

function uF_keepOnline(user, hr, adr, func){
    var myControlApi = uf_getControlApi(adr);
    var ret;
    myControlApi.keepOnline(user, hr, function(error, ret) {
        if(!error) func(ret);
        else console.log("error: " + error);
    } );
}

function uF_doesNodeExist(node, func){
    var myControlApi = uf_getControlApi();
    myControlApi.doesElementExist(node,
        function(error, ret){ 
            if(!error) func(ret);  
            else  console.log("error: " + error);
        });
}

function uF_creatElement(nodeId, logID) {
    var myControlApi = uf_getControlApi();
    var nodeName = document.getElementById(nodeId).innerText;
    myControlApi.createElement(1, nodeName, nodeName, 
        {from: uf_getEthAccount(), gasPrice: uf_getGasPrice(), gas : uf_getGasLimit(55000)}, 
        function(error, result){ 
            if(!error) registerTransactionShow(logID, result);
            else console.log("error: " + error);
        });
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




