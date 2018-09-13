/*
 Copyright (c) 2018 ZSC Dev Team
*/

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

    setBrief(_num, _transNum, _model, _destinationCountry, _lastStatus) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        let gasUsed = contractInstance.setBrief.estimateGas(
            _num, _transNum, _model, _destinationCountry, _lastStatus,
            function(error, result) {
                if(!error) {
                    //alert(result);
                    // add parameter
                    contractInstance.setBrief(
                        _num, _transNum, _model, _destinationCountry, _lastStatus,
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