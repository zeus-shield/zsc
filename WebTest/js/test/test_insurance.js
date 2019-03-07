/**
  Copyright (c) 2018, ZSC Dev Team
  2018-10-19: v0.00.01
 */

import Output from "../common/output.js";
import Transaction from "../common/transaction_raw.js";
import Delegate from "../common/delegate.js";
import InsuranceCompany from "../insurance/insurance_company.js";
import InsuranceTemplate from "../insurance/insurance_template.js";
import InsuranceUser from "../insurance/insurance_user.js";
import InsurancePolicy from "../insurance/insurance_policy.js";
import InsuranceUserPolicy from "../insurance/insurance_user_policy.js";
import InsuranceAnalytics from "../insurance/insurance_analytics.js";
import InsuranceIntegral from "../insurance/insurance_integral.js";

//private member
const compiledJson = Symbol("compiledJson");

const companyAbi = Symbol("companyAbi");
const companyContractAddress = Symbol("companyContractAddress");

const templateAbi = Symbol("templateAbi");
const templateContractAddress = Symbol("templateContractAddress");

const userAbi = Symbol("userAbi");
const userContractAddress = Symbol("userContractAddress");

const policyAbi = Symbol("policyAbi");
const policyContractAddress = Symbol("policyContractAddress");

const userPolicyAbi = Symbol("userPolicyAbi");
const userPolicyContractAddress = Symbol("userPolicyContractAddress");

const analyticsAbi = Symbol("analyticsAbi");
const analyticsContractAddress = Symbol("analyticsContractAddress");

const integralAbi = Symbol("integralAbi");
const integralContractAddress = Symbol("integralContractAddress");

//private function
const getAccount = Symbol("getAccount");
const transactionProc = Symbol("transactionProc");
const hexToString = Symbol("hexToString");
const getErrorStr = Symbol("getErrorStr");
const getDelegateInstance = Symbol("getDelegateInstance");
const companyBatch = Symbol("companyBatch");
const templateBatch = Symbol("templateBatch");

export default class TestInsurance {

