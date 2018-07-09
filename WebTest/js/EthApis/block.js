/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Block {
    constructor() {
        this[http] = new Http();
    }

    getblockreward(blockno) {
        let url = `https://api.etherscan.io/api?module=block&action=getblockreward&blockno=${blockno}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}