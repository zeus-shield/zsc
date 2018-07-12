/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Token {
    constructor() {
        this[http] = new Http();
    }

    tokensupply(address) {
        let url = `https://api.etherscan.io/api?module=stats&action=tokensupply&contractaddress=${address}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    tokenbalance(contractaddress, address) {
        let url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${contractaddress}&address=${address}&tag=latest`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}