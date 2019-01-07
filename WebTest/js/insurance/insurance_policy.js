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

export default class InsurancePolicy {
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

    destroy(account, privateKey, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.destroy.estimateGas({from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.destroy.getData(), error, gasRequired, func);
        });
    }

    setup(account, privateKey, templateAddr, userAddr, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.setup.estimateGas(templateAddr, userAddr, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.setup.getData(templateAddr, userAddr), error, gasRequired, func);
        });
    }

    submit(account, privateKey, userKey, templateKey, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.submit.estimateGas(userKey, templateKey, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.submit.getData(userKey, templateKey, data), error, gasRequired, func);
        });
    }

    remove(account, privateKey, key, _removeUserPolicy, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.remove.estimateGas(key, _removeUserPolicy, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.remove.getData(key, _removeUserPolicy), error, gasRequired, func);
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
                        console.log("=============== InsurancePolicy.size() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("======================================================");
                        // call 'InsurancePolicy.size()'
                        contractInstance.size.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[User]: %s", result.toString(10));
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

    getByKey(type, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getByKey.estimateGas(type, key, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== InsurancePolicy.getByKey(uint8, string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================================");
                        // call 'InsurancePolicy.getByKey(uint8, string)'
                        contractInstance.getByKey.call(type, key, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[User]: %s", result);
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

    getById(type, id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getById.estimateGas(type, id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== InsurancePolicy.getById(uint8, uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("====================================================================");
                        // call 'InsurancePolicy.getById(uint8, uint)'
                        contractInstance.getById.call(type, id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[User%s]: %s", id, result.toString(10));
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

    getAddr(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getAddr.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== InsurancePolicy.getAddr() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=========================================================");
                        // call 'InsurancePolicy.getAddr()'
                        contractInstance.getAddr.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Address]: template(%s), user(%s)", result[0], result[1]);
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