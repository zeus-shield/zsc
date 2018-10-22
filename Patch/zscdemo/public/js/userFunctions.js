/*
Copyright (c) 2018 ZSC Dev Team
*/

var uF_UserParameters = [];
var uF_UserParameterValues = [];
var uF_Entityparameters = [];
var uF_EntityparameterValues = [];

var uF_BindedEntities = [];

var uF_eth_account;


var uF_userName ;
var uF_userNameHr ;
var uF_controlApisAdr;

var uF_userEthBalance;
var uF_userNodeAddress;

var uF_controlApisAdvFullAbi;
var uF_controlApisAdvAbiLogin = [{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_hexx","type":"bytes32"}],"name":"getFullAbi","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_user","type":"bytes32"},{"name":"_pass","type":"bytes32"}],"name":"tryLogin","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"}];

function uF_getUsername() { return uF_userName; }

function uF_getUsernameHr() { return uF_userNameHr; }

function uF_getUserEthBalance() {  return uF_userEthBalance;}

function uF_getUserNodeAddress() { return uF_userNodeAddress;}

function uF_getControlApisAdr() { return uF_controlApisAdr;}

function uF_getControlApisAbi() { return JSON.parse(uF_controlApisAdvFullAbi);}


function uf_numParameters(type) { 
    if (type == "user") return uF_UserParameters.length;
    else return uF_BindedEntityparameters.length;
}

function uf_getParameterName(type, index) { 
    if (type == "user") return uF_UserParameters[index];
    else return uF_BindedEntityparameters[index];
}

function uf_getParameterValue(type, index) { 
    if (type == "user") return uF_UserParameterValues[index];
    else return uF_EntityparameterValues[index];
}

function uF_getFullAbi(user, hex, adr, func){
    var myContract = web3.eth.contract(uF_controlApisAdvAbiLogin);
    var myControlApi = myContract.at(adr);
    myControlApi.getFullAbi(user, hex, function(error, fullAbi) {
        if(!error) { 
            uF_controlApisAdvFullAbi = fullAbi;
            uF_userName = user;
            uF_userNameHr = hex;
            uF_controlApisAdr = adr;
            func(true);
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
            if (hexx == 0x0) func(false);
            else {
                uF_getFullAbi(user, hexx, adr, func);
            }
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

function uF_doesNodeExist(func){
    var node = uF_getUsername();
    var myContract = web3.eth.contract(uF_getControlApisAbi());
    var myControlApi = myContract.at(uF_getControlApisAdr());
    myControlApi.doesElementExist(node,
        function(error, ret){ 
            if(!error) func(ret);  
            else  console.log("error: " + error);
        });
}

function uF_creatElement(logID) {
    var node = uF_getUsername();
    var myContract = web3.eth.contract(uF_getControlApisAbi());
    var myControlApi = myContract.at(uF_getControlApisAdr());

    myControlApi.createElement(1, node,
        {from: uF_getEthAccount(), gasPrice: uf_getGasPrice(), gas : uf_getGasLimit(55000)}, 
        function(error, result){ 
            if(!error) uF_showHashResult(logID, result);
            else console.log("error: " + error);
        });
}  

function uF_setElementParameter(logID) {
    var node = uF_getUsername();
    var hr = uF_getUsernameHr();
    var myContract = web3.eth.contract(uF_getControlApisAbi());
    var myControlApi = myContract.at(uF_getControlApisAdr());

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
        myControlApi.setElementMultipleParameters(nodeName, hr, info,  
            {from: uF_getEthAccount(), gasPrice: uF_getGasPrice(1), gas : uf_getGasLimit(55000)}, 
            function(error, result){ 
                if(!error) uF_showHashResult(logID, result);
                else console.log("error: " + error);
        });
    }
} 

function uF_loadEthBalance() {
    var node = uF_getUsername();
    var myContract = web3.eth.contract(uF_getControlApisAbi());
    var myControlApi = myContract.at(uF_getControlApisAdr());

    myControlApi.getElementEthBalance(node, function(error, balance){ 
        if(!error) {
            uF_ethBalance = balance;  
            uf_getControlApi().getElementAddress(1, nodeName, function(error, address){ 
                if(!error) { uF_userNodeAddress = address; func(); }
                else console.log("error: " + error);
            });
        }
    });

}

///////////////////////////
function uF_loadElementParameters(func) {
    uF_numElementParameters(function(num) {
        uF_loadElementParameterNames(num, function(sum) {
            uF_loadElementParameterValues(sum, function(index){
                if (index == sum - 1) {
                    func();
                }
            });
        }); 
    });
}

function uF_numElementParameters(func){
    var node = uF_getUsername();
    var myContract = web3.eth.contract(uF_getControlApisAbi());
    var myControlApi = myContract.at(uF_getControlApisAdr());

    myControlApi.numElementParameters(node, {from: uF_getEthAccount()},
         function(error, num){ 
            if(!error) func(num.toString(10));  
            else console.log("error: " + error);
         });
}

function uF_loadElementParameterNames(num, func) {
    for (var i = 0; i < num; ++i) {
        uF_getElementParameterNameByIndex(node, i, function(index, para) {
            uF_parameters[index] = para;
            if (index == num - 1) {
                func(num);
            }
        });
    } 
} 