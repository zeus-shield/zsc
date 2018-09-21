
import Output from './output.js';
import Receipt from './receipt.js';

//private member
const addressRaw = Symbol('address');
const privateKeyRaw = Symbol('privateKey');

//private function
const etherSpentInPendingTransactions = Symbol('etherSpentInPendingTransactions');
const getNonce = Symbol('getNonce');

export default class DeployRaw {
    constructor() {
        let isMetaMask = web3.currentProvider.isMetaMask;
        this[addressRaw] = web3.eth.coinbase;
        if (isMetaMask) {
            //this[addressRaw] = "0xbaa43825f1bda3839c5f3038c65c504cb6d962c8";
            this[privateKeyRaw] = "0x5367874f5f72d3e7554e7df202a4f79e1f4ed591c3bc5a78993390f3becf313f";
        } else {
            //this[addressRaw] = "0x15ca13630ce52cd4e209012635f10b396e098296";
            this[privateKeyRaw] = "0x748443675b8cc68e225d4d7f266d2e57a7157e28b55b7cf66409f76a02bd49ca";
        }
    }

    [etherSpentInPendingTransactions](address, func) {

        let isMetaMask = web3.currentProvider.isMetaMask;

        if (isMetaMask) {
            func(null, "0");
        } else {
            web3.currentProvider.sendAsync({
                method: "txpool_content",
                params: [],
                jsonrpc: "2.0",
                id: new Date().getTime()
            }, function (error, result) {
                // result.error is defined for MetaMask
                if(!error && undefined == result.error) {
                    if(result.result.pending) {
                        if(result.result.pending[address]) {
                            let txns = result.result.pending[address];
                            let cost = new BigNumber(0);
                            
                            for(let txn in txns) {
                                cost = cost.add((new BigNumber(parseInt(txns[txn].value))).add((new BigNumber(parseInt(txns[txn].gas))).mul(new BigNumber(parseInt(txns[txn].gasPrice)))));
                            }
                            func(null, web3.fromWei(cost, "ether"));
                        } else {
                            func(null, "0");
                        }
                    } else {
                        func(null, "0");
                    }
                } else {
                    console.log(result.error);
                    Output(window.outputElement, 'small', 'red', result.error.message);
                    func(null, "0");
                }
            })
        }
    }

    [getNonce](address, func) {
        web3.eth.getTransactionCount(address, function(error, result) {
            let txnsCount = result;

            let isMetaMask = web3.currentProvider.isMetaMask;

            if (isMetaMask) {
                func(null, txnsCount);
            } else {
                web3.currentProvider.sendAsync({
                    method: "txpool_content",
                    params: [],
                    jsonrpc: "2.0",
                    id: new Date().getTime()
                }, function (error, result) {
                    // result.error is defined for MetaMask
                    if(!error && undefined == result.error) {
                        if(result.result.pending) {
                            if(result.result.pending[address]) {
                                txnsCount = txnsCount + Object.keys(result.result.pending[address]).length;
                                func(null, txnsCount);
                            } else {
                                func(null, txnsCount);
                            }
                        } else {
                            func(null, txnsCount);
                        }
                    } else {
                        console.log(result.error);
                        Output(window.outputElement, 'small', 'red', result.error.message);
                        func(null, "0");
                    }
                })
            }
        })
    }

    do(cmd, data, gasRequired, constractAddress, caller, func) {
        console.log('DeployRaw.do()');

        let handler = this;
        let address = this[addressRaw];
        let privateKey = this[privateKeyRaw];

        // get gas price
        // MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.getGasPrice(function(error, result) {
            if (!error) {
                let gasPrice = result;
                // get balance for total
                web3.eth.getBalance(address, function(error, result) {
                    if (!error) {
                        let balanceTotal = web3.fromWei(result, "ether");
                        console.log("balance(total):    ", balanceTotal.toString(10));
                        // get balance for pending
                        handler[etherSpentInPendingTransactions](address, function(error, result) {
                            if (!error) {
                                console.log("balance(pending):  ", result.toString(10));
                                // get balance for available
                                let balanceAvailable = balanceTotal.sub(result);
                                console.log("balance(available):", balanceAvailable.toString(10));
                                //if(balanceAvailable.gte(web3.fromWei(new BigNumber(web3.eth.gasPrice).mul(gasRequired), "ether")))
                                if (true)
                                {
                                    handler[getNonce](address, function(error, nonce) {
                                        if (!error) {
                                            let rawTx;
                                            if ("deploy" == cmd) {
                                                rawTx = {
                                                    gasPrice: web3.toHex(gasPrice),
                                                    gasLimit: web3.toHex(gasRequired),
                                                    from: address,
                                                    nonce: web3.toHex(nonce),
                                                    data: data
                                                };
                                            } else if ("transaction" == cmd) {
                                                rawTx = {
                                                    gasPrice: web3.toHex(gasPrice),
                                                    gasLimit: web3.toHex(gasRequired),
                                                    to: constractAddress,
                                                    nonce: web3.toHex(nonce),
                                                    data: data  
                                                };  
                                            } else {
                                                Output(window.outputElement, 'small', 'red', "Command Error!");
                                                return;
                                            }

                                            let key = EthereumjsUtil.toBuffer(privateKey, 'hex');
                                            let tx = new EthereumTx(rawTx);
                                            tx.sign(key);
                                            console.log("============================== sendRawTransaction ==============================");
                                            console.log("cmd:",        cmd);
                                            console.log("gasPrice:",   gasPrice.toString(10));
                                            console.log("gas:",        gasRequired);
                                            //alert(nonce);
                                            console.log("nonce:",      nonce);
                                            console.log("address:",    address);
                                            console.log("privateKey:", privateKey);
                                            //console.log("key:",                key);
                                            console.log("================================================================================");
                                            
                                            web3.eth.sendRawTransaction("0x" + tx.serialize().toString('hex'), function(err, result) {
                                                console.log("hash:", result);
                                                let receipt = new Receipt();
                                                if ("deploy" == cmd) {
                                                    receipt.getReceiptForContractAddress(result, 0, 1000, caller, func);
                                                } else if ("transaction" == cmd) {
                                                    receipt.getReceipt(result, 0, 1000, func);
                                                } else {
                                                    Output(window.outputElement, 'small', 'red', "Command Error!");
                                                    return;
                                                }
                                            });

                                        } else {
                                            Output(window.outputElement, 'small', 'red', error);
                                        }
                                    })
                                } else {
                                    Output(window.outputElement, 'small', 'red', "Insufficient Balance!");
                                }
                            } else {
                                Output(window.outputElement, 'small', 'red', error);
                            }
                        })
                    } else {
                        Output(window.outputElement, 'small', 'red', error);
                    }
                })
            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        });
    }
}