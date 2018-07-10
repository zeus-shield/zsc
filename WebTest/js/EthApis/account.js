/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Account {
    constructor() {
        this[http] = new Http();
    }

    tockentx(address) {
        let url = `http://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=999999999&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    balance(address) {
        let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}