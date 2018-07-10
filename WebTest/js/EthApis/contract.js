/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Http from './http.js';

//private member
const http = Symbol('http');

export default class Contract {
    constructor() {
        this[http] = new Http();
    }

    getabi(address) {
        let url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    getsourcecode(address) {
        //let url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${address}`;

        let url = `https://api.etherscan.io/api?module=contract&action=getsourcecode&address=${address}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });        
    }
}