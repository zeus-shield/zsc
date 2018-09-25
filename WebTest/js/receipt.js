/*
 Copyright (c) 2018 ZSC Dev Team
*/

// import Output from './output.js';

class Result {
    constructor() {}
}

// private member
// private function

export default class Receipt {
    constructor() {}

    getReceipt(cmd, transactionHash, tryTimes, timeout, func) {
        let handler = this;
        let result = new Result();

        // check param
        if (("contractAddress" != cmd) && ("status" != cmd)) {
            let error = new Error();
            error.message = "Command Error!";
            console.log(error);
            func(error);
            return;
        }

        if (undefined == transactionHash) {
            let error = new Error();
            error.message = "TransactionHash Undefined!";
            console.log(error);
            func(error);
            return;
        }

        tryTimes ++;
        web3.eth.getTransactionReceipt(transactionHash, function(error, receipt) {
            if (null != receipt) {
                if (null != func) {
                    result.transactionHash = transactionHash;

                    if ("contractAddress" == cmd) {
                        result.contractAddress = receipt.contractAddress;
                    } 

                    if ("status" == cmd) {
                        result.status = receipt.status;
                    }
                    
                    result.tryTimes = tryTimes;
                    func(null, result);
                }
            } else {
                result.transactionHash = transactionHash;

                if ("contractAddress" == cmd) {
                    // result.contractAddress = "Try to get contract address again!";
                    result.contractAddress = "";
                } 

                if ("status" == cmd) {
                    // result.status = "Try to get status again!";
                    result.status = "";
                }

                result.tryTimes = tryTimes;
                func(null, result);
                setTimeout(function() {
                    handler.getReceipt(cmd, transactionHash, tryTimes, timeout, func);
                }, 1000);
            }
        });
    }
}