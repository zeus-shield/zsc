/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Log {
    constructor() {
        this[http] = new Http();
    }

    getLogs(fromBlock, toBlock, address, topic0) {
        let url = `https://api.etherscan.io/api?module=logs&action=getLogs&fromBlock=${fromBlock}&toBlock=${toBlock}&address=${address}&topic0=${topic0}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}