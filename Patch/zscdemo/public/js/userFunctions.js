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


