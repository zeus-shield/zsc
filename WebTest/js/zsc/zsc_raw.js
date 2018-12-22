/*
 Copyright (c) 2018 ZSC Dev Team
*/

import Output from '../common/output.js';

//private member
const constractAbi = Symbol('abi');
const constractAddress = Symbol('constractAddress');
const addressRaw = Symbol('addressRaw');
const privateKeyRaw = Symbol('privateKeyRaw');

//private function
const getTransactionReceipt = Symbol('getTransactionReceipt');

export default class ZSCRaw {
    constructor(abi, address) {
        let isMetaMask = web3.currentProvider.isMetaMask;

        this[constractAbi] = abi;
        this[constractAddress] = address;
        this[addressRaw] = web3.eth.coinbase;
        if (isMetaMask) {
        } else {
        }
    }

    [getTransactionReceipt](handler, hash, timeout, caller, func) {
        let transactionHash = hash;
        let status  = "Try to get status again!";
        let string = "";

        if (undefined == hash) {
            string = `[TransactionHash]:${transactionHash}</br>[Status]:${status}`;
            Output(window.outputElement, 'small', 'red', string);
            return;
        }

        web3.eth.getTransactionReceipt(hash, function(error, receipt) {
            if (null != receipt) {
                if ("0x1" == receipt.status) {
                    status  = "succeeded";
                } else {
                    status  = "failure";
                }
                string = `[TransactionHash]:${transactionHash}</br>[Status]:${status}`;
                Output(window.outputElement, 'small', 'red', string);
                if (null != func) {
                    func(receipt.status);
                }
            } else {
                timeout ++;
                string = `[TransactionHash]:${transactionHash}</br>[Status]:${status}</br>[Timeout]:${timeout}(s)`;
                Output(window.outputElement, 'small', 'red', string);
                setTimeout(function() {
                    handler[getTransactionReceipt](handler, hash, timeout, null, func);
                }, 1000);
            }
        });
    }

    set(_index, _data) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);

        // estimate gas
        contractInstance.set.estimateGas(_index, _data, function(error, result) {
            if(!error) {
                // set
                contractInstance.set(_index, _data, {gas: result}, function(error, result) { 
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

    setRaw(_index, string, func) {
        let contractInstance = web3.eth.contract(this[constractAbi]).at(this[constractAddress]);
                   
        //let address = this[addressRaw];
        let key = this[privateKeyRaw];
        let handler = this;

        web3.eth.getTransactionCount(this[addressRaw], function(error, nonce) {

            //alert(nonce);

            // get function data
            let data = contractInstance.set.getData(_index, string);

            // estimate gas
            contractInstance.set.estimateGas(_index, string, {data: data},
                function(error, gasLimit) {
                    if(!error) {
                        // get gas price
                        web3.eth.getGasPrice(function(error, gasPrice){
                            if(!error) {
                                let rawTx = {
                                    gasPrice: web3.toHex(gasPrice),
                                    gasLimit: web3.toHex(gasLimit),
                                    to: handler[constractAddress],
                                    nonce: web3.toHex(nonce),
                                    data: data  
                                };

                                let privateKey = EthereumjsUtil.toBuffer(key, 'hex');
     
                                const tx = new EthereumTx(rawTx);

                                tx.sign(privateKey);

                                let serializedTx = tx.serialize();

                                web3.eth.sendRawTransaction("0x" + serializedTx.toString('hex'), function(err, hash) {
                                    console.log("hash:", hash);
                                    // get receipt
                                    handler[getTransactionReceipt](handler, hash, 0, handler, func);                                   
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