/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

import Output from "../common/output.js";
import Transaction from "../common/transaction_raw.js";
import Demo from "../demo/demo.js";

//private member
const compiledJson = Symbol("compiledJson");

const abi = Symbol("abi");
const contractAddress = Symbol("contractAddress");

//private function
const getAccount = Symbol("getAccount");
const transactionProc = Symbol("transactionProc");
const getErrorStr = Symbol("getErrorStr");

export default class TestDemo {

    constructor() {
        this[compiledJson] = [];
        this[abi] = [];
        this[contractAddress] = "";
    }

    [getAccount]() { 
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            return new Array(0, 0);
        }

        return new Array(channels[0].account, channels[0].key);
    }

    [transactionProc](error, result, output, func) { 
        if (!error) {
            if ("" != result.status) {
                let status;
                if (0x1 == parseInt(result.status)) {
                    status = "succeeded";
                } else {
                    status = "failure";
                }
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, "small", "red", string);

                if (("succeeded" == status) && (null != func) && ("" != func)) {
                    func();
                }
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, "small", "red", string);
            }
        } else {
            Output(output, "small", "red", error);
        }
    }

    [getErrorStr](error) {
        let str = "";
        if ("0" == error) {
            str = "SUCCESS     ";
        } else if ("-1" == error) {
            str = "PARAMS ERROR";
        } else if ("-2" == error) {
            str = "NO DATA     ";
        } else if ("-3" == error) {
            str = "INNER ERROR ";
        } else {
            str = "UNKNOW ERROR";
        }

        return str;
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy(contractName) {
        console.log("TestDemo.deploy(%s)", contractName);
        let elementId;

        if ("Demo" == contractName) {
            elementId = window.outputDeployDemoElement;
        } else {
            console.log("Contract name Error!");
            return;
        }

        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(elementId, "small", "red", "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        let name;
        let fullName;
        let found = false;

        let byteCode;
        let transaction;
        let contract;
        let data;
        let handler = this;

        for (fullName in this[compiledJson].contracts) {
            //console.log(fullName);
            name = fullName.substr(fullName.indexOf(":") + 1);
            if (name == contractName) {
                found = true;
                break;
            }
        }

        if (!found) {
            Output(elementId, "small", "red", "JSON file error！");
            return;
        }

        if ('' == this[compiledJson].contracts[fullName].bin) {
            Output(elementId, "small", "red", "Bin is null in json file!");
            return;
        }     

        byteCode = "0x" + this[compiledJson].contracts[fullName].bin;
        if ("Demo" == contractName) {
            this[abi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[abi]);
        } else {
            console.log("Contract name Error!");
            return;
        }

        data = contract.new.getData({data: byteCode});

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.estimateGas({data: data}, function(error, result) {
            if (!error) {
                transaction = new Transaction(account, key);
                if ("undefined" != typeof transaction) {
                    transaction.do("deploy", data, result, null, function(error, result) {
                        if (!error) {
                            if ("Demo" == contractName) {
                                handler[contractAddress] = result.contractAddress;
                            } else {
                                console.log("Contract name Error!");
                                return;
                            }
                            let string = `[TransactionHash]:${result.transactionHash}</br>[ContractAddress]:${result.contractAddress}</br>[Try]:${result.tryTimes}(times)`;
                            Output(elementId, "small", "red", string);
                        } else {
                            Output(elementId, "small", "red", error);
                        }
                    });
                }
            } else {
                Output(elementId, "small", "red", error);
            }
        });
    }

    test(operation, params) {
        console.log("TestDemo.demo(%s, %s)", operation, params);

        // check param
        // if (("" == operation) || ("" == params)) {
        //     Output(window.outputDemoTestElement, "small", "red", "Please input correct input!");
        //     return;
        // }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputDemoTestElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        let demo;
        switch (operation) {
            case "Set":
                demo = new Demo(this[abi], this[contractAddress]);
                demo.set(account, key, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputDemoTestElement, null);
                });
                break;
            case "Get":
                demo = new Demo(this[abi], this[contractAddress]);
                demo.get(params, function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputDemoTestElement, "small", "red", `[User]:<br>(${errorStr}) ${result[1]} => ${result[2]}`);
                    } else {
                        Output(window.outputDemoTestElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputDemoTestElement, "small", "red", "Operation Error!");
                break;
        }
    }

    do(operation, para1, para2) {
        console.log("TestDemo.do(%s, %s, %s)", operation, para1, para2);
        switch(operation) {
            case "Deploy":
                this.deploy(para1);
                break;
            case "Test":
                this.test(para1, para2);
                break;
            default:
                console.log("Operation Error!");
                break;
        }
    }
}