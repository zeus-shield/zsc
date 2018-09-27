
// import Output from './output.js';
import Receipt from './receipt.js';

//private member
const account = Symbol('account');
const key = Symbol('key');

//private function
const etherSpentInPendingTransactions = Symbol('etherSpentInPendingTransactions');
const getNonce = Symbol('getNonce');

export default class TransactionRaw {
    constructor(address, privateKey) {
        this[account] = address;
        this[key] = privateKey;
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
                    // Output(window.outputElement, 'small', 'red', result.error.message);
                    console.log(result.error);
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
                        // Output(window.outputElement, 'small', 'red', result.error.message);
                        console.log(result.error);
                        func(null, "0");
                    }
                })
            }
        })
    }

    do(cmd, data, gasRequired, constractAddress, func) {
        console.log('TransactionRaw.do()');

        let handler = this;
        let address = this[account];
        let privateKey = this[key];

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
                                                // Output(window.outputElement, 'small', 'red', "Command Error!");
                                                let error = new Error();
                                                error.message = "Command Error!";
                                                console.log(error);
                                                func(error);
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
                                                if (undefined != result) {
                                                    let receipt = new Receipt();
                                                    if ("deploy" == cmd) {
                                                        receipt.getReceipt("contractAddress", result, 0, 1000, func);
                                                    } else if ("transaction" == cmd) {
                                                        receipt.getReceipt("status", result, 0, 1000, func);
                                                    } else {
                                                        // Output(window.outputElement, 'small', 'red', "Command Error!");
                                                        let error = new Error();
                                                        error.message = "Command Error!";
                                                        console.log(error);
                                                        func(error);
                                                    }
                                                } else {
                                                    let error = new Error();
                                                    error.message = "TransactionHash Undefined!";
                                                    console.log(error);
                                                    func(error);
                                                }
                                            });
                                        } else {
                                            // Output(window.outputElement, 'small', 'red', error);
                                            console.log(error);
                                            func(error);
                                        }
                                    })
                                } else {
                                    // Output(window.outputElement, 'small', 'red', "Insufficient Balance!");
                                    let error = new Error();
                                    error.message = "Insufficient Balance!";
                                    console.log(error);
                                    func(error);
                                }
                            } else {
                                // Output(window.outputElement, 'small', 'red', error);
                                console.log(error);
                                func(error);
                            }
                        })
                    } else {
                        // Output(window.outputElement, 'small', 'red', error);
                        console.log(error);
                        func(error);
                    }
                })
            } else {
                // Output(window.outputElement, 'small', 'red', error);
                console.log(error);
                func(error);
            }
        });
    }
}