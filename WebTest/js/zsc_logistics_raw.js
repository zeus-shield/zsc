/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Receipt from './receipt.js';
import Output from './output.js';
import Deploy from './deploy_raw.js';

// private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('constractAddress');
const account = Symbol('account');

export default class ZSCLogistics {
    constructor(abi, address) {
        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[account] = web3.eth.coinbase;
    }

    updateTracks(_num, _tracks, _updateType, func) {
    }

    updateBrief(_num, _transNum, _model, _destinationCountry, _lastStatus, func) {
    }

    updateBriefEx(_brief, func) {
    }

    update(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.update.getData(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks);

        contractInstance.update.estimateGas(_num, _transNum, _model, _destinationCountry, _lastStatus, _tracks, {data: data}, function(error, result) {
            if (!error) {
                let deploy = new Deploy();
                if('undefined' != typeof deploy) {
                    deploy.do("transaction", data, result, handler[constractAddress], null, func);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    updateEx(_info, func) {
        let handler = this;
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
        let data = contractInstance.updateEx.getData(_info);

        contractInstance.updateEx.estimateGas(_info, function(error, result) {
            if (!error) {
                let deploy = new Deploy();
                if('undefined' != typeof deploy) {
                    deploy.do("transaction", data, result, handler[constractAddress], null, func);
                }
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }

    remove(_num) {
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
                        contractInstance.getTracks.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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
                        contractInstance.getBrief.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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
                        contractInstance.getBriefEx.call(_num, {from: handler[account], gas: gasRequired, gasPrice: result}, function(error, result) { 
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

    number() {
    }

    numberOfTracks(_num) {
    }
}