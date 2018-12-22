/*
 Copyright (c) 2018 ZSC Dev Team
*/

// import Output from './output.js';
const _hexToString = Symbol('_hexToString');
const _debugLogs = Symbol('debugLogs');

class Result {
    constructor() {}
}

// private member
// private function

export default class Receipt {
    constructor() {}

    [_hexToString](str) {
        let value = "";
        let byte = "";
        let code = "";

        str = str.substr(str.indexOf("0x")+2);

        for(let i=0; i<str.length/2; i++) {
            byte = str.substring(i*2, i*2+2);
            code = parseInt(byte, 16);
            if ("0" == code) {
                break;
            }
            value += String.fromCharCode(code);
        }

        return value;
  }

    [_debugLogs](handler, logs) {
        let i = 0;
        let j = 0;
        for (i=0; i<logs.length; i++) {
            console.log("==================================== logs%d ====================================", i);
            console.log("data(hex):  %s", logs[i].data);
            console.log("data(uint): %s", parseInt(logs[i].data));
            // console.log("data(str):  %s", handler[_hexToString](logs[i].data));
            for (j=0; j<logs[i].topics.length; j++) {
                console.log("topics[%d](hex):  %s", j, logs[i].topics[j]);
                console.log("topics[%d](uint): %s", j, parseInt(logs[i].topics[j]));
                // console.log("topics[%d](str):  %s", j, handler[_hexToString](logs[i].topics[j]));
            }
        }
    }

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

                    handler[_debugLogs](handler, receipt.logs);

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