/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

import Receipt from '../common/receipt.js';
import Transaction from '../common/transaction_raw.js';

// private member
const account = Symbol('account');
const contractAbi = Symbol('contractAbi');
const contractAddress = Symbol('contractAddress');

//private function
const transactionProc = Symbol('transactionProc');
const notifyError = Symbol('notifyError');

export default class InsuranceCompany {
    constructor(abi, contractAddr) {
        this[account] = web3.eth.coinbase;
        this[contractAbi] = abi;
        this[contractAddress] = contractAddr; 
    }

    [notifyError](error, func) {
        console.log(error);
        if (null != func) {
            func(error);
        }
    }

    [transactionProc](handler, account, privateKey, data, error, gasRequired, func) {
        if (!error) {
            let transaction = new Transaction(account, privateKey);
            if('undefined' != typeof transaction) {
                transaction.do("transaction", data, gasRequired, handler[contractAddress], func);
            }
        } else {
            handler[notifyError](error, func);
        }
    }

    update(account, privateKey, key, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.update.estimateGas(key, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.update.getData(key, data), error, gasRequired, func);
        });
    }

    remove(account, privateKey, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.remove.estimateGas(key, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.remove.getData(key), error, gasRequired, func);
        });
    }

    size(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.size.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== InsuranceCompany.size() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================");
                        // call 'InsuranceCompany.size()'
                        contractInstance.size.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Size]: %s", result.toString(10));
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                handler[notifyError](error, func);
                            }
                        });
                    } else {
                        handler[notifyError](error, func);
                    }
                });
            } else {
                handler[notifyError](error, func);
            }
        });
    }

    getById(id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getById.estimateGas(id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== InsuranceCompany.getById(uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==============================================================");
                        // call 'InsuranceCompany.getById(uint)'
                        contractInstance.getById.call(id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Template%s]: %s", id, result.toString(10));
                                if (null != func) {
                                    func(null, id, result);
                                }
                            } else {
                                handler[notifyError](error, func);
                            }
                        });
                    } else {
                        handler[notifyError](error, func);
                    }
                });
            } else {
                handler[notifyError](error, func);
            }
        });
    }

    getByKey(key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getByKey.estimateGas(key, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== InsuranceCompany.getByKey(string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=================================================================");
                        // call 'InsuranceCompany.getByKey(string)'
                        contractInstance.getByKey.call(key, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Template]: %s", result.toString(10));
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                handler[notifyError](error, func);
                            }
                        });
                    } else {
                        handler[notifyError](error, func);
                    }
                });
            } else {
                handler[notifyError](error, func);
            }
        });
    }
}