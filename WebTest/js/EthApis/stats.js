/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Stats {
    constructor() {
        this[http] = new Http();
    }

    ethsupply() {
        let url = `https://api.etherscan.io/api?module=stats&action=ethsupply`
        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    ethprice() {
        let url = `https://api.etherscan.io/api?module=stats&action=ethprice`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}