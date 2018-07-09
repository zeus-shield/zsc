/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Proxy {
    constructor() {
        this[http] = new Http();
    }

    eth_blockNumber() {
        let url = `https://api.etherscan.io/api?module=proxy&action=eth_blockNumber`

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}