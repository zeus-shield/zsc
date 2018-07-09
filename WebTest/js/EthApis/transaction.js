/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Transaction {
    constructor() {
        this[http] = new Http();
    }

    getstatus(txhash) {
        let url = `https://api.etherscan.io/api?module=transaction&action=getstatus&txhash=${txhash}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}