    constructor() {
        this[compiledJson] = [];

        this[companyAbi] = [];
        this[templateAbi] = [];
        this[userAbi] = [];
        this[policyAbi] = [];
        this[userPolicyAbi] = [];
        this[analyticsAbi] = [];
        this[integralAbi] = [];
        this[companyContractAddress] = "";
        this[templateContractAddress] = "";
        this[userContractAddress] = "";
        this[policyContractAddress] = "";
        this[userPolicyContractAddress] = "";
        this[analyticsContractAddress] = "";
        this[integralContractAddress] = "";
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
            str = "NO AUTH     ";
        } else if ("-9" == error) {
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

        if ("InsuranceCompany" == contractName) {
            elementId = window.outputDeployCompanyElement;
        } else if ("InsuranceTemplate" == contractName) {
            elementId = window.outputDeployTemplateElement;
        } else if ("InsuranceUser" == contractName) {
            elementId = window.outputDeployUserElement;
        } else if ("InsurancePolicy" == contractName) {
            elementId = window.outputDeployPolicyElement;
        } else if ("InsuranceUserPolicy" == contractName) {
            elementId = window.outputDeployUserPolicyElement;
        } else if ("InsuranceAnalytics" == contractName) {
            elementId = window.outputDeployAnalyticsElement;
        } else if ("InsuranceIntegral" == contractName) {
            elementId = window.outputDeployIntegralElement;
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
        if ("InsuranceCompany" == contractName) {
            this[companyAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[companyAbi]);
        } else if ("InsuranceTemplate" == contractName) {
            this[templateAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[templateAbi]);
        } else if ("InsuranceUser" == contractName) {
            this[userAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[userAbi]);
        } else if ("InsurancePolicy" == contractName) {
            this[policyAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[policyAbi]);
        } else if ("InsuranceUserPolicy" == contractName) {
            this[userPolicyAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[userPolicyAbi]);
        } else if ("InsuranceAnalytics" == contractName) {
            this[analyticsAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[analyticsAbi]);
        } else if ("InsuranceIntegral" == contractName) {
            this[integralAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[integralAbi]);
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
                            if ("InsuranceCompany" == contractName) {
                                handler[companyContractAddress] = result.contractAddress;
                            } else if ("InsuranceTemplate" == contractName) {
                                handler[templateContractAddress] = result.contractAddress;
                            } else if ("InsuranceUser" == contractName) {
                                handler[userContractAddress] = result.contractAddress;
                            } else if ("InsurancePolicy" == contractName) {
                                handler[policyContractAddress] = result.contractAddress;
                            } else if ("InsuranceUserPolicy" == contractName) {
                                handler[userPolicyContractAddress] = result.contractAddress;
                            } else if ("InsuranceAnalytics" == contractName) {
                                handler[analyticsContractAddress] = result.contractAddress;
                            } else if ("InsuranceIntegral" == contractName) {
                                handler[integralContractAddress] = result.contractAddress;
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
                    insurancePolicy.setup(account, privateKey, this[templateContractAddress], function(error, result) {
                        handler[transactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("InsuranceUserPolicy" == contractName) {
                    let insuranceUserPolicy = new InsuranceUserPolicy(this[userPolicyAbi], this[userPolicyContractAddress]);
                    insuranceUserPolicy.setup(account, privateKey, this[userContractAddress], this[policyContractAddress], function(error, result) {
                        handler[transactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("InsuranceAnalytics" == contractName) {
                    let insuranceAnalytics = new InsuranceAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    insuranceAnalytics.setup(account, privateKey, this[policyContractAddress], function(error, result) {
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
                            Output(window.outputSetupElement, 'small', 'red', `[Address]: template(${result})`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else if ("InsuranceUserPolicy" == contractName) {
                    let insuranceUserPolicy = new InsuranceUserPolicy(this[userPolicyAbi], this[userPolicyContractAddress]);
                    insuranceUserPolicy.getAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[Address]: user(${result[0]}), policy(${result[1]})`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else if ("InsuranceAnalytics" == contractName) {
                    let insuranceAnalytics = new InsuranceAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    insuranceAnalytics.getAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[Address]: policy(${result})`);
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

    [companyBatch](handler, account, privateKey, cmd) {
        let insuranceCompany;
        switch (cmd) {
            case "Update":
                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.update(account, privateKey, "PingAn", "Life#Auto#Accident#Unemployment", function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, function() {
                        insuranceCompany.update(account, privateKey, "CPIC", "Accident#Unemployment", function(error, result) {
                            handler[transactionProc](error, result, window.outputCompanyElement, function() {
                                insuranceCompany.update(account, privateKey, "AIA", "Unemployment", function(error, result) {
                                    handler[transactionProc](error, result, window.outputCompanyElement, function() {
                                        // insuranceCompany.update(account, privateKey, "DB_Policy_CPIC_Accident", "Key#UserKey#Insurant#Passport#Amount#StartTime#EndTime#Vehicle#Country#City#Description", function(error, result) {
                                        //     handler[transactionProc](error, result, window.outputCompanyElement, function() {
                                        //         insuranceCompany.update(account, privateKey, "DB_Policy_AIA_Unemployment", "Key#UserKey#Insurant#Sex#Age#ID#Amount#StartTime#Period#City#Company#Description", function(error, result) {
                                        //             handler[transactionProc](error, result, window.outputCompanyElement, function() {                   
                                        //             });
                                        //          });          
                                        //     });
                                        //  });          
                                    });
                                 });
                            });
                        });
                    });
                });
                break;
            default:
                Output(window.outputCompanyElement, "small", "red", "Command Error!");
                break;
        }
    }

    [getDelegateInstance](contract) {
        let delegate = null;
        if ("InsuranceCompany" == contract) {
            delegate = new Delegate(this[companyAbi], this[companyContractAddress]);
        } else if ("InsuranceTemplate" == contract) {
            delegate = new Delegate(this[templateAbi], this[templateContractAddress]);
        } else if ("InsuranceUser" == contract) {
            delegate = new Delegate(this[userAbi], this[userContractAddress]);
        } else if ("InsurancePolicy" == contract) {
            delegate = new Delegate(this[policyAbi], this[policyContractAddress]);
        } else if ("InsuranceUserPolicy" == contract) {
            delegate = new Delegate(this[userPolicyAbi], this[userPolicyContractAddress]);
        } else if ("InsuranceAnalytics" == contract) {
            delegate = new Delegate(this[analyticsAbi], this[analyticsContractAddress]);
        } else {}

        return delegate;       
    }

    delegate(cmd, params) {
        console.log('TestInsurance.delegate(%s; %s)', cmd, params);
        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputDelegateReadElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        tmps = params.split(",");
        let contract = tmps[0];
        let address = tmps[1];

        let delegate = this[getDelegateInstance](contract);
        if (null == delegate) {
            Output(window.outputDelegateReadElement, 'small', 'red', "Delegate instance Error!");
            return;
        }

        switch (cmd) {
            case "Debug":
                delegate.number(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;
                        for (let i=0; i<sum; i++) {
                            delegate.getInfoById(i, function(error, id, result) {
                                if (!error) {
                                    logs[id] = `[Delegate${id}]: ${result}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputDelegateReadElement, 'small', 'red', str);
                                    }                                 
                                } else {
                                    Output(window.outputDelegateReadElement, 'small', 'red', `[Delegate${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputDelegateReadElement, 'small', 'red', error);
                    }
                })               
                break;
            case "Update":
                let priority = tmps[2];

                if ((undefined == address) || ("" == address) ||(undefined == priority)) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input address/priority!");
                    return;
                }

                // update
                delegate.update(account, key, address, priority, function(error, result) {
                    handler[transactionProc](error, result, window.outputDelegateWriteElement);
                });

                break;
            case "Remove":
                if ((undefined == address) || ("" == address)) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input address/priority!");
                    return;
                }

                // remove
                delegate.remove(account, key, address, function(error, result) {
                    handler[transactionProc](error, result, window.outputDelegateWriteElement);
                });
                break;
            case "Transfer":
                if ((undefined == address) || ("" == address)) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input address/priority!");
                    return;
                }

                // transferOwnership
                delegate.transferOwnership(account, key, address, 2, function(error, result) {
                    handler[transactionProc](error, result, window.outputDelegateWriteElement);
                });                
                break;
            default:
                Output(window.outputDelegateReadElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    company(operation, params) {
        console.log("TestInsurance.company(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputCompanyElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputCompanyElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insuranceCompany;
        switch (operation) {
            case "Debug":
                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.size(function(error, result) {
                    if (!error) {
                        let sum = parseInt(result.toString(10));
                        let logs = new Array(sum);
                        let count = 0;

                        if (0 == sum) {
                            Output(window.outputCompanyElement, "small", "red", "No Data!");
                            return;
                        }

                        for (let i=0; i<sum; i++) {
                            insuranceCompany.getById(i, function(error, id, result) {
                                if (!error) {
                                    let errorStr = handler[getErrorStr](result[0].toString(10));
                                    logs[id] = `[Company${id}]: (${errorStr}) ${result[1]} => ${result[2]}`;
                                    count ++;
                                    if (count == sum) {
                                        let str = "";
                                        for (let j=0; j<logs.length; j++) {
                                            str = str.concat(`${logs[j]}<br>`);
                                        }
                                        Output(window.outputCompanyElement, 'small', 'red', str);
                                    }
                                } else {
                                    Output(window.outputCompanyElement, 'small', 'red', `[Company${id}]:</br>${error}`);
                                }
                            })
                        }
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                })
                break;
            case "Batch":
                handler[companyBatch](handler, account, privateKey, params);
                break;
            case "Update":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                let key = tmps[0];
                let data = tmps[1];

                if ((undefined == key) || (undefined == data)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.update(account, privateKey, key, data, function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.remove(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, null);
                });
                break;
            case "Destroy":
                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.destroy(account, privateKey, function(error, result) {
                    handler[transactionProc](error, result, window.outputCompanyElement, null);
                });
                break;
            case "Size":
                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.size(function(error, result) {
                    if (!error) {
                        Output(window.outputCompanyElement, "small", "red", `[Size]: ${result.toString(10)}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            case "GetById":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.getById(params, function(error, id, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputCompanyElement, "small", "red", `[Company${id}]: (${errorStr}) ${result[1]} => ${result[2]}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            case "GetByKey":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputCompanyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.getByKey(params, function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputCompanyElement, "small", "red", `[Company]: (${errorStr}) ${params} => ${result[1]}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            case "GetAll":
                insuranceCompany = new InsuranceCompany(this[companyAbi], this[companyContractAddress]);
                insuranceCompany.getAll(function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputCompanyElement, "small", "red", `[Company]: (${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputCompanyElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputCompanyElement, "small", "red", "Operation Error!");
                break;
        }
    }

    [templateBatch](handler, account, privateKey, cmd) {
        let insuranceTemplate;
        switch (cmd) {
            case "Update":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                // insuranceTemplate.update(account, privateKey, "UI_User_PhoneSignIn", "手机号&密码", function(error, result) {
                //     handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //         insuranceTemplate.update(account, privateKey, "UI_User_EmailSignIn", "邮箱&密码", function(error, result) {
                //             handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //                 insuranceTemplate.update(account, privateKey, "UI_User_PhoneSignUp", "手机号&短信验证码&密码&确认密码", function(error, result) {
                //                     handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //                         insuranceTemplate.update(account, privateKey, "UI_User_EmailSignUp", "邮箱&邮箱验证码&密码&确认密码", function(error, result) {
                //                             handler[transactionProc](error, result, window.outputTemplateElement, function() {
                //                                 insuranceTemplate.update(account, privateKey, "UI_User_ForgetPassword", "邮箱/手机号", function(error, result) {
                //                                     handler[transactionProc](error, result, window.outputTemplateElement, function() {                   
                //                                     });
                //                                  });          
                //                             });
                //                          });          
                //                     });
                //                  });
                //             });
                //         });
                //     });
                // });
                insuranceTemplate.update(account, privateKey, "DB_User", "Key#Password#NickName#SignUpTime#UpdateTime#Policies#Receipts", function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, function() {
                        insuranceTemplate.update(account, privateKey, "DB_Policy_PingAn_Life", "Key#UserKey#Insurant#Sex#Age#Amount#StartTime#Period#Description", function(error, result) {
                            handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                insuranceTemplate.update(account, privateKey, "DB_Policy_PingAn_Auto", "Key#UserKey#Insurant#Amount#StartTime#EndTime#City#PlateNumber#Description", function(error, result) {
                                    handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                        insuranceTemplate.update(account, privateKey, "DB_Policy_CPIC_Accident", "Key#UserKey#Insurant#Passport#Amount#StartTime#EndTime#Vehicle#Country#City#Description", function(error, result) {
                                            handler[transactionProc](error, result, window.outputTemplateElement, function() {
                                                insuranceTemplate.update(account, privateKey, "DB_Policy_AIA_Unemployment", "Key#UserKey#Insurant#Sex#Age#ID#Amount#StartTime#Period#City#Company#Description", function(error, result) {
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
        if ((undefined == operation) || ("" == operation)) {
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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

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
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.remove(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputTemplateElement, null);
                });
                break;
            case "Destroy":
                insuranceTemplate = new InsuranceTemplate(this[templateAbi], this[templateContractAddress]);
                insuranceTemplate.destroy(account, privateKey, function(error, result) {
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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputTemplateElement, "small", "red", "Please input correct params!");
                    return;
                }

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
        if ((undefined == operation) || ("" == operation)) {
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
        let insuranceUserPolicy;
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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split("#");
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.signUp(account, privateKey, tmps[0], tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputUserElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceUserPolicy = new InsuranceUserPolicy(this[userPolicyAbi], this[userPolicyContractAddress]);
                insuranceUserPolicy.remove(account, privateKey, "0", params, function(error, result) {
                    handler[transactionProc](error, result, window.outputUserElement, null);
                });
                break;
            case "Destroy":
                insuranceUser = new InsuranceUser(this[userAbi], this[userContractAddress]);
                insuranceUser.destroy(account, privateKey, function(error, result) {
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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

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
            case "GetPolicies":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputUserElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insuranceUserPolicy = new InsuranceUserPolicy(this[userPolicyAbi], this[userPolicyContractAddress]);
                insuranceUserPolicy.getPolicies(tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputUserElement, "small", "red", `[UserPolicies]:<br>(${errorStr}) ${result[1]}`);
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
        if ((undefined == operation) || ("" == operation)) {
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
        let insuranceUserPolicy;
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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split("#");
                insuranceUserPolicy = new InsuranceUserPolicy(this[userPolicyAbi], this[userPolicyContractAddress]);
                insuranceUserPolicy.submit(account, privateKey, tmps[0], tmps[1], tmps[2], tmps[3], function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "Remove":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceUserPolicy = new InsuranceUserPolicy(this[userPolicyAbi], this[userPolicyContractAddress]);
                insuranceUserPolicy.remove(account, privateKey, "1", params, function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "AddElement":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.addElement(account, privateKey, tmps[0], tmps[1], tmps[2], function(error, result) {
                    handler[transactionProc](error, result, window.outputPolicyElement, null);
                });
                break;
            case "Destroy":
                insurancePolicy = new InsurancePolicy(this[policyAbi], this[policyContractAddress]);
                insurancePolicy.destroy(account, privateKey, function(error, result) {
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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

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
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputPolicyElement, "small", "red", "Please input correct params!");
                    return;
                }

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

    analytics(operation, params) {
        console.log("TestInsurance.analytics(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputAnalyticsElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputAnalyticsElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insuranceAnalytics;
        switch (operation) {
            case "getKeys":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputAnalyticsElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");

                insuranceAnalytics = new InsuranceAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                insuranceAnalytics.getKeys(tmps[0], tmps[1], function(error, result) {
                    if (!error) {
                        let errorStr = handler[getErrorStr](result[0].toString(10));
                        Output(window.outputAnalyticsElement, "small", "red", `[Keys]: (${errorStr}) ${result[1]}`);
                    } else {
                        Output(window.outputAnalyticsElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputAnalyticsElement, "small", "red", "Operation Error!");
                break;
        }
    }

    integral(operation, params) {
        console.log("TestInsurance.integral(%s, %s)", operation, params);

        // check param
        if ((undefined == operation) || ("" == operation)) {
            Output(window.outputIntegralElement, "small", "red", "Please input correct input!");
            return;
        }

        let handler = this;
        let tmps = this[getAccount]();
        if (0 == tmps[0]) {
            Output(window.outputIntegralElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let privateKey = tmps[1];

        let insuranceIntegral;
        let insuranceUser;
        switch (operation) {
            case "Debug":           
                break;
            case "UpdateCap":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.updateCap(account, privateKey, params, function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Transfer":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.transfer(account, privateKey, tmps[0], tmps[1], tmps[2], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Mint":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.mint(account, privateKey, tmps[0], tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Burn":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                tmps = params.split(",");
                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.burn(account, privateKey, tmps[0], tmps[1], function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Pause":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.pause(account, privateKey, function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Unpause":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.unpause(account, privateKey, function(error, result) {
                    handler[transactionProc](error, result, window.outputIntegralElement, null);
                });
                break;
            case "Total":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.totalSupply(function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Total]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            case "Balance":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.balanceOf(params, function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Balance]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            case "Cap":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.cap(function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Cap]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            case "Paused":
                if ((undefined == params) || ("" == params)) {
                    Output(window.outputIntegralElement, "small", "red", "Please input correct params!");
                    return;
                }

                insuranceIntegral = new InsuranceIntegral(this[integralAbi], this[integralContractAddress]);
                insuranceIntegral.cap(function(error, result) {
                    if (!error) {
                        Output(window.outputIntegralElement, "small", "red", `[Paused]: ${result}`);
                    } else {
                        Output(window.outputIntegralElement, "small", "red", error);
                    }
                });
                break;
            default:
                Output(window.outputIntegralElement, "small", "red", "Operation Error!");
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
            case 'Delegate':
                this.delegate(para1, para2);
                break;
            case "Company":
                this.company(para1, para2);
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
            case "Analytics":
                this.analytics(para1, para2);
                break;
            case "Integral":
                this.integral(para1, para2);
                break;
            default:
                console.log("Operation Error!");
                break;
        }
    }
}