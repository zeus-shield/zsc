
import Output from './output.js';
import Transaction from './transaction_raw.js';
import Delegate from './delegate.js';
import Logistics from './logistics.js';
import LogisticsAnalytics from './logistics_analytics.js';
import LogisticsCore from './logistics_core.js';
import LogisticsTestData from './test_logistics_raw_data.js';

//private member
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');

const analyticsAbi = Symbol('analyticsAbi');
const analyticsContractAddress = Symbol('analyticsContractAddress');

const coreAbi = Symbol('coreAbi');
const coreContractAddress = Symbol('coreContractAddress');

const databaseAbi = Symbol('databaseAbi');
const databaseContractAddress = Symbol('databaseContractAddress');

const nextIndex = Symbol('nextIndex');
const tick = Symbol('tick');

//private function
const sleep = Symbol('sleep');
const getCommonAccount = Symbol('getCommonAccount');
const commmonTransactionProc = Symbol('commmonTransactionProc');
const openNextChannel = Symbol('openNextChannel');
const openChannelFunc = Symbol('openChannelFunc');
const openChannel = Symbol('openChannel');
const closeChannel = Symbol('closeChannel');
const removeBatch = Symbol('removeBatch');
const getInvalid = Symbol('getInvalid');
const invalidBatch = Symbol('invalidBatch');
const getDelegateInstance = Symbol('getDelegateInstance');
const getTimeStamp = Symbol('getTimeStamp');

export default class TestLogisticsRaw {

    constructor() {
        this[compiledJson] = [];

        this[abi] = [];
        this[coreAbi] = [];
        this[databaseAbi] = [];

        this[contractAddress] = "";
        this[coreContractAddress] = "";
        this[databaseContractAddress] = "";
        
        this[nextIndex] = 0;
        this[tick] = 0;
    }

    [sleep](ms) { 
        let now = new Date(); 
        let end = now.getTime() + ms;

        while (true) { 
            now = new Date(); 
            if (now.getTime() > end) 
            return; 
        } 
    }

    [getCommonAccount]() { 
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            return new Array(0, 0);
        }

