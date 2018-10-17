/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
// import Output from './output.js';
import Transaction from './transaction_raw.js';

// private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('constractAddress');
const account = Symbol('account');

export default class LogisticsRaw {
    constructor(abi, address) {
        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[account] = web3.eth.coinbase;
    }

    setTrackContractAdress(account, key, _address, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.setTrackContractAdress.getData(_address);

        contractInstance.setTrackContractAdress.estimateGas(_address, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    updateTracks(account, key, _num, _tracks, _updateType, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateTracks.getData(_num, _tracks, _updateType);

        contractInstance.updateTracks.estimateGas(_num, _tracks, _updateType, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    updateBrief(account, key, _num, _transNum, _model, _destinationCountry, _lastStatus, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateBrief.getData(_num, _transNum, _model, _destinationCountry, _lastStatus);

        contractInstance.updateBrief.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    updateBriefEx(account, key, _brief, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateBriefEx.getData(_brief);

        contractInstance.updateBriefEx.estimateGas(_brief, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    update(account, key, _num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.update.getData(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks);

        contractInstance.update.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, {data: data}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    updateEx(account, key, _info, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateEx.getData(_info);

        contractInstance.updateEx.estimateGas(_info, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    remove(account, key, _num, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.remove.getData(_num);

        contractInstance.remove.estimateGas(_num, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });       
    }

    getTracks(_num, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getTracks.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= Logistics.getTracks(bytes32) =============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("========================================================");
                        // call 'Logistics.getTracks(bytes32)'
                        contractInstance.getTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Track]:${result}`);
                                console.log("[Tracks]:", result);
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    getBrief(_num, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBrief.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= Logistics.getBrief(bytes32) =============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================");
                        // call 'Logistics.getBrief(bytes32)'
                        contractInstance.getBrief.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
                                console.log("[Brief]:", result);
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    getBriefEx(_num, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefEx.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============ Logistics.getBriefEx(bytes32) ============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================");
                        // call 'Logistics.getBriefEx(bytes32)'
                        contractInstance.getBriefEx.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
                                console.log("[Brief]:", result);
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    getBriefByIndex(_index, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefByIndex.estimateGas(_index, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== Logistics.getBriefByIndex(uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=============================================================");
                        // call 'Logistics.getBriefByIndex(uint)'
                        contractInstance.getBriefByIndex.call(_index, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
                                console.log("[Brief]:", result);
                                if (null != func) {
                                    func(null, result);
                                }                                
                            } else {
                                //Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    getBriefExByIndex(_index, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefExByIndex.estimateGas(_index, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== Logistics.getBriefExByIndex(uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===============================================================");
                        // call 'Logistics.getBriefExByIndex(uint)'
                        contractInstance.getBriefExByIndex.call(_index, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
                                console.log("[Brief]:", result);
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    number(func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.number.estimateGas(function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("================= Logistics.number() =================");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("======================================================");
                        // call 'Logistics.number()'
                        contractInstance.number.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Number]:${result}`);
                                console.log("[Number]:", result.toString(10));
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }

    numberOfTracks(_num, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.numberOfTracks.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============ Logistics.numberOfTracks(bytes32) ============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===========================================================");
                        // call 'Logistics.numberOfTracks(bytes32)'
                        contractInstance.numberOfTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Number]:${result}`);
                                console.log("[Number]:", result);
                                if (null != func) {
                                    func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != func) {
                                    func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != func) {
                            func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != func) {
                    func(error);
                }
            }
        });
    }
}