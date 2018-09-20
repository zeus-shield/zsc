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

    updateTracks(_num, _tracks, _updateType, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.updateTracks.estimateGas(_num, _tracks, _updateType, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("====== Logistics.updateTracks(bytes32, string, uint) ======");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("===========================================================");
                        // call 'Logistics.updateTracks(bytes32, string, uint)'
                        contractInstance.updateTracks(_num, _tracks, _updateType, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                let receipt = new Receipt();
                                receipt.getReceipt(result, 0, 1000, func);
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

    updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.updateBrief.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=== Logistics.updateBrief(bytes32, bytes32, bytes32, bytes32, bytes32, string) ===");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("==================================================================================");
                        // call 'Logistics.updateBrief(bytes32, bytes32, bytes32, bytes32, bytes32, string)'
                        contractInstance.updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                let receipt = new Receipt();
                                receipt.getReceipt(result, 0, 1000, func);
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

    updateBriefEx(_brief, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.updateBriefEx.estimateGas(_brief, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("====== Logistics.updateBriefEx(string) ======");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("======================================================");
                        // call 'Logistics.updateBriefEx(string)'
                        contractInstance.updateBriefEx(_brief, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                let receipt = new Receipt();
                                receipt.getReceipt(result, 0, 1000, func);
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

    update(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.update.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("=== Logistics.update(bytes32, bytes32, bytes32, bytes32, bytes32, string) ===");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("=============================================================================");
                        // call 'Logistics.update(bytes32, bytes32, bytes32, bytes32, bytes32, string)'
                        contractInstance.update(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                let receipt = new Receipt();
                                receipt.getReceipt(result, 0, 1000, func);
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

    updateEx(_info, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.updateEx.estimateGas(_info, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== Logistics.updateEx(string) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("========================================================");
                        // call 'Logistics.updateEx(string)'
                        contractInstance.updateEx(_info, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                let receipt = new Receipt();
                                receipt.getReceipt(result, 0, 1000, func);
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

    remove(_num) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        contractInstance.remove.estimateGas(_num, function(error, result) {
            if(!error) {
                let gasRequired = result;
                // get gas price
                // MetaMask Web3 object does not support synchronous methods without a callback parameter
                web3.eth.getGasPrice(function(error, result) {
                    if(!error) {
                        console.log("============== Logistics.remove(bytes32) ==============");
                        console.log("from:    ", handler[account]);
                        console.log("gas:     ", gasRequired);
                        console.log("gasPrice:", result);
                        console.log("=======================================================");
                        // call 'Logistics.remove(bytes32)'
                        contractInstance.remove(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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

    getTracks(_num) {
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
                        console.log("gasPrice:", result);
                        console.log("========================================================");
                        // call 'Logistics.getTracks(bytes32)'
                        contractInstance.getTracks(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[Track]:${result}`);
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
                        console.log("gasPrice:", result);
                        console.log("=======================================================");
                        // call 'Logistics.getBrief(bytes32)'
                        contractInstance.getBrief(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
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

    getBriefEx(_num) {
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
                        console.log("gasPrice:", result);
                        console.log("=======================================================");
                        // call 'Logistics.getBriefEx(bytes32)'
                        contractInstance.getBriefEx(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[Brief]:${result}`);
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
}