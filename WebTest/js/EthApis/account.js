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

    balance(address) {
        let url = `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    balancemulti(address[], num) {
        let addresses = '';
        let url = '';

        for(let i=0; i<num; i++) {
            if (0==i) {
                addresses = address[0];
            } else {
                addresses = `${addresses},${address[i]}`;
            }
        }

        url = `https://api.etherscan.io/api?module=account&action=balancemulti&address=${addresses}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    txlist(address, startblock, endblock) {
        url = `http://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    txlist(address, startblock, endblock, page, offset) {
        let url = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock${endblock}&page=${page}&offset=${offset}0&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    txlistinternal(address, startblock, endblock) {
        let url = `http://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    txlistinternal(address, startblock, endblock) {
        let url = `http://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }   

    txlistinternal(address, startblock, endblock, page, offset) {
        let url = `https://api.etherscan.io/api?module=account&action=txlistinternal&address=${address}&startblock=${startblock}&endblock=${endblock}&page=${page}&offset=${offset}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    tokentx(address, startblock, endblock) {
        let url = `http://api.etherscan.io/api?module=account&action=tokentx&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    tokentx(address, page, offset) {
        let url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${address}&page=${page}&offset=${offset}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    tokentx(contractaddress, address, page, offset) {
        let url = `https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=${contractaddress}&address=${address}&page=${page}&offset=${offset}&sort=asc`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    getminedblocks(address) {
        let url = `https://api.etherscan.io/api?module=account&action=getminedblocks&address=${address}&blocktype=blocks`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }

    getminedblocks(address, page, offset) {
        let url = `https://api.etherscan.io/api?module=account&action=getminedblocks&address=${address}&blocktype=blocks&page=${page}&offset=${offset}`;

        this[http].get(url, 10000, function(data) {
            console.log(data);
        });
    }
}