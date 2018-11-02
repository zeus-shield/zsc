
import Output from './output.js';
import Transaction from './transaction_raw.js';
import Logistics from './logistics_raw.js';

//private member
const compiledJson = Symbol('compiledJson');
const abi = Symbol('abi');
const contractAddress = Symbol('contractAddress');

const coreAbi = Symbol('coreAbi');
const coreContractAddress = Symbol('coreContractAddress');

const nextIndex = Symbol('nextIndex');
const tick = Symbol('tick');

//private function
const sleep = Symbol('sleep');
const openChannelFunc = Symbol('openChannelFunc');
const openChannel = Symbol('openChannel');
const openNextChannel = Symbol('openNextChannel');
const closeChannel = Symbol('closeChannel');
const getInvalid = Symbol('getInvalid');

export default class TestLogisticsRaw {

    constructor() {
        this[compiledJson] = '';
        this[abi] = '';
        this[contractAddress] = '';
        // this[abi] = [{"constant":false,"inputs":[{"name":"_num","type":"string"}],"name":"remove","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_info","type":"string"}],"name":"updateEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"string"},{"name":"_lastStatus","type":"string"},{"name":"_tracks","type":"string"}],"name":"update","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_transNum","type":"string"},{"name":"_model","type":"string"},{"name":"_destinationCountry","type":"string"},{"name":"_lastStatus","type":"string"}],"name":"updateBrief","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_brief","type":"string"}],"name":"updateBriefEx","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_num","type":"string"},{"name":"_tracks","type":"string"},{"name":"_updateType","type":"uint256"}],"name":"updateTracks","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getBrief","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getBriefByIndex","outputs":[{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"},{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getBriefEx","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_index","type":"uint256"}],"name":"getBriefExByIndex","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"getTracks","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"number","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_num","type":"string"}],"name":"numberOfTracks","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"}];
        // this[contractAddress] = "0x9cb887f15245628f79e9bfdbd719753d7ffa6d86";
        this[coreAbi] = '';
        this[coreContractAddress] = '';
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

    [openNextChannel](cmd, handler, account, key, parallelCount, blockIndex, blockCount, error, result) {
        if (blockCount == handler[nextIndex]) {
            // no block will proc, close channel
            handler[closeChannel](account);

            // if all the channel is idle, all the block finished
            let channels = window.channelClass.get("idle");
            if (window.channelClass.size() == channels.length) {
                // finish the all the block
                let ticks = (new Date()).valueOf() - handler[tick];
                let string = `Finish all(cost: ${ticks}ms).`;
                Output(window.outputOperationElement, 'small', 'red', string);
                return true;
            }
        } else {
            handler[openChannel](cmd, handler, account, key, parallelCount, handler[nextIndex], blockCount);
            handler[nextIndex] ++;
        }

        return false;
    }

    [openChannelFunc](cmd, handler, account, key, parallelCount, blockIndex, blockCount, error, result) {
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
                    let finished = handler[openNextChannel](cmd, handler, account, key, parallelCount, blockIndex, blockCount, error, result);
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
                    //     let finished = handler[openNextChannel](cmd, handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                    //     if (finished) {
                    //         return;
                    //     }
                    //     // unlock -- DOTO
                    // } else {
                        // geth or metamask
                    handler[openChannel](cmd, handler, account, key, parallelCount, blockIndex, blockCount);
                    // }
                }

                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(window.outputOperationElement, 'small', 'red', string);
            } else {
                let status = "Try to get status again!";
                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                Output(window.outputOperationElement, 'small', 'red', string);
            }
        } else {
            handler[openChannel](cmd, handler, account, key, parallelCount, blockIndex, blockCount);
            Output(window.outputOperationElement, 'small', 'red', error);
        }        
    }

    [openChannel](cmd, handler, account, key, parallelCount, blockIndex, blockCount) {
        // testing data(create)
        let tracks3 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"杭州\",\"facilityName\":\"Track3-1\",\"timeZone\":\"+3\",\"desc\":\"Track3-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track3-2\",\"timeZone\":\"+3\",\"desc\":\"Track3-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        let info4 = "{\"error\":null,\"num\":\"JNTCU0600046684YQ\",\"transNum\":\"MSK0000027694\",\"model\":\"J-NET俄全通INFO4\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Армавир\",\"timeZone\":\"+3\",\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        let tracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"杭州\",\"facilityName\":\"Track5-1\",\"timeZone\":\"+3\",\"desc\":\"Track5-1\",\"actionCode\":\"GTMS_SIGNED\"}}]}";
        let info6 = "{\"error\":null,\"num\":\"JNTCU0600046686YQ\",\"transNum\":\"MSK0000027696\",\"model\":\"J-NET俄全通INFO6\",\"destinationCountry\":\"China\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"China\",\"city\":\"HangZhou\",\"facilityName\":\"SF\",\"timeZone\":\"+3\",\"desc\":\"SF is good.\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"China\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"China\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        let tracks7 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"杭州\",\"facilityName\":\"Track6-1\",\"timeZone\":\"+3\",\"desc\":\"Track6-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-2\",\"timeZone\":\"+3\",\"desc\":\"Track6-2\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-3\",\"timeZone\":\"+3\",\"desc\":\"Track6-3\",\"actionCode\":\"GWMS_ACCEPT\"}]}";

        // testing data(update)
        let brief9 = "{\"error\":null,\"num\":\"JNTCU0600046689YQ\",\"transNum\":\"MSK0000027699\",\"model\":\"J-NET俄全通INFO9\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\"}";
        let newTracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"上海德铎泰信息科技有限公司 上海市闵行区宜山路2016号合川大厦6H\",\"facilityName\":\"NewTrack5-1\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"NewTrack5-2\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";

        let logistics = new Logistics(this[abi], this[contractAddress]);

        if (blockCount < blockIndex) {
            return;
        }

        let index = window.channelClass.find(account);
        let size = window.channelClass.size();
        if (size == index) {
            return;
        }

        window.channelClass.status(index, "busy");

        if ("create" == cmd) {
            if (0 == blockIndex) {
                logistics.update(account, key, "JNTCU0600046683YQ", "MSK0000027693", "J-NET俄全通INFO3", "Russian", "GTMS_SIGNED", tracks3, function(error, result) {
                    handler[openChannelFunc]("create", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else if (1 == blockIndex) {
                logistics.updateEx(account, key, "JNTCU0600046684YQ", info4, function(error, result) {
                    handler[openChannelFunc]("create", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else if (2 == blockIndex) {
                logistics.update(account, key, "JNTCU0600046685YQ", "MSK0000027695", "J-NET俄全通INFO5", "Russian", "GTMS_SIGNED", tracks5, function(error, result) {
                    handler[openChannelFunc]("create", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else if (3 == blockIndex) {
                logistics.updateEx(account, key, "JNTCU0600046686YQ", info6, function(error, result) {
                    handler[openChannelFunc]("create", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else if (4 == blockIndex) {
                logistics.update(account, key, "JNTCU0600046687YQ", "MSK0000027697", "J-NET俄全通INFO7", "Russian", "GTMS_SIGNED", tracks7, function(error, result) {
                    handler[openChannelFunc]("create", handler, account, key, parallelCount, blockIndex, blockCount, error, result);                                
                });
            } else {}
        } else if ("update" == cmd) {
             if (0 == blockIndex) {
                logistics.updateBrief(account, key, "JNTCU0600046688YQ", "MSK0000027698", "上海德铎泰信息科技有限公司 上海市闵行区宜山路2016号合川大厦6H", "Russian", "GTMS_SIGNED", function(error, result) {
                    handler[openChannelFunc]("update", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else if (1 == blockIndex) {
                logistics.updateBriefEx(account, key, "JNTCU0600046689YQ", brief9, function(error, result) {
                    handler[openChannelFunc]("update", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else if (2 == blockIndex) {
                logistics.updateTracks(account, key, "JNTCU0600046685YQ", newTracks5, 1, function(error, result) {
                    handler[openChannelFunc]("update", handler, account, key, parallelCount, blockIndex, blockCount, error, result);
                });
            } else {}           
        } else {}
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

        if ('LogisticsCore' == contractName) {
            elementId = window.outputDeployCoreElement;
        } else {
            elementId = window.outputDeployElement;
        }

        if (0 == channels.length) {
            Output(elementId, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

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
        if ('LogisticsCore' == contractName) {
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
                            if ('LogisticsCore' == contractName) {
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

    setup() {
        console.log('TestLogisticsRaw.setup()');

        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let status = "";
        let string = "";

        let logistics = new Logistics(this[abi], this[contractAddress]);

        logistics.setup(account, key, this[coreContractAddress], function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x1 == parseInt(result.status)) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }

                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputSetupElement, 'small', 'red', string);
                } else {
                    status = "Try to get status again!";
                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputSetupElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputSetupElement, 'small', 'red', error);
            }
        });
    }

    create() {
        console.log('TestLogisticsRaw.create()');
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let status = "";
        let string = "";

        // create testing data
        let info3 = "{\"error\":null,\"num\":\"JNTCU0600046683YQ\",\"transNum\":\"MSK0000027693\",\"model\":\"INFO3\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Армавир\",\"timeZone\":\"+3\",\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        let info6 = "{\"error\":null,\"num\":\"JNTCU0600046686YQ\",\"transNum\":\"MSK0000027696\",\"model\":\"INFO6\",\"destinationCountry\":\"China\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"China\",\"city\":\"HangZhou\",\"facilityName\":\"SF\",\"timeZone\":\"+3\",\"desc\":\"SF is good.\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"China\",\"city\":\"ShangHai\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"China\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        let tracks4 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track4-1\",\"timeZone\":\"+3\",\"desc\":\"Track4-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track4-2\",\"timeZone\":\"+3\",\"desc\":\"Track4-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        let tracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track5-1\",\"timeZone\":\"+3\",\"desc\":\"Track5-1\",\"actionCode\":\"GTMS_SIGNED\"}}]}";
        let tracks7 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track6-1\",\"timeZone\":\"+3\",\"desc\":\"Track6-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-2\",\"timeZone\":\"+3\",\"desc\":\"Track6-2\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track6-3\",\"timeZone\":\"+3\",\"desc\":\"Track6-3\",\"actionCode\":\"GWMS_ACCEPT\"}]}";

        let logistics = new Logistics(this[abi], this[contractAddress]);
        
        // updateEx
        logistics.updateEx(account, key, "JNTCU0600046683YQ", info3, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x1 == parseInt(result.status)) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }

                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);

                    // update
                    logistics.update(account, key, "JNTCU0600046684YQ", "MSK0000027694", "INFO4", "Russian", "GTMS_SIGNED", tracks4, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if (0x1 == parseInt(result.status)) {
                                    status = "succeeded";
                                } else {
                                    status = "failure";
                                }

                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);

                                // update
                                logistics.update(account, key, "JNTCU0600046685YQ", "MSK0000027695", "INFO5", "Russian", "GTMS_SIGNED", tracks5, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if (0x1 == parseInt(result.status)) {
                                                status = "succeeded";
                                            } else {
                                                status = "failure";
                                            }

                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputOperationElement, 'small', 'red', string);

                                            // updateEx
                                            logistics.updateEx(account, key, "JNTCU0600046686YQ", info6, function(error, result) {
                                                if (!error) {
                                                    if ("" != result.status) {
                                                        if (0x1 == parseInt(result.status)) {
                                                            status = "succeeded";
                                                        } else {
                                                            status = "failure";
                                                        }

                                                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                        Output(window.outputOperationElement, 'small', 'red', string);

                                                        // update
                                                        logistics.update(account, key, "JNTCU0600046687YQ", "MSK0000027697", "INFO7", "Russian", "GTMS_SIGNED", tracks7, function(error, result) {
                                                            if (!error) {
                                                                if ("" != result.status) {
                                                                    if (0x1 == (result.status)) {
                                                                        status = "succeeded";
                                                                    } else {
                                                                        status = "failure";
                                                                    }

                                                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputOperationElement, 'small', 'red', string);
                                                                } else {
                                                                    let status = "Try to get status again!";
                                                                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputOperationElement, 'small', 'red', string);
                                                                }
                                                            } else {
                                                                Output(window.outputOperationElement, 'small', 'red', error);
                                                            }
                                                        });
                                                    } else {
                                                        let status = "Try to get status again!";
                                                        let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                        Output(window.outputOperationElement, 'small', 'red', string);
                                                    }
                                                } else {
                                                    Output(window.outputOperationElement, 'small', 'red', error);
                                                }
                                            });
                                        } else {
                                            let status = "Try to get status again!";
                                            let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputOperationElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputOperationElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                let status = "Try to get status again!";
                                let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', error);
                        }
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        });
    }

    createParallel() {
        console.log('TestLogisticsRaw.createAnsync()');

        let channelIdles = window.channelClass.get("idle");
        // JNTCU0600046683YQ JNTCU0600046684YQ JNTCU0600046685YQ JNTCU0600046686YQ JNTCU0600046687YQ
        let blockCount = 5;
        let parallelCount = 0;

        if (0 == channelIdles.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
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
            this[openChannel]("create", this, account, key, parallelCount, blockIndex, blockCount);
        }
    }

    update() {
        console.log('TestLogisticsRaw.update()');
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let status = "";
        let string = "";

        // update testing data
        let brief9 = "{\"error\":null,\"num\":\"JNTCU0600046689YQ\",\"transNum\":\"MSK0000027699\",\"model\":\"INFO9\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\"}";
        let newTracks5 = "{\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"NewTrack5-1\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-1\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"NewTrack5-2\",\"timeZone\":\"+3\",\"desc\":\"NewTrack5-2\",\"actionCode\":\"GWMS_ACCEPT\"}]}";
        
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // updateBrief
        logistics.updateBrief(account, key, "JNTCU0600046688YQ", "MSK0000027698", "INFO8", "Russian", "GTMS_SIGNED", function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x1 == parseInt(result.status)) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }

                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);

                    // updateBriefEx
                    logistics.updateBriefEx(account, key, "JNTCU0600046689YQ", brief9, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if (0x1 == parseInt(result.status)) {
                                    status = "succeeded";
                                } else {
                                    status = "failure";
                                }

                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);

                                // updateTracks
                                logistics.updateTracks(account, key, "JNTCU0600046685YQ", newTracks5, 1, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if (0x1 == parseInt(result.status)) {
                                                status = "succeeded";
                                            } else {
                                                status = "failure";
                                            }

                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputOperationElement, 'small', 'red', string);
                                        } else {
                                            status = "Try to get status again!";
                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputOperationElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputOperationElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                status = "Try to get status again!";
                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', error);
                        }
                    });
                } else {
                    status = "Try to get status again!";
                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        });
    }

    updateParallel() {
        console.log('TestLogisticsRaw.updateSync()');

        let channelIdles = window.channelClass.get("idle");
        let blockCount = 3;
        let parallelCount = 0;

        if (0 == channelIdles.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
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
            this[openChannel]("update", this, account, key, parallelCount, blockIndex, blockCount);
        }
    }

    get(type, para) {
        console.log('TestLogisticsRaw.get(%s, %s)', type, para);
        let logistics = new Logistics(this[abi], this[contractAddress]);

        if ('Tracks' == type) {
            // logistics.getTracks("JNTCU0600046685YQ", function(error, result) {
            logistics.getTracks(para, function(error, result) {
                if (!error) {
                    Output(window.outputOperationElement, 'small', 'red', `[Tracks]:</br>${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', error);
                }
            });
        } else if ('TracksInvalid' == type) {
            let paras = para.split(",");
            let num = paras[0];
            let index = paras[1];

            logistics.getTracksInvalid(num, index, function(error, num, index, result) {
                if (!error) {
                    // console.log(result);
                    Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                }
            })
        } else if ('Brief' == type) {
            // logistics.getBrief("JNTCU0600046689YQ", function(error, result) {
            logistics.getBrief(para, function(error, result) {
                if (!error) {
                    Output(window.outputOperationElement, 'small', 'red', `[Brief]:${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', error);
                }
            });
        } else if ('BriefEx' == type) {
            // logistics.getBriefEx("JNTCU0600046688YQ", function(error, result) {
            logistics.getBriefEx(para, function(error, result) {
                if (!error) {
                    Output(window.outputOperationElement, 'small', 'red', `[Brief]:${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', error);
                }
            });           
        } else if ('BriefByIndex' == type) {
            //logistics.getBriefByIndex(0, function(error, index, result) {
            logistics.getBriefByIndex(para, function(error, index, result) {
                if (!error) {
                    Output(window.outputOperationElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                }
            });
        } else if ('BriefExByIndex' == type) {
            logistics.getBriefExByIndex(para, function(error, index, result) {
            // logistics.getBriefExByIndex(4, function(error, index, result) {
                if (!error) {
                    Output(window.outputOperationElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                }
            });
        } else if ('BriefInvalid' == type) {
            let paras = para.split(",");
            let num = paras[0];
            let index = paras[1];

            logistics.getBriefInvalid(num, index, function(error, num, index, result) {
                if (!error) {
                    // console.log(result);
                    Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                } else {
                    Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                }
            })
        } else {}
    }

    remove() {
        console.log('TestLogisticsRaw.remove()');
        let tracks4 = "{\"trackElementList\":[{\"time\":\"2017-07-13 11:54:00\",\"facilityName\":\"Track4-1\",\"desc\":\"Track4-1\"}&{\"time\":\"2017-07-07 17:39:09\",\"facilityName\":\"Track4-2\",\"desc\":\"Груз отправлен со склада хранения (<a href= >КСЭ</a>, номер накладной <a href=$f=$http://cse.ru/track.php?order=waybill%amp;number=JNTCU0600639867YQ$ tar target=$_blank$>JNTCU0600639867YQ</a>)\"}]}";
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let logistics = new Logistics(this[abi], this[contractAddress]);

        // update
        logistics.update(account, key, "JNTCU0600639867YQ", "MSK0000027694", "INFO4", "Russian", "GTMS_SIGNED", tracks4, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x1 == parseInt(result.status)) {
                        status = "succeeded";
                    } else {
                        status = "failure";
                    }
                    
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);

                    // getTracks
                    logistics.getTracks("JNTCU0600639867YQ", function(error, result) {
                        if (!error) {
                            Output(window.outputOperationElement, 'small', 'red', `[Track]:</br>${result}`);
                            // remove
                            logistics.remove(account, key, "JNTCU0600639867YQ", function(error, result) {
                                if (!error) {
                                    if ("" != result.status) {
                                        if (0x1 == parseInt(result.status)) {
                                            status = "succeeded";
                                        } else {
                                            status = "failure";
                                        }
                                        // getTracks
                                        logistics.getTracks("JNTCU0600639867YQ", function(error, result) {
                                            if (!error) {
                                                Output(window.outputOperationElement, 'small', 'red', `[Track]:</br>${result}`);
                                            } else {
                                                Output(window.outputOperationElement, 'small', 'red', error);
                                            }
                                        });
                                    } else {
                                        let status = "Try to get status again!";
                                        let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                        Output(window.outputOperationElement, 'small', 'red', string);
                                    }
                                } else {
                                    Output(window.outputOperationElement, 'small', 'red', error);
                                }
                            });
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', error);
                        }
                    });
                } else {
                    let status = "Try to get status again!";
                    let string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        });
    }

    removeEx() {
        console.log('TestLogisticsRaw.removeEx()');
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let account = channels[0].account;
        let key = channels[0].key;

        let status = "";
        let string = "";

        // create and update at first

        let logistics = new Logistics(this[abi], this[contractAddress]);

        // remove
        logistics.remove(account, key, "JNTCU0600046684YQ", function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x0 == parseInt(result.status)) {
                        status = "failure";
                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                        Output(window.outputOperationElement, 'small', 'red', string);
                        return;
                    }
                    // remove
                    logistics.remove(account, key, "JNTCU0600046688YQ", function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if (0x1 == parseInt(result.status)) {
                                    status = "succeeded";
                                } else {
                                    status = "failure";
                                }
                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);
                                return;
                            } else {
                                status = "Try to get status again!";
                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', error);
                        }
                    });
                } else {
                    status = "Try to get status again!";
                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        });

    }

    [getInvalid](handler, num) {
        handler.numberOfInvalidNums(num, function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    handler.getBriefInvalid(num, i, function(error, num, index, result) {
                    // handler.getTracksInvalid(num, i, function(error, num. index, result) {
                        if (!error) {
                            // console.log(result);
                            Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${result}`);
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
                        }
                    })
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', `[${num}-${index}]:</br>${error}`);
            }
        })
    }

    // invalid -> update -> invalid -> invalid -> updateEx -> invalid
    invalid() {
        console.log('TestLogisticsRaw.invalid()');
        let handler = this;
        let tracks5_1 = "{\"trackElementList\":[{\"time\":\"2017-07-13 11:54:00\",\"facilityName\":\"Track5_1\",\"desc\":\"Track5_1\"}&{\"time\":\"2017-07-07 17:39:09\",\"facilityName\":\"Track5_1\",\"desc\":\"Груз отправлен со склада хранения (<a href= >КСЭ</a>, номер накладной <a href=$f=$http://cse.ru/track.php?order=waybill%amp;number=JNTCU0600639867YQ$ tar target=$_blank$>JNTCU0600639867YQ</a>)\"}]}";
        let info5_4 = "{\"error\":null,\"num\":\"JNTCU0600046685YQ\",\"transNum\":\"Info5_3 上海市宜山路900号科技大楼A栋6楼，邮编：200233\",\"model\":\"Info5_3 J-NET俄全通INFO5\",\"destinationCountry\":\"Russian\",\"lastStatus\":\"GTMS_SIGNED\",\"trackElementList\":[{\"type\":\"DC\",\"time\":\"2017-07-13 11:54:00\",\"country\":\"Russian\",\"city\":\"HangZhou\",\"facilityName\":\"Track5_3\",\"timeZone\":\"+3\",\"desc\":\"Товар был успешно доставлен получателю. Спасибо что воспользовались нашими услугами\",\"actionCode\":\"GTMS_SIGNED\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:09\",\"country\":\"Russian\",\"city\":\"ShangHai\",\"facilityName\":\"Track5_3\",\"timeZone\":\"+3\",\"desc\":\"Order received successfully\",\"actionCode\":\"GWMS_ACCEPT\"}&{\"type\":\"DC\",\"time\":\"2017-07-07 17:39:00\",\"country\":\"Russian\",\"city\":\"BeiJing\",\"facilityName\":\"Sorting center of J-NET\",\"timeZone\":\"+3\",\"desc\":\"The parcel is ready to transfer to the courier\",\"actionCode\":\"VISIBLE_UNKOWN\"}]}";
        
        let channels = window.channelClass.get("idle");

        if (0 == channels.length) {
            Output(window.outputOperationElement, 'small', 'red', "No channnel(idle)!");
            return;
        }

        let status = "";
        let string = "";

        let account = channels[0].account;
        let key = channels[0].key;

        let num = "JNTCU0600046685YQ";

        let logistics = new Logistics(this[abi], this[contractAddress]);

        // invalid
        logistics.invalid(account, key, num, function(error, result) {
            if (!error) {
                if ("" != result.status) {
                    if (0x0 == parseInt(result.status)) {
                        status = "failure";
                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                        Output(window.outputOperationElement, 'small', 'red', string);
                        return;
                    }

                    // update
                    logistics.update(account, key, num, "position[1]", "position[1]", "position[1]", "position[1]", tracks5_1, function(error, result) {
                        if (!error) {
                            if ("" != result.status) {
                                if (0x0 == parseInt(result.status)) {
                                    status = "failure";
                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                    Output(window.outputOperationElement, 'small', 'red', string);
                                    return;
                                }
                                // invalid
                                logistics.invalid(account, key, num, function(error, result) {
                                    if (!error) {
                                        if ("" != result.status) {
                                            if (0x0 == parseInt(result.status)) {
                                                status = "failure";
                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                Output(window.outputOperationElement, 'small', 'red', string);
                                                return;
                                            }
                                            // invalid
                                            logistics.invalid(account, key, num, function(error, result) {
                                                if (!error) {
                                                    if ("" != result.status) {
                                                        if (0x0 == parseInt(result.status)) {
                                                            status = "failure";
                                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                            Output(window.outputOperationElement, 'small', 'red', string);
                                                            return;
                                                        }
                                                        // updateEx
                                                        logistics.updateEx(account, key, "JNTCU0600046685YQ", info5_4, function(error, result) {
                                                            if (!error) {
                                                                if ("" != result.status) {
                                                                    if (0x0 == parseInt(result.status)) {
                                                                        status = "failure";
                                                                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                        Output(window.outputOperationElement, 'small', 'red', string);
                                                                        return;
                                                                    }
                                                                    // invalid
                                                                    logistics.invalid(account, key, num, function(error, result) {
                                                                        if (!error) {
                                                                            if ("" != result.status) {
                                                                                if (0x0 == parseInt(result.status)) {
                                                                                    status = "failure";
                                                                                } else {
                                                                                    status = "succeeded";
                                                                                }
                                                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                                Output(window.outputOperationElement, 'small', 'red', string);
                                                                                if (0x1 == parseInt(result.status)) {
                                                                                    handler[getInvalid](logistics, num);
                                                                                }
                                                                            } else {
                                                                                status = "Try to get status again!";
                                                                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                                Output(window.outputOperationElement, 'small', 'red', string);
                                                                            }
                                                                        } else {
                                                                            Output(window.outputOperationElement, 'small', 'red', error);
                                                                        }
                                                                    });
                                                                } else {
                                                                    status = "Try to get status again!";
                                                                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                                    Output(window.outputOperationElement, 'small', 'red', string);
                                                                }
                                                            } else {
                                                                Output(window.outputOperationElement, 'small', 'red', error);
                                                            }
                                                        });
                                                    } else {
                                                        status = "Try to get status again!";
                                                        string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                                        Output(window.outputOperationElement, 'small', 'red', string);
                                                    }
                                                } else {
                                                    Output(window.outputOperationElement, 'small', 'red', error);
                                                }
                                            });
                                        } else {
                                            status = "Try to get status again!";
                                            string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                            Output(window.outputOperationElement, 'small', 'red', string);
                                        }
                                    } else {
                                        Output(window.outputOperationElement, 'small', 'red', error);
                                    }
                                });
                            } else {
                                status = "Try to get status again!";
                                string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                                Output(window.outputOperationElement, 'small', 'red', string);
                            }
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', error);
                        }
                    });
                } else {
                    status = "Try to get status again!";
                    string = `[TransactionHash]:${result.transactionHash}</br>[Status]:${status}</br>[Try]:${result.tryTimes}(times)`;
                    Output(window.outputOperationElement, 'small', 'red', string);
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        });
    }

    debugBrief() {
        console.log('TestLogisticsRaw.debugBrief()');
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // number
        logistics.number(function(error, result) {
            if (!error) {
                for (let i=0; i<result; i++) {
                    // getBriefExByIndex
                    // logistics.getBriefByIndex(i, function(error, index, result) {
                    logistics.getBriefExByIndex(i, function(error, index, result) {
                        if (!error) {
                            // console.log(result);
                            Output(window.outputOperationElement, 'small', 'red', `[Brief${index}]:</br>${result}`);
                        } else {
                            Output(window.outputOperationElement, 'small', 'red', `[Brief${index}]:</br>${error}`);
                        }
                    })
                }
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        })
    }

    numberOfTracks() {
        console.log('TestLogisticsRaw.numberOfTracks()');
        let logistics = new Logistics(this[abi], this[contractAddress]);

        // number
        logistics.numberOfTracks("JNTCU0600046685YQ", function(error, result) {
            if (!error) {
                Output(window.outputOperationElement, 'small', 'red', `[Number]:${result}`);
            } else {
                Output(window.outputOperationElement, 'small', 'red', error);
            }
        })
    }

    do(operation, para1, para2) {
        console.log('TestLogisticsRaw.do(%s, %s)', operation, para1);
        switch(operation) {
            case 'Deploy':
                this.deploy(para1);
                break;
            case 'Setup':
                this.setup();
                break;
            case 'Create':
                // this.create();
                this.createParallel();
                break;
            case 'Update':
                // this.update();
                this.updateParallel();
                break;
            case 'Remove':
                this.removeEx();
                break;
            case 'Invalid':
                this.invalid();
                break;
            case 'DebugBrief':
                this.debugBrief();
                break;
            case 'Number':
                this.numberOfTracks();
                break;
            case 'GetInfo':
                this.get("brief", "JNTCU0600046685YQ");
                break;
            default:
                Output(window.outputOperationElement, 'small', 'red', 'Operation Error!');
                break;
        }
    }
}