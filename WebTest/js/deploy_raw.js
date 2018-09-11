
import Output from './output.js';

//private member
const addressRaw = Symbol('address');
const privateKeyRaw = Symbol('privateKey');
const etherSpentInPendingTransactions = Symbol('etherSpentInPendingTransactions');
const getNonce = Symbol('getNonce');

export default class DeployRaw {
    constructor() {
        let isMetaMask = web3.currentProvider.isMetaMask;
        if (isMetaMask) {
            this[addressRaw] = "0xbaa43825f1bda3839c5f3038c65c504cb6d962c8";
            this[privateKeyRaw] = "0x5367874f5f72d3e7554e7df202a4f79e1f4ed591c3bc5a78993390f3becf313f";
        } else {
            this[addressRaw] = "0x15ca13630ce52cd4e209012635f10b396e098296";
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
                })
            }
        })
    }

    getTransactionReceipt(handler, hash, timeout, caller, func) {
        let transactionHash = hash;
        let contractAddress = "Try to get contract address again!";
        let string = "";

        if (undefined == hash) {
            contractAddress = "";
            string = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;
            Output(window.outputElement, 'small', 'red', string);
            return;
        }

        web3.eth.getTransactionReceipt(hash, function(error, receipt) {
            if (null != receipt) {
                contractAddress = receipt.contractAddress;
                string = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;
                Output(window.outputElement, 'small', 'red', string);
                func(caller, contractAddress);
            } else {
                timeout ++;
                string = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}</br>[Timeout]:${timeout}(s)`;
                Output(window.outputElement, 'small', 'red', string);
                setTimeout(function() {
                    handler.getTransactionReceipt(handler, hash, timeout, caller, func);
                }, 1000);
            }
        });
    }

    do(byteCode, abi, parameter, caller, func) {
        console.log('DeployRaw.do()');

        let handler = this;
        let address = this[addressRaw];
        let privateKey = this[privateKeyRaw];

        // get gas price
        web3.eth.getGasPrice(function(error, result) {
            if (!error) {
                let gasPrice = result;

                // estimate gas
                web3.eth.estimateGas({data: byteCode}, function(error, result) {
                    if (!error) {
                        let gasRequired = result;
                        // get balance for total
                        web3.eth.getBalance(address, function(error, balance) {
                            if (!error) {
                                let etherAvailable = web3.fromWei(balance, "ether");
                                console.log("balance(total):", etherAvailable.toString(10));
                                // get balance for pending
                                handler[etherSpentInPendingTransactions](address, function(error, balance) {
                                    console.log("balance(pending):", balance.toString(10));
                                    // get balance for available
                                    etherAvailable = etherAvailable.sub(balance);
                                    console.log("balance(available):", etherAvailable.toString(10));
                                    console.log("gasPrice:", gasPrice.toString(10));
                                    console.log("gasRequired:", gasRequired);
                                    //if(etherAvailable.gte(web3.fromWei(new BigNumber(web3.eth.gasPrice).mul(gasRequired), "ether")))
                                    if(true)
                                    {
                                        handler[getNonce](address, function(error, nonce) {
                                            let rawTx = {
                                                gasPrice: web3.toHex(gasPrice),
                                                gasLimit: web3.toHex(gasRequired),
                                                from: address,
                                                nonce: web3.toHex(nonce),
                                                //data: "0x" + data
                                                data: byteCode
                                            };

                                            let key = EthereumjsUtil.toBuffer(privateKey, 'hex');
                                            let tx = new EthereumTx(rawTx);
                                            tx.sign(key);

                                            alert(nonce);
                                            console.log("nonce:", nonce);
                                            console.log("address:", address);
                                            console.log("privateKey:", privateKey);
                                            console.log("key:", key);

                                            web3.eth.sendRawTransaction("0x" + tx.serialize().toString('hex'), function(err, hash) {
                                                console.log("hash:", hash);
                                                handler.getTransactionReceipt(handler, hash, 0, caller, func);
                                            });
                                        })
                                    } else {
                                        Output(window.outputElement, 'small', 'red', "Insufficient Balance!");
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

            } else {
                Output(window.outputElement, 'small', 'red', error);
            }
        })
    }
}