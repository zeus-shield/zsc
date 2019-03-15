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

export default class InsuranceUserPolicy {
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

    setup(account, privateKey, companyAddr, templateAddr, userAddr, policyAddr, integralAddr, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.setup.estimateGas(companyAddr, templateAddr, userAddr, policyAddr, integralAddr, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.setup.getData(companyAddr, templateAddr, userAddr, policyAddr, integralAddr), error, gasRequired, func);
        });
    }

    companyUpdate(account, privateKey, key, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.companyUpdate.estimateGas(key, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.companyUpdate.getData(key, data), error, gasRequired, func);
        });
    }

    companyRemove(account, privateKey, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.companyRemove.estimateGas(key, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.companyRemove.getData(key), error, gasRequired, func);
        });
    }

    companySize(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.companySize.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.companySize() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================");
                        // call 'Insurance.companySize()'
                        contractInstance.companySize.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[CompanySize]: %s", result.toString(10));
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

    companyGetByKey(key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.companyGetByKey.estimateGas(key, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.companyGetByKey(string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=================================================================");
                        // call 'Insurance.companyGetByKey(string)'
                        contractInstance.companyGetByKey.call(key, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Company]: %s", result.toString(10));
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

    companyGetById(id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.companyGetById.estimateGas(id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.companyGetById(uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==============================================================");
                        // call 'Insurance.companyGetById(uint)'
                        contractInstance.companyGetById.call(id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Company%s]: %s", id, result.toString(10));
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

    companyGetAll(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.companyGetAll.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.companyGetAll() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=========================================================");
                        // call 'Insurance.companyGetAll()'
                        contractInstance.companyGetAll.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Company]: %s", result.toString(10));
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

    templateUpdate(account, privateKey, key, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.templateUpdate.estimateGas(key, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.templateUpdate.getData(key, data), error, gasRequired, func);
        });
    }

    templateRemove(account, privateKey, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.templateRemove.estimateGas(key, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.templateRemove.getData(key), error, gasRequired, func);
        });
    }

    templateSize(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.templateSize.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.templateSize() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("========================================================");
                        // call 'Insurance.templateSize()'
                        contractInstance.templateSize.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[TemplateSize]: %s", result.toString(10));
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

    templateGetByKey(key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.templateGetByKey.estimateGas(key, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.templateGetByKey(string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==================================================================");
                        // call 'Insurance.templateGetByKey(string)'
                        contractInstance.templateGetByKey.call(key, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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

    templateGetById(id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.templateGetById.estimateGas(id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.templateGetById(uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===============================================================");
                        // call 'Insurance.templateGetById(uint)'
                        contractInstance.templateGetById.call(id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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

    userAdd(account, privateKey, userKey, templateKey, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.userAdd.estimateGas(userKey, templateKey, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.userAdd.getData(userKey, templateKey, data), error, gasRequired, func);
        });
    }

    userRemove(account, privateKey, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.userRemove.estimateGas(key, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.userRemove.getData(key), error, gasRequired, func);
        });
    }

    userCheckIn(account, privateKey, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.userCheckIn.estimateGas(key, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.userCheckIn.getData(key), error, gasRequired, func);
        });
    }

    userSize(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.userSize.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.userSize() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("====================================================");
                        // call 'Insurance.userSize()'
                        contractInstance.userSize.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[UserSize]: %s", result.toString(10));
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

    userExist(key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.userExist.estimateGas(0, key, 0, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.userExist(uint8, string, address) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===========================================================================");
                        // call 'Insurance.userExist(uint8, string, address)'
                        contractInstance.userExist.call(0, key, 0, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[UserExist]: %s", result.toString(10));
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

    userGetByKey(type, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.userGetByKey.estimateGas(type, key, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.userGetByKey(uint8, string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=====================================================================");
                        // call 'Insurance.userGetByKey(uint8, string)'
                        contractInstance.userGetByKey.call(type, key, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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

    userGetById(type, id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.userGetById.estimateGas(type, id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.userGetById(uint8, uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==================================================================");
                        // call 'Insurance.userGetById(uint8, uint)'
                        contractInstance.userGetById.call(type, id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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

    userGetPolicies(userKey, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.userGetPolicies.estimateGas(userKey, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.userGetPolicies(string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=================================================================");
                        // call 'Insurance.userGetPolicies(string)'
                        contractInstance.userGetPolicies.call(userKey, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[UserPolicies]: %s", result.toString(10));
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

    policyAdd(account, privateKey, userKey, templateKey, policyKey, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.policyAdd.estimateGas(userKey, templateKey, policyKey, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.policyAdd.getData(userKey, templateKey, policyKey, data), error, gasRequired, func);
        });
    }

    policyAddElement(account, privateKey, key, elementKey, data, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.policyAddElement.estimateGas(key, elementKey, data, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.policyAddElement.getData(key, elementKey, data), error, gasRequired, func);
        });
    }

    policyRemove(account, privateKey, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.policyRemove.estimateGas(key, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.policyRemove.getData(key), error, gasRequired, func);
        });
    }

    policySize(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.policySize.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.policySize() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("======================================================");
                        // call 'Insurance.policySize()'
                        contractInstance.policySize.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[PolicySize]: %s", result.toString(10));
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

    policyGetByKey(type, key, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.policyGetByKey.estimateGas(type, key, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.policyGetByKey(uint8, string) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================================");
                        // call 'Insurance.policyGetByKey(uint8, string)'
                        contractInstance.policyGetByKey.call(type, key, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Policy]: %s", result);
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

    policyGetById(type, id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.policyGetById.estimateGas(type, id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.policyGetById(uint8, uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("====================================================================");
                        // call 'Insurance.policyGetById(uint8, uint)'
                        contractInstance.policyGetById.call(type, id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Policy%s]: %s", id, result.toString(10));
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

    policyGetKeys(id, count, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.policyGetKeys.estimateGas(id, count, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.policyGetKeys(uint, uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===================================================================");
                        // call 'Insurance.policyGetKeys(uint, uint)'
                        contractInstance.policyGetKeys.call(id, count, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Keys]: %s", result.toString(10));
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

    integralClaim(account, privateKey, type, owner, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.integralClaim.estimateGas(type, owner, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.integralClaim.getData(type, owner), error, gasRequired, func);
        });
    }

    integralMint(account, privateKey, owner, value, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.integralMint.estimateGas(owner, value, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.integralMint.getData(owner, value), error, gasRequired, func);
        });
    }

    integralBurn(account, privateKey, owner, value, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.integralBurn.estimateGas(owner, value, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.integralBurn.getData(owner, value), error, gasRequired, func);
        });
    }

    integralTransfer(account, privateKey, owner, to, value, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        contractInstance.integralTransfer.estimateGas(owner, to, value, {from: account}, function(error, gasRequired) {
            handler[transactionProc](handler, account, privateKey, contractInstance.integralTransfer.getData(owner, to, value), error, gasRequired, func);
        });
    }

    integral(owner, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.integral.estimateGas(owner, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.integral(address) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===========================================================");
                        // call 'Insurance.integral(address)'
                        contractInstance.integral.call(owner, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Integral] %s: %s", owner, result.toString(10));
                                if (null != func) {
                                    func(null, owner, result);
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

    integralTraceSize(owner, type, time, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.integralTraceSize.estimateGas(owner, type, time, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.integralTraceSize(address, uint8, uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=================================================================================");
                        // call 'Insurance.integralTraceSize(address, uint8, uint)'
                        contractInstance.integralTraceSize.call(owner, type, time, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[TraceSize] %s", result.toString(10));
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

    integralTrace(owner, type, time, id, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.integralTrace.estimateGas(owner, type, time, id, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=============== Insurance.integralTrace(address, uint8, uint, uint) ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===================================================================================");
                        // call 'Insurance.integralTrace(address, uint8, uint, uint)'
                        contractInstance.integralTrace.call(owner, type, time, id, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Trace] owner(%s), type(%s), time(%s), id(%s), result(%s)", owner, type, time, id, result.toString(10));
                                if (null != func) {
                                    func(null, owner, type, time, id, result);
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
                        console.log("=============== InsuranceUserPolicy.getAddr() ===============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=============================================================");
                        // call 'InsuranceUserPolicy.getAddr()'
                        contractInstance.getAddr.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Address]: company(%s), template(%s), user(%s), policy(%s), integral(%s)", result[0], result[1], result[2], result[3], result[4]);
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