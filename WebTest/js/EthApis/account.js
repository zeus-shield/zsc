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

        //url = 'https://api.etherscan.io/api?module=contract&action=getabi&address=0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413&apikey=YourApiKeyToken';

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}