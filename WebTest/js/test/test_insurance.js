/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

import Output from "../common/output.js";
import Transaction from '../common/transaction_raw.js';
import Delegate from '../common/delegate.js';
import InsuranceTemplate from '../insurance/insurance_template.js';

//private member
const compiledJson = Symbol('compiledJson');

const templateAbi = Symbol('templateAbi');
const templateContractAddress = Symbol('templateContractAddress');

//private function
const getAccount = Symbol('getAccount');
const transactionProc = Symbol('transactionProc');
const hexToString = Symbol('hexToString');

export default class TestInsurance {

    constructor() {
        this[compiledJson] = [];

        this[templateAbi] = [];

        this[templateContractAddress] = "";
    }

    [getAccount]() { 
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            return new Array(0, 0);
        }

        return new Array(channels[0].account, channels[0].key);
    }

    [transactionProc](error, result, output) { 
        if (!error) {
            if ("" != result.status) {
                let status;
                if (0x1 == parseInt(result.status)) {
                    status = "succeeded";
                } else {
                    status = "failure";
                }
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, 'small', 'red', string);
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(output, "small", "red", string);
            }
        } else {
            Output(output, "small", "red", error);
        }
    }

    [hexToString](str) {
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

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy(contractName) {
        console.log("TestInsurance.deploy(%s)", contractName);
        let elementId;

        if ("InsuranceTemplate" == contractName) {
            elementId = window.outputDeployTemplateElement;
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
        if ("InsuranceTemplate" == contractName) {
            this[templateAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[templateAbi]);
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
                            if ("InsuranceTemplate" == contractName) {
                                handler[templateContractAddress] = result.contractAddress;
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

    template(operation, params) {
        console.log("TestInsurance.template(%s, %s)", operation, params);

        // check param
        if (("" == operation) || ("" == params)) {
            Output(window.outputTemplateElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputDelegateWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        let insuranceTemplate;
        switch (operation) {
            case "Create":
                tmps = params.split(",");
                let name = tmps[0];
                let data = tmps[1];

                if ((undefined == name) || (undefined == data)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.create(account, key, name, data, function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement);
                });
                break;
            case "Get":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.get(params, function(error, result) {
                    if (!error) {
                        let name = handler[hexToString](result[0]);
                        Output(window.outputTemplateElement, "small", "red", `[Template]:</br>${name},${result[1]}`);
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputTemplateElement, "small", "red", "Operation Error!");
                break;
        }
    }

    do(operation, para1, para2) {
        console.log("TestInsurance.do(%s, %s, %s)", operation, para1, para2);
        switch(operation) {
            case "Deploy":
                this.deploy(para1);
                break;
            case "Template":
                this.template(para1, para2);
                break;
            default:
                console.log("Operation Error!");
                break;
        }
    }
}