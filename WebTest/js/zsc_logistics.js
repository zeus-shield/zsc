/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
import Output from './output.js';

//private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('address');
const account = Symbol('account');

export default class ZSCLogistics {
    constructor(abi, address) {
        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[account] = web3.eth.accounts[0];
    }

    update(_info) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.update.estimateGas(_info, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=== Logistics.update(string) ==========================");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("=======================================================");
                        // call 'Logistics.update(string)'
                        contractInstance.update(_info, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                let receipt = new Receipt();
                                receipt.getReceipt(result, 0, 1000, null);
                            } else {
                                Output(window.outputElement, 'small', 'red', error);
                            }
                        });
                    } else {
                        Output(window.outputElement, 'small', 'red', error);
                    }
                });
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    getBrief(_num) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        contractInstance.getBrief(_num, function(error, result) {
            if(!error) {
                Output(window.outputElement, 'small', 'red', `[Logistics]: ${result}`);
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        })
    }
}