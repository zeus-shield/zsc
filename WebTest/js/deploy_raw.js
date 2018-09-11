
import Output from './output.js';

//private member
const addressRaw = Symbol('address');
const privateKeyRaw = Symbol('privateKey');
const etherSpentInPendingTransactions = Symbol('etherSpentInPendingTransactions');
const getNonce = Symbol('getNonce');

export default class DeployRaw {
    constructor() {
        this[addressRaw] = "0x15ca13630ce52cd4e209012635f10b396e098296";
        this[privateKeyRaw] = "0x748443675b8cc68e225d4d7f266d2e57a7157e28b55b7cf66409f76a02bd49ca";
    }

    [etherSpentInPendingTransactions](address, func) {
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

    [getNonce](address, callback) {
        web3.eth.getTransactionCount(address, function(error, result){
            var txnsCount = result;

            web3.currentProvider.sendAsync({
                method: "txpool_content",
                params: [],
                jsonrpc: "2.0",
                id: new Date().getTime()
            }, function (error, result) {
                if(result.result.pending)
                {
                    if(result.result.pending[address])
                    {
                        txnsCount = txnsCount + Object.keys(result.result.pending[address]).length;
                        callback(null, txnsCount);
                    }
                    else
                    {
                        callback(null, txnsCount);
                    }
                }
                else
                {
                    callback(null, txnsCount);
                }
            })
        })
    }

    getTransactionReceipt(handler, hash, caller, func) {
        let transactionHash = hash;
        let contractAddress = "Try to get contract address again!";
        web3.eth.getTransactionReceipt(hash, function(error, receipt) {
            let string = "";
            console.log("receipt:", receipt);
            if (null != receipt) {
                contractAddress = receipt.contractAddress;
                string = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;
                Output(window.outputElement, 'small', 'red', string);
                func(caller, contractAddress);
            } else {
                string = `[TransactionHash]:${transactionHash}</br>[ContractAddress]:${contractAddress}`;
                Output(window.outputElement, 'small', 'red', string);
                setTimeout(function() {
                    handler.getTransactionReceipt(handler, hash, caller, func);
                }, 1000);
            }
        });
    }

    do(byteCode, abi, parameter, caller, func) {
        console.log('DeployRaw.do()');

        let handler = this;
        let address = this[addressRaw];
        let privateKey = this[privateKeyRaw];

        let gasRequired = web3.eth.estimateGas({data: byteCode});

        web3.eth.getBalance(address, function(error, balance){
            var etherAvailable = web3.fromWei(balance, "ether");
            console.log("etherAvailable:", etherAvailable.toString(10));
            handler[etherSpentInPendingTransactions](address, function(error, balance) {
                console.log("balance(pending):", balance.toString(10));
                etherAvailable = etherAvailable.sub(balance);
                console.log("etherAvailable:", etherAvailable.toString(10));
                console.log("gasPrice:", web3.eth.gasPrice.toString(10));
                console.log("gasRequired:", gasRequired);
                //if(etherAvailable.gte(web3.fromWei(new BigNumber(web3.eth.gasPrice).mul(gasRequired), "ether")))
                if(true)
                {
                    handler[getNonce](address, function(error, nonce){
                        var rawTx = {
                            gasPrice: web3.toHex(web3.eth.gasPrice),
                            gasLimit: web3.toHex(gasRequired),
                            from: address,
                            nonce: web3.toHex(nonce),
                            //data: "0x" + data
                            data: byteCode
                        };

                        var key = EthereumjsUtil.toBuffer(privateKey, 'hex');
                        var tx = new EthereumTx(rawTx);
                        tx.sign(key);

                        console.log("nonce:", nonce);
                        console.log("address:", address);
                        console.log("privateKey:", privateKey);
                        console.log("key:", key);

                        web3.eth.sendRawTransaction("0x" + tx.serialize().toString('hex'), function(err, hash) {
                            console.log("hash:", hash);
                            handler.getTransactionReceipt(handler, hash, caller, func);
                        });
                    })
                }
                else
                {
                    res.send({error: "Insufficient Balance"});
                }
            })
        })
    }
}