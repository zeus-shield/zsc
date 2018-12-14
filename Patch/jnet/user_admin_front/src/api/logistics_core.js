/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
import Transaction from './transaction_raw.js';
const Web3 = require('web3');
//private member
const account = Symbol('account');

const contractAbi = Symbol('contractAbi');
const contractAddress = Symbol('contractAddress');
const web3 = new Web3(new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/0a2f1fc6246240f0b1e12aec6f3d8ed7"));
window.web3 = web3;

export default class LogisticsCore {
    constructor(_abi, _contractAddr) {
        this[account] = "0x6A76fb522F948CfB7d6d929408D6aD5876E7139F";
        this[contractAbi] = _abi;
        this[contractAddress] = _contractAddr; 
    }
