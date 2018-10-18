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