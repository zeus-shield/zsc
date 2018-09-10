/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Output from './output.js';

//private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('address');
const account = Symbol('account');
const rawAddress = Symbol('rawAddress');
const privateKey = Symbol('privateKey');

export default class ZSCRaw {
    constructor(abi, address) {
        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[account] = web3.eth.accounts[0];
        this[rawAddress] = "0x15ca13630ce52cd4e209012635f10b396e098296";
        this[privateKey] = "0x748443675b8cc68e225d4d7f266d2e57a7157e28b55b7cf66409f76a02bd49ca";
    }

    set(_index, _data) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        contractInstance.set.estimateGas(_index, _data,
            function(error, result) {
                if(!error) {
                    //alert(result);
                    // set
                    contractInstance.set(_index, _data, {gas: result},
                        function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[TransactionHash]:${result}`);
                                // get receipt
                                let receipt = web3.eth.getTransactionReceipt(result, function(error, result) {
                                    if(!error) {
                                        // console.log(result);
                                        // Output(window.outputElement, 'small', 'red', result);
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

    setRaw(_index, _data) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
                   
        let address = this[rawAddress];
        let key = this[privateKey];

        web3.eth.getTransactionCount(this[rawAddress], function(error, nonce) {
            // get function data
            let data = contractInstance.set.getData(_index, _data);

            // estimate gas
            contractInstance.set.estimateGas(_index, _data, {data: data},
                function(error, gasLimit) {
                    if(!error) {
                        // get gas price
                        web3.eth.getGasPrice(function(error, gasPrice){
                            if(!error) {
                                let rawTx = {
                                    gasPrice: web3.toHex(gasPrice),
                                    gasLimit: web3.toHex(gasLimit),
                                    from: address,
                                    nonce: web3.toHex(nonce),
                                    data: data  
                                };

                                let privateKey = EthereumjsUtil.toBuffer(key, 'hex');
                                // let privateKey = key;

                                const tx = new EthereumTx(rawTx);

                                tx.sign(privateKey);

                                let serializedTx = tx.serialize();

                                web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, hash) {
                                    console.log("hash:", hash);
                                    Output(window.outputElement, 'small', 'red', `[TransactionHash]:${hash}`);
                                });
                            } else {
                                Output(window.outputElement, 'small', 'red', error);
                            }
                        });
                    } else {
                        Output(window.outputElement, 'small', 'red', error);
                    }
                });
        });
    }

    get(_index) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        contractInstance.get.estimateGas(_index,
            function(error, result) {
                if(!error) {
                    //alert(result);
                    // set
                    contractInstance.get(_index, {gas: result},
                        function(error, result) { 
                            if(!error) {
                                Output(window.outputElement, 'small', 'red', `[Data]:${result}`);
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