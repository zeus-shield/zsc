/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
import Transaction from './transaction_raw.js';

// private member
const account = Symbol('account');

const contractAbi = Symbol('contractAbi');
const contractAddress = Symbol('contractAddress');

export default class LogisticsCore {
    constructor(_abi, _contractAddr) {
        this[account] = web3.eth.coinbase;
        this[contractAbi] = _abi;
        this[contractAddress] = _contractAddr; 
    }

    setup(_account, _key, _databaseAddr, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.setup.getData(_databaseAddr);

        contractInstance.setup.estimateGas(_databaseAddr, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    updateTracks(_account, _key, _num, _tracks, _updateType, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.updateTracks.getData(_num, _tracks, _updateType);

        contractInstance.updateTracks.estimateGas(_num, _tracks, _updateType, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    updateBrief(_account, _key, _num, _transNum, _model, _destinationCountry, _lastStatus, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.updateBrief.getData(_num, _transNum, _model, _destinationCountry, _lastStatus);

        contractInstance.updateBrief.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    updateBriefEx(_account, _key, _num, _brief, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.updateBriefEx.getData(_num, _brief);

        contractInstance.updateBriefEx.estimateGas(_num, _brief, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    update(_account, _key, _num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.update.getData(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks);

        contractInstance.update.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, {from: _account}, function(error, result) {
        //contractInstance.update.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, {from: _account, data: data}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    updateEx(_account, _key, _num, _info, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.updateEx.getData(_num, _info);

        contractInstance.updateEx.estimateGas(_num, _info, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    remove(_account, _key, _num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.remove.getData(_num);

        contractInstance.remove.estimateGas(_num, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });       
    }

    invalid(_account, _key, _num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);
        let data = contractInstance.invalid.getData(_num);

        contractInstance.invalid.estimateGas(_num, {from: _account}, function(error, result) {
            if (!error) {
                let transaction = new Transaction(_account, _key);
                if('undefined' != typeof transaction) {
                    transaction.do("transaction", data, result, handler[contractAddress], _func);
                }
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });       
    }

    exist(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.exist.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("================ LogisticsCore.exist(string) =================");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==============================================================");
                        // call 'LogisticsCore.exist(string)'
                        contractInstance.exist.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    number(_func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.number.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("================= LogisticsCore.number() =================");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==========================================================");
                        // call 'LogisticsCore.number()'
                        contractInstance.number.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    numberOfTracks(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.numberOfTracks.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============ LogisticsCore.numberOfTracks(string) =============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===============================================================");
                        // call 'LogisticsCore.numberOfTracks(string)'
                        contractInstance.numberOfTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    numberOfInvalid(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.numberOfInvalid.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== LogisticsCore.numberOfInvalid(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===================================================================");
                        // call 'LogisticsCore.numberOfInvalid(string)'
                        contractInstance.numberOfInvalid.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Number]:", result.toString(10));
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getParcel(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getParcel.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getParcel(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("============================================================");
                        // call 'LogisticsCore.getParcel(string)'
                        contractInstance.getParcel.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Parcel]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getParcelEx(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getParcelEx.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getParcelEx(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("==============================================================");
                        // call 'LogisticsCore.getParcelEx(string)'
                        contractInstance.getParcelEx.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Parcel]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getTracks(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getTracks.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getTracks(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("============================================================");
                        // call 'LogisticsCore.getTracks(string)'
                        contractInstance.getTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Tracks]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getTrackElementByIndex(_num, _index, _tag, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getTrackElementByIndex.estimateGas(_num, _index, _tag, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("===== LogisticsCore.getTrackElementByIndex(string, uint, string) =====");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("======================================================================");
                        // call 'LogisticsCore.getTrackElementByIndex(string, uint, string)'
                        contractInstance.getTrackElementByIndex.call(_num, _index, _tag, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Element]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBrief(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBrief.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getBrief(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===========================================================");
                        // call 'LogisticsCore.getBrief(string)'
                        contractInstance.getBrief.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Brief]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBriefEx(_num, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefEx.estimateGas(_num, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============ LogisticsCore.getBriefEx(string) =============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===========================================================");
                        // call 'LogisticsCore.getBriefEx(string)'
                        contractInstance.getBriefEx.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Brief]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBriefByIndex(_index, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefByIndex.estimateGas(_index, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== LogisticsCore.getBriefByIndex(uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=================================================================");
                        // call 'LogisticsCore.getBriefByIndex(uint)'
                        contractInstance.getBriefByIndex.call(_index, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Brief%s]: %s, %s, %s, %s, %s", 
                                    _index, result[0], result[1], result[2], result[3], result[4]);
                                if (null != _func) {
                                    _func(null, _index, result);
                                }                                
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _index);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error, _index);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error, _index);
                }
            }
        });
    }

    getBriefExByIndex(_index, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefExByIndex.estimateGas(_index, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== LogisticsCore.getBriefExByIndex(uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("===================================================================");
                        // call 'LogisticsCore.getBriefExByIndex(uint)'
                        contractInstance.getBriefExByIndex.call(_index, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Brief%s]: %s", _index, result);
                                if (null != _func) {
                                    _func(null, _index, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _index);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error, _index);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error, _index);
                }
            }
        });
    }

    getBriefElement(_num, _tag, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefElement.estimateGas(_num, _tag, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=========== LogisticsCore.getBriefElement(string, string) ===========");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=====================================================================");
                        // call 'LogisticsCore.getBriefElement(string, string)'
                        contractInstance.getBriefElement.call(_num, _tag, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Element]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBriefElementByIndex(_index, _tag, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefElementByIndex.estimateGas(_index, _tag, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=========== LogisticsCore.getBriefElementByIndex(uint, string) ===========");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=====================================================================");
                        // call 'LogisticsCore.getBriefElementByIndex(uint, string)'
                        contractInstance.getBriefElementByIndex.call(_index, _tag, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[Element]:", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }

    getBriefInvalid(_num, _invalidIndex, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getBriefInvalid.estimateGas(_num, _invalidIndex, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getBriefInvalid(string, uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("========================================================================");
                        // call 'LogisticsCore.getBriefInvalid(string, uint)'
                        contractInstance.getBriefInvalid.call(_num, _invalidIndex, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[%s-%s]: %s, %s, %s, %s, %s", 
                                    _num, _invalidIndex, result[0], result[1], result[2], result[3], result[4]);
                                if (null != _func) {
                                    _func(null, _num, _invalidIndex, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _num, _invalidIndex);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error, _num, _invalidIndex);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error, _num, _invalidIndex);
                }
            }
        });
    }

    getTracksInvalid(_num, _invalidIndex, _func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getTracksInvalid.estimateGas(_num, _invalidIndex, {from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getTracksInvalid(string, uint) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=========================================================================");
                        // call 'LogisticsCore.getTracksInvalid(string, uint)'
                        contractInstance.getTracksInvalid.call(_num, _invalidIndex, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[%s-%s]: %s", _num, _invalidIndex, result);
                                if (null != _func) {
                                    _func(null, _num, _invalidIndex, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error, _num, _invalidIndex);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error, _num, _invalidIndex);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error, _num, _invalidIndex);
                }
            }
        });
    }

    getDatabaseAddr(_func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[contractAbi]).at(this[contractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.getDatabaseContractAddress.estimateGas({from: this[account]}, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============= LogisticsCore.getDatabaseContractAddress() ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result.toString(10));
                        console.log("=======================================================================");
                        // call 'LogisticsCore.getDatabaseContractAddress()'
                        contractInstance.getDatabaseContractAddress.call({from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                console.log("[DatabaseContractAddress]: %s", result);
                                if (null != _func) {
                                    _func(null, result);
                                }
                            } else {
                                console.log(error);
                                if (null != _func) {
                                    _func(error);
                                }
                            }
                        });
                    } else {
                        console.log(error);
                        if (null != _func) {
                            _func(error);
                        }
                    }
                });
            } else {
                console.log(error);
                if (null != _func) {
                    _func(error);
                }
            }
        });
    }
}