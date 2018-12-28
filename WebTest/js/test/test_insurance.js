/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

import Output from "../common/output.js";
import Transaction from "../common/transaction_raw.js";
import Delegate from "../common/delegate.js";
import InsuranceTemplate from "../insurance/insurance_template.js";
import InsuranceUser from "../insurance/insurance_user.js";
import InsurancePolicy from "../insurance/insurance_policy.js";

//private member
const compiledJson = Symbol("compiledJson");

const templateAbi = Symbol("templateAbi");
const templateContractAddress = Symbol("templateContractAddress");

const userAbi = Symbol("userAbi");
const userContractAddress = Symbol("userContractAddress");

const policyAbi = Symbol("policyAbi");
const policyContractAddress = Symbol("policyContractAddress");

//private function
const getAccount = Symbol("getAccount");
const transactionProc = Symbol("transactionProc");
const hexToString = Symbol("hexToString");
const getErrorStr = Symbol("getErrorStr");
const templateBatch = Symbol("templateBatch");

export default class TestInsurance {

    constructor() {
        this[compiledJson] = [];

        this[templateAbi] = [];
        this[userAbi] = [];
        this[policyAbi] = [];

        this[templateContractAddress] = "";
        this[userContractAddress] = "";
        this[policyContractAddress] = "";
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
        console.log("TestInsurance.deploy(%s)", contractName);
        let elementId;

        if ("InsuranceTemplate" == contractName) {
            elementId = window.outputDeployTemplateElement;
        } else if ("InsuranceUser" == contractName) {
            elementId = window.outputDeployUserElement;
        } else if ("InsurancePolicy" == contractName) {
            elementId = window.outputDeployPolicyElement;
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
        let privateKey = tmps[1];

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
        } else if ("InsuranceUser" == contractName) {
            this[userAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[userAbi]);
        } else if ("InsurancePolicy" == contractName) {
            this[policyAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[policyAbi]);
        } else {
            console.log("Contract name Error!");
            return;
        }

        data = contract.new.getData({data: byteCode});

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.estimateGas({data: data}, function(error, result) {
            if (!error) {
                transaction = new Transaction(account, privateKey);
                if ("undefined" != typeof transaction) {
                    transaction.do("deploy", data, result, null, function(error, result) {
                        if (!error) {
                            if ("InsuranceTemplate" == contractName) {
                                handler[templateContractAddress] = result.contractAddress;
                            } else if ("InsuranceUser" == contractName) {
                                handler[userContractAddress] = result.contractAddress;
                            } else if ("InsurancePolicy" == contractName) {
                                handler[policyContractAddress] = result.contractAddress;
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

    setup(cmd, contractName) {
        console.log('TestInsurance.setup(%s, %s)', cmd, contractName);
        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputSetupElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        switch (cmd) {
            case "Set":
                if ("InsuranceUser" == contractName) {
                    let insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                    insuranceUser.setup(account, privateKey, this[templateContractAddress], function(error, result) {
                        handler[transactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("InsurancePolicy" == contractName) {
                    let insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                    insurancePolicy.setup(account, privateKey, this[templateContractAddress], this[userContractAddress], function(error, result) {
                        handler[transactionProc](error, result, window.outputSetupElement);
                    });
                } else {
                    Output(window.outputSetupElement, 'small', 'red', "Contract name Error!");
                }
                break;
            case "Get":
                if ("InsuranceUser" == contractName) {
                    let insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                    insuranceUser.getAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[Address]: template(${result})`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else if ("InsurancePolicy" == contractName) {
                    let insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                    insurancePolicy.getAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[Address]: template(${result[0]}), user(${result[1]})`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else {
                    Output(window.outputSetupElement, 'small', 'red', "Contract name Error!");
                }
                break;
            default:
                Output(window.outputSetupElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    [templateBatch](handler, account, privateKey, cmd) {
        let insuranceTemplate;
        switch (cmd) {
            case "Update":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.update(account, privateKey, "[UI]UserPhoneSignIn", "手机号&密码", function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, function() {
                        insuranceTemplate.update(account, privateKey, "[UI]UserEmailSignIn", "邮箱&密码", function(error, result) {
                            handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                insuranceTemplate.update(account, privateKey, "[UI]UserPhoneSignUp", "手机号&短信验证码&密码&确认密码", function(error, result) {
                                    handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                        insuranceTemplate.update(account, privateKey, "[UI]UserEmailSignUp", "邮箱&邮箱验证码&密码&确认密码", function(error, result) {
                                            handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                                insuranceTemplate.update(account, privateKey, "[UI]UserForgetPassword", "邮箱/手机号", function(error, result) {
                                                    handler[transactionProc](error, result, window.outputTemplateElement, function() {                   
                                                    });
                                                 });          
                                            });
                                         });          
                                    });
                                 });
                            });
                        });
                    });
                });
                break;
            default:
                Output(window.outputTemplateElement, "small", "red", "Command Error!");
                break;
        }
    }

    template(operation, params) {
        console.log("TestInsurance.template(%s, %s)", operation, params);

        // check param
        if ("" == operation) {
            Output(window.outputTemplateElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputTemplateElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insuranceTemplate;
        switch (operation) {
            case "Debug":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.size(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputTemplateElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insuranceTemplate.getById(i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[Template${id}]: (${errorStr}) ${result[1]} => ${result[2]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputTemplateElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputTemplateElement, 'small', 'red', `[Template${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                })
                break;
            case "Batch":
                handler[templateBatch](handler, account, privateKey, params);
                break;
            case "Update":
                tmps = params.split(",");
                let key = tmps[0];
                let data = tmps[1];

                if ((undefined == key) || (undefined == data)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.update(account, privateKey, key, data, function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, null);
                });
                break;
            case "Size":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.size(function(error, result) {
                    if (!error) {
                        Output(window.outputTemplateElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.getById(params, function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputTemplateElement, "small", "red", `[Template${id}]: (${errorStr}) ${result[1]} => ${result[2]}`);
                    } else {
                        Output(window.outputTemplateElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.getByKey(params, function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputTemplateElement, "small", "red", `[Template]: (${errorStr}) ${params} => ${result[1]}`);
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

    user(operation, params) {
        console.log("TestInsurance.user(%s, %s)", operation, params);

        // check param
        if (("" == operation) || ("" == params)) {
            Output(window.outputUserElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputUserElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insuranceUser;
        switch (operation) {
            case "Debug":
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.size(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputUserElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insuranceUser.getById(params, i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[User${id}]: (${errorStr}) ${result[1]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputUserElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputUserElement, 'small', 'red', `[Template${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                })                
                break;
            case "SignUp":
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.signUp(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputUserElement, null);
                });
                break;
            case "Size":
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.size(function(error, result) {
                    if (!error) {
                        Output(window.outputUserElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                tmps = params.split(",");
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.getByKey(tmps[0], tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputUserElement, "small", "red", `[User]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                tmps = params.split(",");
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.getById(tmps[0], tmps[1], function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputUserElement, "small", "red", `[User${id}]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputUserElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputUserElement, "small", "red", "Operation Error!");
                break;
        }
    }

    policy(operation, params) {
        console.log("TestInsurance.policy(%s, %s)", operation, params);

        // check param
        if (("" == operation) || ("" == params)) {
            Output(window.outputPolicyElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputPolicyElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insurancePolicy;
        switch (operation) {
            case "Debug":
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.size(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputPolicyElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insurancePolicy.getById(params, i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[User${id}]: (${errorStr}) ${result[1]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputPolicyElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputPolicyElement, 'small', 'red', `[Template${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                })                
                break;
            case "Submit":
                tmps = params.split("#");
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.submit(account, privateKey, tmps[0], tmps[1], tmps[2], function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "Size":
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.size(function(error, result) {
                    if (!error) {
                        Output(window.outputPolicyElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                tmps = params.split(",");
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.getByKey(tmps[0], tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputPolicyElement, "small", "red", `[User]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                tmps = params.split(",");
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.getById(tmps[0], tmps[1], function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputPolicyElement, "small", "red", `[User${id}]:<br>(${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputPolicyElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputPolicyElement, "small", "red", "Operation Error!");
                break;
        }
    }

    do(operation, para1, para2) {
        console.log("TestInsurance.do(%s, %s, %s)", operation, para1, para2);
        switch(operation) {
            case "Deploy":
                this.deploy(para1);
                break;
            case "Setup":
                this.setup(para1, para2);
                break;
            case "Template":
                this.template(para1, para2);
                break;
            case "User" :
                this.user(para1, para2);
                break;
            case "Policy":
                this.policy(para1, para2);
                break;
            default:
                console.log("Operation Error!");
                break;
        }
    }
}