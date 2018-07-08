/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Output from './output.js';

//private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('address');
const account = Symbol('account');

export default class ZSCSearch {
    constructor(abi, address) {
        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[account] = web3.eth.accounts[0];
    }

    addParameter(_factoryType, _elementName, _elementAddress, _parameterName, _parameterValue) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        let gasUsed = contractInstance.addParameter.estimateGas(
            _factoryType, _elementName, _elementAddress, _parameterName, _parameterValue,
            function(error, result) {
                if(!error) {
                    //alert(result);
                    // add parameter
                    contractInstance.addParameter(
                        _factoryType, _elementName, _elementAddress, _parameterName, _parameterValue,
                        {gas: result},
                        function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                            } else {
                                Output(window.outputElement, 'small', 'red', error);
                            }
                        });
                } else {
                    Output(window.outputElement, 'small', 'red', error);
                }
            });
    }

    debug() {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        contractInstance.debugAll(function(error, result) {
            if(!error) {
                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                // get receipt
                let receipt = web3.eth.getTransactionReceipt(result, function(error, result) {
                    if(!error) {
                        console.log(result);
                        Output(window.outputElement, 'small', 'red', result);
                    } else {
                        Output(window.outputElement, 'small', 'red', error);
                    }
                });
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        })
    }
}