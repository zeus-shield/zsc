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

    eth_getBlockByNumber(tag) {
        let url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag=${tag}&boolean=true`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    eth_getUncleByBlockNumberAndIndex(tag, index) {
        let url = `https://api.etherscan.io/api?module=proxy&action=eth_getUncleByBlockNumberAndIndex&tag=${tag}&index=${index}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    eth_getBlockTransactionCountByNumber(tag) {
        let url = `https://api.etherscan.io/api?module=proxy&action=eth_getBlockTransactionCountByNumber&tag=${tag}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    eth_getTransactionByHash(txhash) {
        let url = `https://api.etherscan.io/api?module=proxy&action=eth_getTransactionByHash&txhash=${txhash}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

}