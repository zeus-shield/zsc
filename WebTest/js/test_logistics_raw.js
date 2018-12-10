
import Output from './output.js';
import Transaction from './transaction_raw.js';
import Delegate from './delegate.js';
import Logistics from './logistics.js';
import LogisticsCore from './logistics_core.js';

//private member
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');

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
// const openChannelFunc = Symbol('openChannelFunc');
// const openChannel = Symbol('openChannel');
// const openNextChannel = Symbol('openNextChannel');
const closeChannel = Symbol('closeChannel');
const removeBatch = Symbol('removeBatch');
const getInvalid = Symbol('getInvalid');
const invalidBatch = Symbol('invalidBatch');
const getDelegateInstance = Symbol('getDelegateInstance');

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

    [closeChannel](account) {
        let index = window.channelClass.find(account);
        let size = window.channelClass.size();
        if (size == index) {
            return;
        }

        window.channelClass.status(index, "idle");
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
                } else if ("LogisticsCore" == contractName) {
                    let logisticsCore = new LogisticsCore(this[coreAbi], this[coreContractAddress]);
                    logisticsCore.getDatabaseAddr(account, function(error, result) {
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

    buildTestUpdateData() {
        let num8 = "JNTCU0600046688YQ";
        let transNum8 = "MSK0000027698";
        let model8 = "上海德铎泰信息科技有限公司 上海市闵行区宜山路2016号合川大厦6H"; 
        let destinationCountry8 = 7;
        let lastStatus8 = 38;

        let num9 = "JNTCU0600046689YQ";
        let brief9 =
            "{" +
                "\"error\":null," +
                "\"num\":\"JNTCU0600046689YQ\"," +
                "\"transNum\":\"MSK0000027699\"," +
                "\"model\":\"J-NET俄全通INFO9\"," +
                "\"destinationCountry\":\"07\"," +
                "\"lastStatus\":\"10\"" +
            "}";

        let num5 = "JNTCU0600046685YQ";
        let newTracks5 =
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"1\"," +
                    "\"time\":\"1543804012\"," +
                    "\"country\":\"07\"," +
                    "\"city\":\"0021\"," +
                    "\"facilityName\":\"NewTrack5-1\"," +
                    "\"timeZone\":\"-3\"," +
                    "\"desc\":\"上海德铎泰信息科技有限公司 上海市闵行区宜山路2016号合川大厦6H\"," +
                    "\"actionCode\":\"18\"" +
                "}&{" +
                    "\"type\":\"0\"," +
                    "\"time\":\"1543804509\"," +
                    "\"country\":\"007\"," +
                    "\"city\":\"021\"," +
                    "\"facilityName\":\"NewTrack5-2\"," +
                    "\"timeZone\":\"+3\"," +
                    "\"desc\":\"NewTrack5-2\"," +
                    "\"actionCode\":\"88\"" +
                "}]" +
            "}";

        let data = new Array();

        data.push({
                    type: "updateBrief",
                    num: num8,
                    transNum: transNum8,
                    model: model8,
                    destinationCountry: destinationCountry8,
                    lastStatus: lastStatus8
                });
        data.push({
                    type: "updateBriefEx",
                    num: num9,
                    info: brief9
                });
        data.push({
                    type: "updateTracks",
                    num: num5,
                    info: newTracks5
                });

        return data;
    }

    buildAnalyticsAmountData() {
        // 中国(t0) -> 俄罗斯(t1)，签收
        let num0 = "JNTCU0600046683YQ";
        let transNum0 = "订单描述：（中国 -> 俄罗斯，签收）";
        let model0 = "J-NET俄全通：（Russia, GTMS_SIGNED）"; 
        let destinationCountry0 = 7; // Russia
        let lastStatus0 = 28;        // GTMS_SIGNED("用户签收","Delivered")
        let tracks0 = 
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"01\"," +            // OC
                    "\"time\":\"1537924497\"," +    // 2018-09-26 09:14:57
                    "\"country\":\"086\"," +        // China
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(0) -> track(0)描述：（OC, 2018-09-26 09:14:57, China, PU_PICKUP_SUCCESS）\"," +
                    "\"timeZone\":\"+8\"," +        // +8
                    "\"desc\":\"上海市闵行区宜山路2016号合川大厦6H上海德铎泰信息科技有限公司揽件成功！\"," +
                    "\"actionCode\":\"001\"" +      // PU_PICKUP_SUCCESS("揽收成功","Item picked up by courier")
                "}&{" +
                    "\"type\":\"02\"," +            // DC
                    "\"time\":\"1539854640\"," +    // 2018-10-18 17:24:00
                    "\"country\":\"07\"," +         // Russia
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(1) -> track(1)描述：（DC, 2018-10-18 17:24:00, Russia, GTMS_SIGNED）\"," +
                    "\"timeZone\":\"+3\"," +        // +3
                    "\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\"," +
                    "\"actionCode\":\"028\"" +      // GTMS_SIGNED("用户签收","Delivered")
                "}]" +
            "}";
        
        // 中国(t1) -> 美国(t2) -> 俄罗斯(t0)，签收
        let num1 = "JNTCU0600046684YQ";
        let info1 = 
            "{" +
                "\"error\":null," +
                "\"num\":\"JNTCU0600046684YQ\"," +
                "\"transNum\":\"订单描述：（中国 -> 美国 -> 俄罗斯，签收）\"," +
                "\"model\":\"J-NET俄全通：（Russia, GTMS_SIGNED）\"," +
                "\"destinationCountry\":\"07\"," +  // Russia
                "\"lastStatus\":\"028\"," +         // GTMS_SIGNED("用户签收","Delivered")
                "\"trackElementList\":[{" +
                    "\"type\":\"02\"," +            // DC 
                    "\"time\":\"1538797740\"," +    // 2018-10-06 11:49:00
                    "\"country\":\"07\", " +        // Russia
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(2) -> track(0)描述：（DC, 2018-10-06 11:49:00, Russia, GTMS_SIGNED）\"," +
                    "\"timeZone\":\"+3\"," +        // +3
                    "\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\"," +
                    "\"actionCode\":\"028\"" +      // GTMS_SIGNED("用户签收","Delivered")
                "}&{" +
                    "\"type\":\"1\"," +             // OC
                    "\"time\":\"1537924497\"," +    // 2018-09-26 09:14:57
                    "\"country\":\"86\"," +         // China
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(0) -> track(1)描述：（OC, 2018-09-26 09:14:57, China, PU_PICKUP_SUCCESS）\"," +
                    "\"timeZone\":\"+8\", " +       // +8
                    "\"desc\":\"上海市闵行区宜山路2016号合川大厦6H上海德铎泰信息科技有限公司揽件成功！\"," +
                    "\"actionCode\":\"1\"" +        // PU_PICKUP_SUCCESS("揽收成功","Item picked up by courier")
                "}&{" +
                    "\"type\":\"002\"," +           // DC
                    "\"time\":\"1538365740\"," +    // 2018-10-01 11:49:00
                    "\"country\":\"007\"," +        // USA
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(1) -> track(2)描述：（DC, 2018-10-01 11:49:00, USA, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"-5\"," +        // -5
                    "\"desc\":\"The parcel is ready to transfer to the courier\"," +
                    "\"actionCode\":\"0037\"" +     // VISIBLE_UNKOWN("转运","transfer")     
                "}]" +
            "}";
        
        // 中国(t3) -> 法国(t1) -> 美国(t0) -> 俄罗斯(t2)，转运中
        let num2 = "JNTCU0600046685YQ";
        let transNum2 = "订单描述：（中国 -> 法国 -> 美国 -> 俄罗斯，转运中）";
        let model2 = "J-NET俄全通：（Russia, VISIBLE_UNKOWN）"; 
        let destinationCountry2 = 7;                // Russia
        let lastStatus2 = 37;                       // VISIBLE_UNKOWN("转运","transfer")
        let tracks2 =
            "{" +
                "\"trackElementList\":[{" +
                    "\"type\":\"2\"," +             // DC
                    "\"time\":\"1541991540\"," +    // 2018-11-12 10:59:00
                    "\"country\":\"1\"," +          // USA
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(2) -> track(0)描述：（DC, 2018-11-12 10:59:00, USA, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"-5\"," +        // -5
                    "\"desc\":\"International shipment release - Export\"," +
                    "\"actionCode\":\"37\"" +       // VISIBLE_UNKOWN("转运","transfer")
                "}&{" +
                    "\"type\":\"2\"," +             // DC
                    "\"time\":\"1541813640\"," +    // 2018-11-10 09:34:00
                    "\"country\":\"33\"," +         // France
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(1) -> track(1)描述：（DC, 2018-11-10 09:34:00, France, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"+0\"," +        // +0
                    "\"desc\":\"Transport de marchandises\"," +
                    "\"actionCode\":\"37\"" +       // VISIBLE_UNKOWN("转运","transfer")
                "}&{" +
                    "\"type\":\"2\"," +             // DC
                    "\"time\":\"1542079440\"," +    // 2018-11-13 11:24:00
                    "\"country\":\"7\"," +          // Russia
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(3) -> track(2)描述：（DC, 2018-11-13 11:24:00, Russia, VISIBLE_UNKOWN）\"," +
                    "\"timeZone\":\"+3\"," +        // +3
                    "\"desc\":\"Принят на транзитный склад\"," +      
                    "\"actionCode\":\"37\"" +       // VISIBLE_UNKOWN("转运","transfer")
                "}&{" +
                    "\"type\":\"1\"," +             // OC
                    "\"time\":\"1540966156\"," +    // 2018-10-31 14:09:16
                    "\"country\":\"86\"," +         // China
                    "\"city\":\"\"," +
                    "\"facilityName\":\"time(0) -> track(3)描述：（OC, 2018-10-31 14:09:16, China, PU_PICKUP_SUCCESS）\"," +
                    "\"timeZone\":\"+8\"," +        // +8
                    "\"desc\":\"上海市闵行区宜山路2016号合川大厦6H上海德铎泰信息科技有限公司揽件成功！\"," +      
                    "\"actionCode\":\"1\"" +       // PU_PICKUP_SUCCESS("揽收成功","Item picked up by courier")
                "}]" +
            "}";

        let data = new Array();

        data.push({
                    type: "update",
                    num: num0,
                    transNum: transNum0,
                    model: model0,
                    destinationCountry: destinationCountry0,
                    lastStatus: lastStatus0,
                    tracks: tracks0
                });
        data.push({
                    type: "updateEx",
                    num: num1,
                    info: info1
                });
        data.push({
                    type: "update",
                    num: num2,
                    transNum: transNum2,
                    model: model2,
                    destinationCountry: destinationCountry2,
                    lastStatus: lastStatus2,
                    tracks: tracks2
                });

        return data;
    }

    openNextChannelEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result) {
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
            handler.openChannelEx(handler, account, key, data, parallelCount, handler[nextIndex], blockCount, outputElement);
            handler[nextIndex] ++;
        }

        return false;
    }

    openChannelFuncEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result) {
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
                    let finished = handler.openNextChannelEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
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
                    //     let finished = handler.openNextChannelEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                    //     if (finished) {
                    //         return;
                    //     }
                    //     // unlock -- DOTO
                    // } else {
                        // geth or metamask
                    handler.openChannelEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
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
            handler.openChannelEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
            Output(outputElement, 'small', 'red', error);
        }        
    }

    openChannelEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement) {
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
                    handler.openChannelFuncEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateEx":
                logisticsCore.updateEx(account, key, data[blockIndex].num, data[blockIndex].info, function(error, result) {
                    handler.openChannelFuncEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateBrief":
                logisticsCore.updateBrief(account, key,
                    data[blockIndex].num, data[blockIndex].transNum,
                    data[blockIndex].model, data[blockIndex].destinationCountry,
                    data[blockIndex].lastStatus, function(error, result) {
                    handler.openChannelFuncEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateBriefEx":
                logisticsCore.updateBriefEx(account, key, data[blockIndex].num, data[blockIndex].info, function(error, result) {
                    handler.openChannelFuncEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            case "updateTracks":
                logisticsCore.updateTracks(account, key, data[blockIndex].num, data[blockIndex].info, 1, function(error, result) {
                    handler.openChannelFuncEx(handler, account, key, data, parallelCount, blockIndex, blockCount, outputElement, error, result);
                });
                break;
            default:
                Output(outputElement, 'small', 'red', "Command Type Error!");
                break;
        }
    }

    dummyData(para1, para2) {
        console.log('TestLogisticsRaw.dummyData(%s, %s)', para1, para2);
        // Analytics, Amount
        let data;
        let blockCount;
        let outputElement;

        switch (para1) {
            case "Analytics":
                outputElement = window.outputAnalyticsElement;
                if ("Amount" == para2) {
                    data = this.buildAnalyticsAmountData();
                    blockCount = data.length;
                } else {
                    Output(outputElement, 'small', 'red', "Command Error!");
                    return;
                }
                break;
            case "Test":
                outputElement = window.outputCommonElement;
                if ("Create" == para2) {
                    data = this.buildTestCreateData();
                    blockCount = data.length;
                } else if ("Update" == para2) {
                    data = this.buildTestUpdateData();
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
            this.openChannelEx(this, account, key, data, parallelCount, blockIndex, blockCount, outputElement);
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

    analytics(cmd, paras) {
        console.log('TestLogisticsRaw.Analytics(%s, %s)', cmd, paras);

        switch (cmd) {
            case "Amount":
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