        return new Array(channels[0].account, channels[0].key);
    }

    [commmonTransactionProc](error, result, output) { 
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
                Output(output, 'small', 'red', string);
            }
        } else {
            Output(output, 'small', 'red', error);
        }
    }

    setCompiledJson(data) {
        this[compiledJson] = JSON.parse(data);
    }

    deploy(contractName) {
        console.log('TestLogisticsRaw.deploy(%s)', contractName);
        let elementId;
        let channels = window.channelClass.get("idle");

        if ('LogisticsDatabase' == contractName) {
            elementId = window.outputDeployDatabaseElement;
        } else if ('LogisticsCore' == contractName) {
            elementId = window.outputDeployCoreElement;
        } else if ('LogisticsAnalytics' == contractName) {
            elementId = window.outputDeployAnalyticsElement;
        } else {
            elementId = window.outputDeployElement;
        }

        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(elementId, 'small', 'red', "No channnel(idle)!");
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
            Output(elementId, 'small', 'red', "JSON file error！");
            return;
        }

        if ('' == this[compiledJson].contracts[fullName].bin) {
            Output(elementId, 'small', 'red', "Bin is null in json file!");
            return;
        }     

        byteCode = '0x' + this[compiledJson].contracts[fullName].bin;
        if ('LogisticsDatabase' == contractName) {
            this[databaseAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[databaseAbi]);
        } else if ('LogisticsCore' == contractName) {
            this[coreAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[coreAbi]);
        } else if ('LogisticsAnalytics' == contractName) {
            this[analyticsAbi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[analyticsAbi]);
        } else {
            this[abi] = JSON.parse(this[compiledJson].contracts[fullName].abi);
            contract = web3.eth.contract(this[abi]);
        }

        data = contract.new.getData({data: byteCode});

        // estimate gas
        // The MetaMask Web3 object does not support synchronous methods without a callback parameter
        web3.eth.estimateGas({data: data}, function(error, result) {
            if (!error) {
                transaction = new Transaction(account, key);
                if('undefined' != typeof transaction) {
                    transaction.do("deploy", data, result, null, function(error, result) {
                        if (!error) {
                            if ('LogisticsDatabase' == contractName) {
                                handler[databaseContractAddress] = result.contractAddress;
                            } else if ('LogisticsCore' == contractName) {
                                handler[coreContractAddress] = result.contractAddress;
                            } else if ('LogisticsAnalytics' == contractName) {
                                handler[analyticsContractAddress] = result.contractAddress;
                            } else {
                                handler[contractAddress] = result.contractAddress;
                            }
                            let string = `[TransactionHash]:${result.transactionHash}</br>[ContractAddress]:${result.contractAddress}</br>[Try]:${result.tryTimes}(times)`;
                            Output(elementId, 'small', 'red', string);
                        } else {
                            Output(elementId, 'small', 'red', error);
                        }
                    });
                }
            } else {
                Output(elementId, 'small', 'red', error);
            }
        });
    }

    setup(cmd, contractName) {
        console.log('TestLogisticsRaw.setup(%s, %s)', cmd, contractName);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputSetupElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        switch (cmd) {
            case "Set":
                if ("Logistics" == contractName) {
                    let logistics = new Logistics(this[abi], this[contractAddress]);
                    logistics.setup(account, key, this[coreContractAddress], function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("LogisticsAnalytics" == contractName) {
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.setup(account, key, this[coreContractAddress], function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputSetupElement);
                    });
                } else if ("LogisticsCore" == contractName) {
                    let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
                    logisticsCore.setup(account, key, this[databaseContractAddress], function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputSetupElement);
                    });
                } else {
                    Output(window.outputSetupElement, 'small', 'red', "Contract name Error!");
                }
                break;
            case "Get":
                if ("Logistics" == contractName) {
                    Output(window.outputSetupElement, 'small', 'red', "Don't support now!");
                } else if ("LogisticsAnalytics" == contractName) {
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.getCoreAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[CoreContractAddress]: ${result}`);
                        } else {
                            Output(window.outputSetupElement, 'small', 'red', error);
                        }
                    });
                } else if ("LogisticsCore" == contractName) {
                    let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
                    logisticsCore.getDatabaseAddr(function(error, result) {
                        if (!error) {
                            Output(window.outputSetupElement, 'small', 'red', `[DatabaseContractAddress]: ${result}`);
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

    [openNextChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result) {
        if (blockCount == handler[nextIndex]) {
            // no block will proc, close channel
            handler[closeChannel](account);

            // if all the channel is idle, all the block finished
            let channels = window.channelClass.get("idle");
            if (window.channelClass.size() == channels.length) {
                // finish the all the block
                let ticks = (new Date()).valueOf() - handler[tick];
                let string = `Finish all(cost: ${ticks}ms).`;
                Output(outputElement, 'small', 'red', string);
                return true;
            }
        } else {
            handler[openChannel](handler, account, key, data, parallelCount, handler[nextIndex], blockCount, outputElement);
            handler[nextIndex] ++;
        }

        return false;
    }

    [openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result) {
        if (!error) {
            if ("" != result.status) {
                if (0x1 == parseInt(result.status)) {
                    console.log("%cindex=%s(succeeded), account=%s","background:white;color:orange", blockIndex, account);
                } else {
                    console.log("%cindex=%s(failure), account=%s","background:white;color:red", blockIndex, account);
                }

                if (0x1 == parseInt(result.status)) {
                    // try to next transaction
                    status = "succeeded";

                    // lock -- DOTO
                    let finished = handler[openNextChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                    if (finished) {
                        return;
                    }
                    // unlock -- DOTO
                } else {
                    // retry to last transaction
                    status = "failure";

                    // if ((!web3.currentProvider.isMetaMask)
                    //     && ("http://localhost:7545" == web3.currentProvider.host)) {
                    //     // ganache (workaround)
                    //     // lock -- DOTO
                    //     let finished = handler[openNextChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                    //     if (finished) {
                    //         return;
                    //     }
                    //     // unlock -- DOTO
                    // } else {
                        // geth or metamask
                    handler[openChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
                    // }
                }

                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(outputElement, 'small', 'red', string);
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(outputElement, 'small', 'red', string);
            }
        } else {
            handler[openChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
            Output(outputElement, 'small', 'red', error);
        }        
    }

    [openChannel](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement) {
        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        if (blockCount < blockIndex) {
            return;
        }

        let index = window.channelClass.find(account);
        let size = window.channelClass.size();
        if (size == index) {
            return;
        }

        window.channelClass.status(index, "busy");

        switch (data[blockIndex].type) {
            case "update":
                logisticsCore.update(account, key, 
                    data[blockIndex].num, data[blockIndex].transNum,
                    data[blockIndex].model, data[blockIndex].destinationCountry,
                    data[blockIndex].lastStatus, data[blockIndex].tracks, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateEx":
                logisticsCore.updateEx(account, key, data[blockIndex].num, data[blockIndex].info, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateBrief":
                logisticsCore.updateBrief(account, key,
                    data[blockIndex].num, data[blockIndex].transNum,
                    data[blockIndex].model, data[blockIndex].destinationCountry,
                    data[blockIndex].lastStatus, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateBriefEx":
                logisticsCore.updateBriefEx(account, key, data[blockIndex].num, data[blockIndex].info, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateTracks":
                logisticsCore.updateTracks(account, key, data[blockIndex].num, data[blockIndex].info, 1, function(error, result) {
                    handler[openChannelFunc](handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            default:
                Output(outputElement, 'small', 'red', "Command Type Error!");
                break;
        }
    }

    [closeChannel](account) {
        let index = window.channelClass.find(account);
        let size = window.channelClass.size();
        if (size == index) {
            return;
        }

        window.channelClass.status(index, "idle");
    }

    dummyData(para1, para2) {
        console.log('TestLogisticsRaw.dummyData(%s, %s)', para1, para2);
        // Analytics, Amount
        let data;
        let blockCount;
        let outputElement;

        let logisticsTestData = new LogisticsTestData();

        switch (para1) {
            case "Analytics":
                outputElement = window.outputAnalyticsElement;
                if ("Amount" == para2) {
                    data = logisticsTestData.buildAnalyticsAmountData();
                    blockCount = data.length;
                } else {
                    Output(outputElement, 'small', 'red', "Command Error!");
                    return;
                }
                break;
            case "Test":
                outputElement = window.outputCommonElement;
                if ("Create" == para2) {
                    data = logisticsTestData.buildTestCreateData();
                    blockCount = data.length;
                } else if ("Update" == para2) {
                    data = logisticsTestData.buildTestUpdateData();
                    blockCount = data.length;
                } else {
                    Output(outputElement, 'small', 'red', "Command Error!");
                    return;
                }
                break;
            default:
                return;
        }

        let parallelCount = 0;
        let channelIdles = window.channelClass.get("idle");

        if (0 == channelIdles.length) {
            Output(outputElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        if (blockCount > channelIdles.length) {
            parallelCount = channelIdles.length;
            this[nextIndex] = channelIdles.length;
        } else {
            parallelCount = blockCount;
            this[nextIndex] = blockCount;
        }

        // start tick
        this[tick] = (new Date()).valueOf();

        for (let blockIndex=0; blockIndex<parallelCount; blockIndex++) {
            let account = channelIdles[blockIndex].account;
            let key = channelIdles[blockIndex].key;
            this[openChannel](this, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
        }
    }

    debugBrief() {
        console.log('TestLogisticsRaw.debugBrief()');
        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        // number
        logisticsCore.number(function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    // getBriefExByIndex
                    // logisticsCore.getBriefByIndex(i, function(error, index, result) {
                    logisticsCore.getBriefExByIndex(i, function(error, index, result) {
                        if (!error) {
                            // console.log(result);
                            Output(window.outputCommonElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                        } else {
                            Output(window.outputCommonElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                        }
                    })
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', error);
            }
        })
    }

    update(type, para) {
        console.log('TestLogisticsRaw.update(%s)', type);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        if (type == "All") {
            let paras = para.split(",^,");
            let num = paras[0];
            let transNum = paras[1];
            let model = paras[2];
            let destinationCountry = paras[3];
            let lastStatus = paras[4];
            let tracks = paras[5];

            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.update(account, key, num, transNum, model, destinationCountry, lastStatus, tracks, function(error, result) {
                handler[commmonTransactionProc](error, result, window.outputWriteElement);
            });
        } else if (type == "Tracks") {
            Output(window.outputWriteElement, 'small', 'red', "Don't support now!");
        } else {
            Output(window.outputWriteElement, 'small', 'red', "Update type Error!");
        }
    }

    [removeBatch](account, key, handler) {
        console.log('TestLogisticsRaw.removeBatch()');

        // create and update at first

        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
        logisticsCore.remove(account, key, "JNTCU0600046684YQ", function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x0 == parseInt(result.status)) {
                        let status = "failure";
                        let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                        Output(window.outputCommonElement, 'small', 'red', string);
                        return;
                    }
                    logisticsCore.remove(account, key, "JNTCU0600046688YQ", function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputCommonElement);
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputCommonElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', error);
            }
        });
    }

    remove(type, para) {
        console.log('TestLogisticsRaw.remove(%s, %s)', type, para);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        if (type == "Common") {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.remove(account, key, para, function(error, result) {
                handler[commmonTransactionProc](error, result, window.outputWriteElement);
            });
        } else if (type == "Batch") {
            this[removeBatch](account, key, this);
        } else {
            Output(window.outputWriteElement, 'small', 'red', "Remove type Error!");
        }
    }

    [getInvalid](handler, num) {
        handler.numberOfInvalid(num, function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    // handler.getBriefInvalid(num, i, function(error, num, index, result) {
                    handler.getTracksInvalid(num, i, function(error, num, index, result) {
                        if (!error) {
                            // console.log(result);
                            Output(window.outputCommonElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                        } else {
                            Output(window.outputCommonElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                        }
                    })
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
            }
        })
    }

    // invalid -> update -> invalid -> updateEx -> invalid
    [invalidBatch](account, key, handler) {
        console.log('TestLogisticsRaw.invalidBatch()');
        let tracks5_invalid1 = "{\"trackElementList\":[{\"time\":\"1543830482\",\"facilityName\":\"invalid(1-1)\",\"desc\":\"invalid(1-1)\"}&{\"time\":\"1543830482\",\"facilityName\":\"invalid(1-2)\",\"desc\":\"invalid(1-2) Груз отправлен со склада хранения (<a href= >КСЭ</a>, номер накладной <a href=$f=$http://cse.ru/track.php?order=waybill%amp;number=JNTCU0600639867YQ$ tar target=$_blank$>JNTCU0600639867YQ</a>)\"}]}";
        let info5_invalid2 = "{\"error\":null,\"num\":\"JNTCU0600046685YQ\",\"transNum\":\"invalid(2) 上海市宜山路900号科技大楼A栋6楼，邮编：200233\",\"model\":\"invalid(2) J-NET俄全通INFO5\",\"destinationCountry\":\"07\",\"lastStatus\":\"23\",\"trackElementList\":[{\"type\":\"1\",\"time\":\"1543830694\",\"country\":\"0086\",\"city\":\"021\",\"facilityName\":\"invalid(2-1)\",\"timeZone\":\"1543830694\",\"desc\":\"invalid(2-1) Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"21\"}&{\"type\":\"0\",\"time\":\"1543830694\",\"country\":\"021\",\"city\":\"0571\",\"facilityName\":\"invalid(2-2)\",\"timeZone\":\"+3\",\"desc\":\"invalid(2-2) Order received successfully\",\"actionCode\":\"22\"}&{\"type\":\"1\",\"time\":\"1543830694\",\"country\":\"007\",\"city\":\"0724\",\"facilityName\":\"invalid(2-3)\",\"timeZone\":\"-7\",\"desc\":\"invalid(2-3) The parcel is ready to transfer to the courier\",\"actionCode\":\"23\"}]}";
        
        let status = "";
        let string = "";

        let num = "JNTCU0600046685YQ";

        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        // invalid
        logisticsCore.invalid(account, key, num, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x0 == parseInt(result.status)) {
                        status = "failure";
                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                        Output(window.outputCommonElement, 'small', 'red', string);
                        return;
                    }

                    // update
                    logisticsCore.update(account, key, num, "invalid(1)", "invalid(1)", 7, 12, tracks5_invalid1, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if (0x0 == parseInt(result.status)) {
                                    status = "failure";
                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                    Output(window.outputCommonElement, 'small', 'red', string);
                                    return;
                                }
                                // invalid
                                logisticsCore.invalid(account, key, num, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if (0x0 == parseInt(result.status)) {
                                                status = "failure";
                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                Output(window.outputCommonElement, 'small', 'red', string);
                                                return;
                                            }
                                            // invalid
                                            // logisticsCore.invalid(account, key, num, function(error, result) {
                                            //     if (!error) {
                                            //         if ("" != result.status) {
                                            //             if (0x0 == parseInt(result.status)) {
                                            //                 status = "failure";
                                            //                 string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            //                 Output(window.outputCommonElement, 'small', 'red', string);
                                            //                 return;
                                            //             }
                                                        // updateEx
                                                        logisticsCore.updateEx(account, key, "JNTCU0600046685YQ", info5_invalid2, function(error, result) {
                                                            if (!error) {
                                                                if ("" != result.status) {
                                                                    if (0x0 == parseInt(result.status)) {
                                                                        status = "failure";
                                                                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                        Output(window.outputCommonElement, 'small', 'red', string);
                                                                        return;
                                                                    }
                                                                    // invalid
                                                                    logisticsCore.invalid(account, key, num, function(error, result) {
                                                                        if (!error) {
                                                                            if ("" != result.status) {
                                                                                if (0x0 == parseInt(result.status)) {
                                                                                    status = "failure";
                                                                                } else {
                                                                                    status = "succeeded";
                                                                                }
                                                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                                Output(window.outputCommonElement, 'small', 'red', string);
                                                                                if (0x1 == parseInt(result.status)) {
                                                                                    handler[getInvalid](logisticsCore, num);
                                                                                }
                                                                            } else {
                                                                                status = "Try to get status again!";
                                                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                                Output(window.outputCommonElement, 'small', 'red', string);
                                                                            }
                                                                        } else {
                                                                            Output(window.outputCommonElement, 'small', 'red', error);
                                                                        }
                                                                    });
                                                                } else {
                                                                    status = "Try to get status again!";
                                                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputCommonElement, 'small', 'red', string);
                                                                }
                                                            } else {
                                                                Output(window.outputCommonElement, 'small', 'red', error);
                                                            }
                                                        });
                                            //         } else {
                                            //             status = "Try to get status again!";
                                            //             string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            //             Output(window.outputCommonElement, 'small', 'red', string);
                                            //         }
                                            //     } else {
                                            //         Output(window.outputCommonElement, 'small', 'red', error);
                                            //     }
                                            // });
                                        } else {
                                            status = "Try to get status again!";
                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputCommonElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputCommonElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                status = "Try to get status again!";
                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputCommonElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputCommonElement, 'small', 'red', error);
                        }
                    });
                } else {
                    status = "Try to get status again!";
                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputCommonElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputCommonElement, 'small', 'red', error);
            }
        });
    }

    invalid(type, para) {
        console.log('TestLogisticsRaw.invalid(%s, %s)', type, para);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        if (type == "Common") {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.invalid(account, key, para, function(error, result) {
                handler[commmonTransactionProc](error, result, window.outputWriteElement);
            });
        } else if (type == "Batch") {
            this[invalidBatch](account, key, this);
        } else {
            Output(window.outputWriteElement, 'small', 'red', "Invalid type Error!");
        }
    }

    getNumber(type, para) {
        console.log('TestLogisticsRaw.getNumber(%s)', type);
        let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);

        if ("Num" == type) {
            // logisticsCore.numberOfTracks("JNTCU0600046685YQ", function(error, result) {
            logisticsCore.number(function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Number]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            })             
        } else if ("Tracks" == type) {
            // logisticsCore.numberOfTracks("JNTCU0600046685YQ", function(error, result) {
            logisticsCore.numberOfTracks(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Number]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            })   
        } else if ("Invalid" == type) {
            logisticsCore.numberOfInvalid(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Number]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            })   
        }
    }

    getInfo(type, para) {
        console.log('TestLogisticsRaw.getInfo(%s, %s)', type, para);
        
        if ('LogisticsInfo' == type) {
            let logistics = new Logistics(this[abi], this[contractAddress]);
            logistics.getLogisticsInfo(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Info]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('Parcel' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getParcel(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Parcel]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('ParcelEx' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getParcelEx(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Parcel]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });           
        } else if ('Tracks' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getTracks(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Tracks]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('TrackElement' == type) {
            let tmps = para.split(",");
            let num = tmps[0];
            let index = tmps[1];
            let tag = tmps[2];
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getTrackElementByIndex(num, index, tag, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Element]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('TracksInvalid' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            let paras = para.split(",");
            let num = paras[0];
            let index = paras[1];

            logisticsCore.getTracksInvalid(num, index, function(error, num, index, result) {
                if (!error) {
                    // console.log(result);
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                }
            })
        } else if ('Brief' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBrief(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('BriefEx' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefEx(para, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief]:${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });           
        } else if ('BriefByIndex' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefByIndex(para, function(error, index, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                }
            });
        } else if ('BriefExByIndex' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefExByIndex(para, function(error, index, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                }
            });
        } else if ('BriefElement' == type) {
            let tmps = para.split(",");
            let num = tmps[0];
            let tag = tmps[1];
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefElement(num, tag, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Element]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('BriefElementByIndex' == type) {
            let tmps = para.split(",");
            let index = tmps[0];
            let tag = tmps[1];
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            logisticsCore.getBriefElementByIndex(parseInt(index), tag, function(error, result) {
                if (!error) {
                    Output(window.outputReadElement, 'small', 'red', `[Element]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', error);
                }
            });
        } else if ('BriefInvalid' == type) {
            let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
            let paras = para.split(",");
            let num = paras[0];
            let index = paras[1];

            logisticsCore.getBriefInvalid(num, index, function(error, num, index, result) {
                if (!error) {
                    // console.log(result);
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                } else {
                    Output(window.outputReadElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                }
            })
        } else {}
    }

    [getDelegateInstance](contract) {
        let delegate = null;
        if ("Logistics" == contract) {
            delegate = new Delegate(this[abi], this[contractAddress]);
        } else if ("LogisticsCore" == contract) {
            delegate = new Delegate(this[coreAbi], this[coreContractAddress]);
        } else if ("LogisticsDatabase" == contract) {
            delegate = new Delegate(this[databaseAbi], this[databaseContractAddress]);
        } else {}

        return delegate;       
    }

    delegate(cmds, paras) {
        console.log('TestLogisticsRaw.delegate(%s; %s)', cmds, paras);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputDelegateWriteElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        tmps = cmds.split(",");
        let cmd = tmps[0];
        let contract = tmps[1];

        let delegate = this[getDelegateInstance](contract);
        if (null == delegate) {
            Output(window.outputDelegateReadElement, 'small', 'red', "Delegate instance Error!");
            return;
        }

        switch (cmd) {
            case "Debug":
                // number
                delegate.number(function(error, result) {
                    if (!error) {
                        let sum = result;
                        let logs = "";
                        let count = 0;
                        for (let i=0; i<sum; i++) {
                            delegate.getInfoById(i, function(error, id, result) {
                                if (!error) {
                                    logs = logs.concat(`[Delegate${id}]: ${result}</br>`);
                                    count ++;
                                    if (count == sum) {
                                        Output(window.outputDelegateReadElement, 'small', 'red', logs);
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
                tmps = paras.split(",");
                let address = tmps[0];
                let priority = tmps[1];

                if (undefined == priority) {
                    Output(window.outputDelegateWriteElement, 'small', 'red', "Please input priority!");
                    return;
                }

                // update
                delegate.update(account, key, address, priority, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputDelegateWriteElement);
                });

                break;
            case "Remove":
                // remove
                delegate.remove(account, key, paras, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputDelegateWriteElement);
                });
                break;
            case "Transfer":
                // transferOwnership
                delegate.transferOwnership(account, key, paras, 2, function(error, result) {
                    handler[commmonTransactionProc](error, result, window.outputDelegateWriteElement);
                });                
                break;
            default:
                Output(window.outputDelegateReadElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    [getTimeStamp](year, month) {
        let start = "";
        let end = "";
        let date;
        let startTime = 0;
        let endTime = 0;

        if ("0" == year) {
            return new Array(0, 0);
        } else {
            start = start.concat(year, "-", month, "-01 00:00:00");
            date = new Date(parseInt(year), parseInt(month), 0);
            end = end.concat(year, "-", month, "-", date.getDate().toString(10), " 23:59:59");

            date = new Date(start);
            startTime = date.getTime()/1000;

            date = new Date(end);
            endTime = date.getTime()/1000; 

            return new Array(startTime, endTime);
        }
    }

    analytics(cmd, paras) {
        console.log('TestLogisticsRaw.Analytics(%s, %s)', cmd, paras);
        let handler = this;
        let tmps = this[getCommonAccount]();
        if (0 == tmps[0]) {
            Output(window.outputAnalyticsElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = tmps[0];
        let key = tmps[1];

        switch (cmd) {
            case "ActionCode":
                let tmps = paras.split(",");
                let op = tmps[0];

                if ("Set" == op) {
                    let tag = tmps[1];
                    let actionCode = tmps[2];
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.setActionCode(account, key, tag, parseInt(actionCode), function(error, result) {
                        handler[commmonTransactionProc](error, result, window.outputAnalyticsElement);
                    });
                } else if ("Get" == op) {
                    let tag = tmps[1];
                    let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                    logisticsAnalytics.getActionCode(tag, function(error, result) {
                        if (!error) {
                            Output(window.outputAnalyticsElement, 'small', 'red', `[ActionCode]:${result}`);
                        } else {
                            Output(window.outputAnalyticsElement, 'small', 'red', error);
                        }
                    })  
                } else {
                    Output(window.outputAnalyticsElement, 'small', 'red', "Command Error!");
                }
                break;
            case "Amount":
                let para = paras.split(",");
                let srcCountry = para[0];
                let destCountry = para[1];

                let date = this[getTimeStamp](para[2], para[3]);
                let startTime = date[0];
                let endTime = date[1];

                let logisticsAnalytics = new LogisticsAnalytics(this[analyticsAbi], this[analyticsContractAddress]);
                logisticsAnalytics.getParcelAmount(parseInt(srcCountry), parseInt(destCountry), startTime, endTime, function(error, result) {
                    if (!error) {
                        Output(window.outputAnalyticsElement, 'small', 'red', `[Amount]:${result}`);
                    } else {
                        Output(window.outputAnalyticsElement, 'small', 'red', error);
                    }
                })
                break;
            default:
                Output(window.outputAnalyticsElement, 'small', 'red', "Command Error!");
                break;
        }
    }

    do(operation, para1, para2) {
        console.log('TestLogisticsRaw.do(%s, %s, %s)', operation, para1, para2);
        switch(operation) {
            case 'Deploy':
                this.deploy(para1);
                break;
            case 'Setup':
                this.setup(para1, para2);
                break;
            case 'DummyData':
                this.dummyData(para1, para2);
                break;
            case 'DebugBrief':
                this.debugBrief();
                break;
            case 'Update':
                this.update(para1, para2);
                break;
            case 'Remove':
                this.remove(para1, para2);
                break;
            case 'Invalid':
                this.invalid(para1, para2);
                break;
            case 'GetNumber':
                this.getNumber(para1, para2);
                break;
            case 'GetInfo':
                this.getInfo(para1, para2);
                break;
            case 'Delegate':
                this.delegate(para1, para2);
                break;
            case 'Analytics':
                this.analytics(para1, para2);
            default:
                Output(window.outputCommonElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}