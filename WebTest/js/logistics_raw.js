/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
// import Output from './output.js';
import Transaction from './transaction_raw.js';

// private member
const account = Symbol('account');
const constractAbi = Symbol('constractAbi');
const constractAddress = Symbol('constractAddress');

export default class LogisticsRaw {
    constructor(_abi, _constractAddr) {
        this[account] = web3.eth.coinbase;
        this[constractAbi] = _abi;
        this[constractAddress] = _constractAddr; 
    }

    setup(account, key, _addr, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.setup.getData(_addr);

        contractInstance.setup.estimateGas(_addr, function(error, result) {
            if (!error) {
                let transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], _func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
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

    updateBriefEx(_account, _key, _num, _brief, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateBriefEx.getData(_num, _brief);

        contractInstance.updateBriefEx.estimateGas(_num, _brief, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], _func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
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

    updateEx(_account, _key, _num, _info, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateEx.getData(_num, _info);

        contractInstance.updateEx.estimateGas(_num, _info, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[constractAddress], _func);
                }
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
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

    invalid(account, key, _num, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.invalid.getData(_num);

        contractInstance.invalid.estimateGas(_num, function(error, result) {
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

    exist(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.exist.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("================ Logistics.exist(string) =================");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==========================================================");
                        // call 'Logistics.exist(string)'
                        contractInstance.exist.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Number]:${result}`);
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    number(_func) {
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
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    numberOfTracks(_num, _func) {
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
                        console.log("============ Logistics.numberOfTracks(string) =============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===========================================================");
                        // call 'Logistics.numberOfTracks(string)'
                        contractInstance.numberOfTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Number]:${result}`);
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    numberOfInvalid(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.numberOfInvalid.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== Logistics.numberOfInvalid(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===============================================================");
                        // call 'Logistics.numberOfInvalid(string)'
                        contractInstance.numberOfInvalid.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Number]:${result}`);
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getTracks(_num, _func) {
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
                        console.log("============= Logistics.getTracks(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("========================================================");
                        // call 'Logistics.getTracks(string)'
                        contractInstance.getTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Track]:${result}`);
                                console.log("[Tracks]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBrief(_num, _func) {
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
                        console.log("============= Logistics.getBrief(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================");
                        // call 'Logistics.getBrief(string)'
                        contractInstance.getBrief.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                // Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
                                console.log("[Brief]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBriefEx(_num, _func) {
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
                        console.log("============ Logistics.getBriefEx(string) =============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================");
                        // call 'Logistics.getBriefEx(string)'
                        contractInstance.getBriefEx.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Brief]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBriefByIndex(_index, _func) {
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
                                console.log("[Brief%s]: %s, %s, %s, %s, %s", 
                                    _index, result[0], result[1], result[2], result[3], result[4]);
                                if (null != _func) {
                                    _func(null, _index, result);
                                }                                
                            } else {
                                //Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _index);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error, _index);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error, _index);
                }
            }
        });
    }

    getBriefExByIndex(_index, _func) {
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
                                console.log("[Brief%s]: %s", _index, result);
                                if (null != _func) {
                                    _func(null, _index, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _index);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error, _index);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error, _index);
                }
            }
        });
    }

    getBriefInvalid(_num, _invalidIndex, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefInvalid.estimateGas(_num, _invalidIndex, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= Logistics.getBriefInvalid(string, uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("====================================================================");
                        // call 'Logistics.getBriefInvalid(string, uint)'
                        contractInstance.getBriefInvalid.call(_num, _invalidIndex, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[%s-%s]: %s, %s, %s, %s, %s", 
                                    _num, _invalidIndex, result[0], result[1], result[2], result[3], result[4]);
                                if (null != _func) {
                                    _func(null, _num, _invalidIndex, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _num, _invalidIndex);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error, _num, _invalidIndex);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error, _num, _invalidIndex);
                }
            }
        });
    }

    getTracksInvalid(_num, _invalidIndex, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getTracksInvalid.estimateGas(_num, _invalidIndex, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= Logistics.getTracksInvalid(string, uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=====================================================================");
                        // call 'Logistics.getTracksInvalid(string, uint)'
                        contractInstance.getTracksInvalid.call(_num, _invalidIndex, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[%s-%s]: %s", _num, _invalidIndex, result);
                                if (null != _func) {
                                    _func(null, _num, _invalidIndex, result);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _num, _invalidIndex);
                                }
                            }
                        });
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        if (null != _func) {
                            _func(error, _num, _invalidIndex);
                        }
                    }
                });
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                if (null != _func) {
                    _func(error, _num, _invalidIndex);
                }
            }
        });
    }
}